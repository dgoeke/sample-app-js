variable "app_count" {
  description = "Number of ECS Tasks to deploy"
  default     = 2
}

variable "app_port" {
  default     = 5200
  description = "What port this container will listen on"
}

variable "app_healthcheck_endpoint" {
  default = "/cms-cloud/api/resources"
}

variable "application" {
  default     = "testapp"
  description = "Name of the infrastricutre/application"
}

variable "cloudwatch_retention" {
  default     = 30
  description = "Cloudwatch log retention in days"
}

variable "ecr_repository" {
  default     = "027086599304.dkr.ecr.us-west-2.amazonaws.com/sample-javascript"
  description = "Repository to use for this application"
}

variable "ecr_tag" {
  description = "ECR Image tag to publish"
}

variable "fargate_cpu" {
  default = 256
}

variable "fargate_memory" {
  default = 1024
}

variable "module" {
  default = "testapp-javascript"
}

variable "stack" {
  description = "Application stack (dev,test,imp,prod)"
}
