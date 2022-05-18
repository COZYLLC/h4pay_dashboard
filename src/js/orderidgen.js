function orderId() {
  var today = new Date();
  var year = today.getFullYear();
  var month = today.getMonth() + 1;
  var date = today.getDate();
  var time = today.getTime();
  if (parseInt(month) < 10) {
    month = "0" + month;
  }
  if (parseInt(date) < 10) {
    date = "0" + date;
  }
  var order_id = year + "" + month + "" + date + "" + time;
  return order_id;
}

module.exports.orderIdgen = orderId;
