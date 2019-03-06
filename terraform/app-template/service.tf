#
# This terraform file configures the following:
# - task definition for the hello world task
# - ECS Service which is mapped to the task
# - Environment variables are retrieved from param store https://docs.aws.amazon.com/AmazonECS/latest/developerguide/specifying-sensitive-data.html

resource "aws_ecs_task_definition" "app" {
  family                   = "app"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "${var.fargate_cpu}"
  memory                   = "${var.fargate_memory}"

  # task_role_arn
  execution_role_arn = "${aws_iam_role.ecs_execution_role.arn}"

  container_definitions = <<DEFINITION
[
  {
    "cpu": ${var.fargate_cpu},
    "image": "${var.ecr_repository}:${var.ecr_tag}",
    "memory": ${var.fargate_memory},
    "name": "app",
    "networkMode": "awsvpc",
    "portMappings": [
      {
        "containerPort": ${var.app_port}
      }
    ],
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "${local.log_group}",
        "awslogs-region": "${data.aws_region.current.name}",
        "awslogs-stream-prefix": "app"
      }
    },
    "environment": [
      {
          "name": "NODE_ENV",
          "value": "aws"
      }
    ]
  }
]
DEFINITION
}

resource "aws_ecs_service" "main" {
  name            = "${var.module}"
  cluster         = "${data.aws_ecs_cluster.cluster.id}"
  task_definition = "${aws_ecs_task_definition.app.arn}"
  desired_count   = "${var.app_count}"
  launch_type     = "FARGATE"

  network_configuration {
    security_groups = ["${aws_security_group.ecs_tasks.id}"]
    subnets         = ["${data.aws_subnet_ids.private_subnets.ids}"]
  }

  load_balancer {
    target_group_arn = "${aws_lb_target_group.app.arn}"
    container_name   = "app"
    container_port   = "${var.app_port}"
  }
}
