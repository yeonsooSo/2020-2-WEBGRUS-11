var db = require('./db');
var session = require('express-session');



exports.get_main = function(request, response){
  var logined = false;
  var sess = request.session;
  if(sess !== undefined)
  {
    if(sess.isLogined === true)
    {
      logined = true;
    }
  }
  var login = ""
  if(logined)
  {
    login = `
    <div class="buttonbox">
      <div class="button"><a href="/logout_process">LOG OUT</a></div>
    </div>
    `;
  }
  else {
    login = `
    <div class="buttonbox">
      <div class="button"><a href="/login">LOG IN</a></div>
      <div class="button"><a href="/sign_up">SIGNUP</a></div>
      <div class="button" id="lgin"><a href="/login"><i class="fas fa-user"></i></a></div>
    </div>
    `;
  }
  html = `
  <!DOCTYPE html>
  <html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <link rel="stylesheet" href="css/main.css">
    <script type="text/javascript" src="JS/main.js"></script>
     <script src="https://use.fontawesome.com/releases/v5.2.0/js/all.js"></script>
    <title>Welcome</title>
  </head>
  <body>
    <div class="container">
      <div class="navbar">
        <div class="navtop">
            <i class="fas fa-stroopwafel"></i>
            <a href="/" style = "text-decoration: none;color:#4E5A66;padding-left:10px;">WEB11</a>
        </div>
        <div class="navmid">
          <div class="blank"></div>
          <ul>
            <li><a class="list1" href="/introduce">INTRODUCE</a></li>
            <li><a class="list1" href="/menu/1">MENU</a></li>
            <li><a class="list1" href="/reservation">RESERVATION</a></li>
            <li><a class="list1" href="/notify">NOTIFY</a></li>
            <li><a class="list1" href="/mypage">MY PAGE</a></li>
          </ul>
          ${login}
        </div>
        <div class="navbot">
        </div>
      </div>

      <div class="contents_box">
        <div class="slide_box">
          <div class="reviews" id="ri"><a href="/review">REVIEWS</a></div>
          <div class="slide" id="s1"></div>
          <div class="slide" id="s2"></div>
          <div class="slide" id="s3"></div>
          <div class="slide" id="s4"></div>
          <div class="slide" id="s5"></div>
          <div class="dotbox">
            <div class="dot" onmouseover="changeslide(1)"></div>
            <div class="dot" onmouseover="changeslide(2)"></div>
            <div class="dot" onmouseover="changeslide(3)"></div>
            <div class="dot" onmouseover="changeslide(4)"></div>
            <div class="dot" onmouseover="changeslide(5)"></div>
          </div>
        </div>
        <div class="reviews"><a href="/review">REVIEWS</a></div>
      </div>

      <div class="footer">
        <div class="footerleft">
          <div class="phonenum">번호 : 000-012-3456</div>
          <div class="adress">주소 : 서울 강남구 삼성로 508 2층</div>
          <div class="time">이용시간 : 10AM ~10PM</div>
        </div>
        <div class="footerright">
          <a href="#"><i class="fab fa-twitter"></i></a>
          <a href="#"><i class="fab fa-instagram"></i></a>
          <a href="#"><i class="fab fa-facebook-f"></i></a>
        </div>
      </div>
    </div>
  </body>
  </html>

  `
  response.send(html);
}
