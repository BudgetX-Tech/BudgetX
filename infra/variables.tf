variable "aws_region" {
  description = "AWS Region to deploy to"
  default     = "ap-south-1"
}

output "ecr_repository_url" {
  value = aws_ecr_repository.data_service.repository_url
}

output "alb_dns_name" {
  value = aws_lb.main.dns_name
}
