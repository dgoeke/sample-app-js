#
# This terraform file configures the following:
# - tag lists to be attached to, and used to query for resources
# - ingress security group for the ECS task this module publishes
# - Lookup resources for: ecs cluster, alb security group, vpc, private subnet, and ALB Target group

locals {
  ssm_prefix = "/${var.application}-${var.stack}/"
  cluster    = "${var.application}-${var.stack}-fargate"
  log_group  = "/aws/ecs/${local.cluster}/${var.module}"

  # Tags used to lookup application wide resources
  app_tags {
    Terraform   = "true"
    stack       = "${var.stack}"
    application = "${var.application}"
  }

  # Default tags to apply to all created resources
  default_tags {
    Terraform   = "true"
    stack       = "${var.stack}"
    application = "${var.application}"
    module      = "${var.module}"
  }
}

#
# Create a Target Group which this task will connect itself to
#
resource "aws_lb_target_group" "app" {
  name        = "${var.application}-${var.stack}-${var.module}"
  port        = "${var.app_port}"
  protocol    = "HTTP"
  vpc_id      = "${data.aws_vpc.vpc.id}"
  target_type = "ip"
  tags        = "${merge(local.default_tags, map("module","${var.module}"))}"

  health_check {
    path = "${var.app_healthcheck_endpoint}"
  }
}

#
# Ingress security group for this task
#
resource "aws_security_group" "ecs_tasks" {
  name        = "${var.application}-${var.stack}-${var.module}-ecs-ingress"
  description = "allow inbound access from the ALB only"
  vpc_id      = "${data.aws_vpc.vpc.id}"
  tags        = "${local.default_tags}"

  ingress {
    protocol        = "tcp"
    from_port       = "${var.app_port}"
    to_port         = "${var.app_port}"
    security_groups = ["${data.aws_security_group.lb.id}"]
  }

  # TODO: Consider tightening this to reflect your application requirements
  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

#
# Cloudwatch Log Group
#
resource "aws_cloudwatch_log_group" "log" {
  name              = "${local.log_group}"
  retention_in_days = "${var.cloudwatch_retention}"
  tags              = "${local.default_tags}"
}

#
# Setup execution role for cloudwatch
#
resource "aws_iam_role" "ecs_execution_role" {
  name = "${var.application}-${var.stack}-${var.module}-ecs-execution"
  tags = "${local.default_tags}"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

# Create a policy to allow parameter retrieval by the sample application
data "aws_iam_policy_document" "ecs_iam_policy" {
  statement {
    actions = [
      "ssm:DescribeParameters",
    ]

    resources = [
      "*",
    ]
  }

  statement {
    actions = [
      "ssm:GetParameters",
    ]

    resources = [
      "arn:aws:ssm:*:*:parameter${local.ssm_prefix}*",
    ]
  }
}

resource "aws_iam_policy" "ecs_iam_policy" {
  name   = "${var.application}-${var.stack}-${var.module}-ssm-policy"
  path   = "/"
  policy = "${data.aws_iam_policy_document.ecs_iam_policy.json}"
}

# Lookup existing AmazonECSTaskExecutionRolePolicy role
data "aws_iam_policy" "AmazonECSTaskExecutionRolePolicy" {
  arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy_attachment" "AmazonECSTaskExecutionRolePolicy" {
  role       = "${aws_iam_role.ecs_execution_role.name}"
  policy_arn = "${data.aws_iam_policy.AmazonECSTaskExecutionRolePolicy.arn}"
}

resource "aws_iam_role_policy_attachment" "ecs_iam_policy" {
  role       = "${aws_iam_role.ecs_execution_role.name}"
  policy_arn = "${aws_iam_policy.ecs_iam_policy.arn}"
}

#
# Lookup cluster
#
data "aws_ecs_cluster" "cluster" {
  cluster_name = "${local.cluster}"
}

#
# Lookup LB Security group
#
data "aws_security_group" "lb" {
  vpc_id = "${data.aws_vpc.vpc.id}"
  tags   = "${merge("${local.app_tags}", map("Name","lb-ingress"))}"
}

#
# Lookup VPC ID
#
data "aws_vpc" "vpc" {
  tags = "${local.app_tags}"
}

#
# Private Subnet for task deployment
#
data "aws_subnet_ids" "private_subnets" {
  vpc_id = "${data.aws_vpc.vpc.id}"

  tags = {
    use = "private"
  }
}

#
# Lookup ALB
#
data "aws_lb" "front_end" {
  name = "${var.application}-${var.stack}-lb"
}

data "aws_lb_listener" "front_end" {
  load_balancer_arn = "${data.aws_lb.front_end.arn}"
  port              = 80
}

#
# Region
#
data "aws_region" "current" {}
