jQuery.extend(jQuery.validator.messages, {
  required: "必填字段",
  remote: "请修正该字段",
  email: "请输入正确格式的电子邮件",
  url: "请输入合法的网址",
  date: "请输入合法的日期",
  dateISO: "请输入合法的日期 (ISO).",
  number: "请输入合法的数字",
  number4:"请输入合法的数字,小数点后保留4位",
  digits: "只能输入整数",
  creditcard: "请输入合法的信用卡号",
  equalTo: "请再次输入相同的值",
  largeTo: "请确保结束日期大于开始日期(或者结束时间大于开始时间)",
  accept: "请输入拥有合法后缀名的字符串",
  maxlength: jQuery.validator.format("请输入一个长度最多是 {0} 的字符串"),
  minlength: jQuery.validator.format("请输入一个长度最少是 {0} 的字符串"),
  rangelength: jQuery.validator.format("请输入一个长度介于 {0} 和 {1} 之间的字符串"),
  range: jQuery.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
  max: jQuery.validator.format("请输入一个最大为 {0} 的值"),
  min: jQuery.validator.format("请输入一个最小为 {0} 的值")
});
// 手机号码验证
jQuery.validator.addMethod("isMobile", function(value, element) {
  var length = value.length;
  var mobile = /^((\+?86)|(\(\+86\)))?(13[0123456789][0-9]{8}|15[012356789][0-9]{8}|18[0123456789][0-9]{8}|147[0-9]{8}|1349[0-9]{7}|17[0123456789][0-9]{8})$/
  return this.optional(element) || (length == 11 && mobile.test(value));
}, "请正确填写您的手机号码");

//节点编号 serialNumber
jQuery.validator.addMethod("serialNumber", function(value, element) {
  var tel = /^ffffff100000[a-z0-9]{4}$/;
  return this.optional(element) || (tel.test(value));
}, "节点编号格式为ffffff100000****");


//楼层数
jQuery.validator.addMethod("floorNum", function(value, element) {
  var tel = /^[1-9][0-9]{0,2}$/;
  return this.optional(element) || (tel.test(value));
}, "请输入正确的楼层数量");

