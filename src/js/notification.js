function showNoti(vue, message, type, duration) {
  return new Promise(resolve => {
    vue.$buefy.notification.open({
      message,
       type,
      duration,
      progressBar: true,
     });
     setTimeout(resolve, duration)
  })
}

module.exports.show = showNoti;
