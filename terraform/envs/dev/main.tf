locals {
  stack       = "dev"
  application = "testapp"
  region      = "us-west-2"
}

variable "tag" {}

module "app" {
  source  = "../../app-template"
  stack   = "${local.stack}"
  ecr_tag = "${var.tag}"
}

#
# Configure providers for this bootstrap. These are the latest versions as of 1/10/2019
#
provider "aws" {
  version = "~> 1.56.0"
  region  = "us-west-2"
}

provider "template" {
  version = "~> 1.0.0"
}

#
# Configure Terraform
#
terraform {
  required_version = "~> 0.11.11"

  backend "s3" {
    bucket         = "aws-cms-oit-iusg-draas-do-sbx-us-west-2-terraform"
    key            = "testapp-dev/sample-javascript.tfstate"
    dynamodb_table = "terraform-lock"
    region         = "us-west-2"
    encrypt        = "true"
  }
}
