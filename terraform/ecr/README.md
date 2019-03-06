# Setup a Common ECR service

This creates an ECR for this application module. It should be shared accross all environments. This implements the ECR setup described in [ADR-0002](../../../docs/adr/0002-ecr-layout.md).

## Terraform configuration

* State file is located at [application]-[module]-ecr/terraform.tfstate
* Policy is stored in ecr-policy.tpl

## Registry Policy

See [Repository Policy Examples](https://docs.aws.amazon.com/AmazonECR/latest/userguide/RepositoryPolicyExamples.html#IAM_allow_other_accounts) for detail on supporting multiple registrys