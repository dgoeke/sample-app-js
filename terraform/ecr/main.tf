locals {
  application = "testapp"
  module      = "javascript"
  region      = "us-west-2"

  default_tags {
    Terraform   = "true"
    application = "${local.application}"
    module      = "${local.module}"
  }
}

resource "aws_ecr_repository" "repo" {
  name = "${local.application}-${local.module}"
  tags = "${local.default_tags}"
}

resource "aws_ecr_repository_policy" "policy" {
  repository = "${aws_ecr_repository.repo.name}"
  policy     = "${data.template_file.policy.rendered}"
}

data "template_file" "policy" {
  template = "${file("ecr-policy.tpl")}"
}

output "ECR-URL" {
  value = "${aws_ecr_repository.repo.repository_url}"
}

#
# Configure providers for this bootstrap. These are the latest versions as of 1/10/2019
#
provider "aws" {
  version = "~> 1.56.0"
  region  = "${local.region}"
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
    key            = "sample-javascript-ecr/terraform.tfstate"
    dynamodb_table = "terraform-lock"
    region         = "us-west-2"
    encrypt        = "true"
  }
}
