// 오시는길 페이지

var template = require('./template.js');
var session = require('express-session');

exports.map_page = function(request, response){
  var title = "오시는 길";
  var logined = false;
  var sess = request.session;
  if(sess !== undefined)
  {
    if(sess.isLogined === true)
    {
      logined = true;
    }
  }
  var head = template.header(template.login(logined));
  var html = template.HTML(title, head,
  `
  <div style="color: var(--text-color);  font-size: 20px;  font-weight: bold;  margin-left: 50px;">
         <h2>오시는 길</h2>
  </div>
  <div style = "padding: 40px 160px">
     <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12669.812532712032!2d126.64475469124453!3d37.4500217786968!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357b79ab3057fc7f%3A0xe3e29f05aba35eb0!2z7J247ZWY64yA7ZWZ6rWQIOyaqe2YhOy6oO2NvOyKpA!5e0!3m2!1sko!2skr!4v1609574157256!5m2!1sko!2skr"
     width="100%" height="450" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>
  </div>
   `, "store"
  );
  response.send(html);
}
