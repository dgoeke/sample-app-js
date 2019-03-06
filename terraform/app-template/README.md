# Application Terraform Stack

This template defines an application to be deployed into an existing
ECS/terraform cluster. This module connects to a cluster and target
group which has been created by the existing infrastructure. This
template defines the following:

- Ingress security group for an application
- Fargate/ECS Service for an application.
- Task Definition for service.
- Listener Rule for ALB
- Target Group for applicaiton deployment

## Infrastructure Connection

This module retrieves the following resource from the VPC and core
infrastructure.

| Resource | Used by | Resolution Mechanism |
|----------|---------|----------------------|
| LB security group | ECS Task Security Group to allow ingress | tags (stack,application,Name) |
| VPC | Security groups, resource resolution| tags (stack,application) |
| private subnets | ECS task for deployment | tags (stack,application)
| ECS/Fargate cluster | ECS Servce | Name (${var.application}-${var.stack}-fargate) |
| LB and Listener | ECS Task for deployment, Listener Rules | Name (${var.application}-${var.stack}-lb)

## Usage

```terraform
variable "tag" {}

module "app" {
  source      = "../../app-template"
  stack       = "dev"
  ecr_tag     = "${var.tag}"
}
```

Prior to terraforming, you will need to set the SSM parameters described in the
database section below.

### Inputs

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| app_count | Number of ECS Tasks to deploy | No | 2 |
| app_port | Application tcp port | No | 80 |
| app_healthcheck_endpoint | Healthcheck endpoint | No | /cms-cloud/api/resources |
| application | Application name (from core infra) | No | testapp |
| ecr_repository | ECR Repository to use | No | 027086599304.dkr.ecr.us-west-2.amazonaws.com/testapp-module1 |
| ecr_tag | ECR Tag to deploy | Yes | - |
| fargate_cpu | Fargate CPU resources | No | 256 |
| fargate_memory | Memory requirement for this task | No | 1024 |
| rds_instance | RDS Instance Type | No | db.t3.micro |
| module  | Name of this module | No | sample-javascript |
| stack | Application stack (dev,test,imp,prod) | Yes | - |

## Database Configuration

This template configures a Postgres RDS database (see rds.tf) for use by the
demo application. Connection parameters for RDS are stored as a `SecureString`
parameter in SSM. Prior to terraforming your app into creation, you should
setup the first 5 parameters listed below.

Parameters are resolved by looking for a parameter called
/APPLICATION-STACK/PARAMETER_NAME in the SSM param store
(ex: /testapp-dev/db_admin_user)

You can set parameters using the aws cli as described below:

`aws ssm put-parameter --name /APPLICATION-STACK/PARAM_NAME --value VALUE --type SecureString --region us-west-2`

Example: `aws ssm put-parameter --name /testapp-dev/db_admin_user --value adminuser --type SecureString --region us-west-2`

### Parameters

- rds_admin_user - admin user for the RDS instance.
- rds_admin_pass - admin password for the RDS instance.
- rds_app_user - Application user for container to connect as.
- rds_app_pass - Application password for container to use.
- rds_app_db - Name of postgres database for application to use, and terraform
  to create.
- rds_app_host - AUTO_CONFIGURED - RDS hostname for the new database service.
  Terraform will set this for you.
