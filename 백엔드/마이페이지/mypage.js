//마이 페이지 관련 미들웨어

var template = require('./template.js');
var db = require('./db');
var session = require('express-session');

exports.update_inform = function(request, response){
  /*
     세션을 이용해 로그인 되어있는지 확인
     안되어있으면 경고창 띄우고 로그인 페이지로 보냄
  */
  if(request.session === undefined)
  {
    if(request.session.isLogined === false || request.session.isLogined === undefined)
    {
      response.end(`
      <script>
        alert("you are not logged in!!");
        window.location.href='/login'
      </script>`);
      return;
    }
  }
  else {
    /*
      로그인 되어있으면 창 띄워주기
    */
    var title = "update_inform";
    var head = template.header(template.login(false));
    var html = template.HTML(title, head,`

      <section class="login-input-section">
        <form action = "update_inform_process" method = 'post'>
          <div class="login-input-wrap">
              <input placeholder=" ID" name = "id" type="text" value = "admin"></input>
          </div>
          <div class="login-input-wrap pw-wrap">
              <input placeholder="Original PW" name = "pwd" type="password"></input>
          </div>
          <div class="login-input-wrap pw-wrap">
              <input placeholder="changed PW" name = "changed_pwd" type="password"></input>
          </div>
          <div class="login-input-wrap pw-wrap">
              <input placeholder="name" name = "name" type="text"></input>
          </div>
          <div class="login-input-wrap pw-wrap">
              <input placeholder="email" name = "email" type="text"></input>
          </div>
          <div class="login-input-wrap pw-wrap">
              <input placeholder="year" name = "year" type="text"></input>
          </div>
          <div class="login-input-wrap pw-wrap">
              <input placeholder="month" name = "month" type="text"></input>
          </div>
          <div class="login-input-wrap pw-wrap">
              <input placeholder="day" name = "day" type="text"></input>
          </div>

          <div class="login-button">
              <button type="submit">LOG IN</button>
          </div>
      </section>

      `,);
    response.send(html);
  }
}



exports.update_inform_process = function(request, response){
  /*
     세션을 이용해 로그인 되어있는지 확인
     안되어있으면 경고창 띄우고 로그인 페이지로 보냄
  */
  if(request.session === undefined)
  {
    if(request.session.isLogined === false || request.session.isLogined === undefined)
    {
      response.end(`
      <script>
        alert("you already logged in!!");
        window.location.href='/login'
      </script>`);
      return;
    }
  }
  else
  {
  /*
    로그인 되어있으면 post로 넘겨준 데이터를 받아와서 db업데이트!
    이때 이 아이디로 쓴 모든 review들의 비밀번호를 바꿔줘야해요!
  */
    var post = request.body;
    var id = post.id;
    var pwd = post.pwd;
    var changed_pwd = post.changed_pwd;
    var name = post.name;
    var email = post.email;
    var year = post.year;
    var month = post.month;
    var day = post.day;
    // db에서 원래 비밀번호 확인!
    db.query("SELECT pwd from members WHERE id = ?", [id], function(err, data)
    {
      if(err)
      {
        throw err;
      }
      else
      {
        var original_pwd = data[0].pwd;
        if(original_pwd === pwd && original_pwd !== undefined)
        {
          console.log(original_pwd === pwd && original_pwd !== undefined);
          // 비밀번호가 맞다면 정보 업데이트!!
          db.query("UPDATE members SET pwd = ?, name = ?, email = ?, year = ?, month = ?, day = ? WHERE id = ?", [changed_pwd, name, email, year, month, day, id], function(err1)
          {
              if(err1)
              {
                throw err1;
              }
              else
              {
                // members에 대한 정보는 업데이트 했으므로 쓴 리뷰, 예약들의 비밀번호 바꿔줘야함
                db.query("UPDATE reviews SET pwd = ? WHERE id = ?", [changed_pwd, id], function(err2)
                {
                  if(err2)
                  {
                    throw err2;
                  }
                  else{
                    db.query("UPDATE reservation SET pwd = ? WHERE id = ?", [changed_pwd, id], function(err3)
                    {
                      if(err3)
                      {
                        throw err3;
                      }
                      else
                      {
                        if(id == "admin")     //만약 사이트 주인이라면..
                        {   // 공지사항까지 바꿔버리기
                          db.query("UPDATE notice SET pwd = ? WHERE id = ?", [changed_pwd, id], function(err4)
                          {
                            if(err4)
                            {
                              throw err4;
                            }
                            else
                            {
                              response.end(`<script>
                                alert("Your information was successfully changed!!");
                                window.location.href='/';
                              </script>`);
                            }
                          })
                        }
                        else
                        {
                          response.end(`<script>
                            alert("Your information was successfully changed!!");
                            window.location.href='/';
                          </script>`);
                        }
                      }
                    })
                  }
                })
              }
          })
        }
        else {
          // 비밀번호가 틀리면 홈으로 보내버림
          response.end(`<script>
            alert("Original password was not correct!!");
            window.location.href='/';
          </script>`);
        }
      }
    })
  }
}
