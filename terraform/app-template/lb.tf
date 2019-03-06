#
# Create rules for which URLs will map to this module
#
resource "aws_lb_listener_rule" "app" {
  listener_arn = "${data.aws_lb_listener.front_end.arn}"

  action {
    type             = "forward"
    target_group_arn = "${aws_lb_target_group.app.arn}"
  }

  # CHANGEME: Set any routing contitions you need
  condition {
    field  = "path-pattern"
    values = ["/*"]
  }
}
