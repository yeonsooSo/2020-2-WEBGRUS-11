//마이 페이지 관련 미들웨어

var template = require('./template.js');
var db = require('./db');
var session = require('express-session');

exports.mypage_page = function(request, response)
{
  /*
     세션을 이용해 로그인 되어있는지 확인
     안되어있으면 경고창 띄우고 로그인 페이지로 보냄
  */
  if(request.session === undefined || request.session.isLogined === undefined || request.session.isLogined === false)
  {
    response.end(`<script>
      alert("you are not logged!!");
      window.location.href='/login';
    </script>`);
    return;
  }
  else {
    /*
      로그인 되어있으면 창 띄워주기
    */
    var user_id = request.session.uid;
    db.query("SELECT name, phone, email, year, month, day FROM members WHERE id = ?", [user_id], function(err,data)
    {
      if(err)
      {
        throw err; return;
      }
      else
      {
        var name = data[0].name;
        var phone = data[0].phone;
        var email = data[0].email;
        var birth = data[0].year + '.' + data[0].month + '.' + data[0].day;
        db.query("SELECT idx, date, time, adult, child, baby FROM reservation WHERE id = ?", [user_id], function(err1, data)
        {
          if(err1)
          {
            throw err1;  return;
          }
          else
          {
            var res_cnt = data.length;
            var res_pre = "";     // 이용예정
            for(var i = 0;i<res_cnt;i++)
            {
              var idx = data[i].idx;
              var nop = data[i].adult + data[i].child + data[i].baby;
              var res_date = data[i].date;
              var res_time = data[i].time;
              var s_res_time = "";
              res_date = res_date.getFullYear() + '.' + (res_date.getMonth()+1) + '.' + res_date.getDate();
              if(res_time < 2)
              {
                s_res_time = "AM ";
              }
              else
              {
                s_res_time = "PM ";
              }
              switch(res_time){
                case 1:
                  s_res_time += "10:30";
                  break;
                case 2:
                  s_res_time += "12:00";
                  break;
                case 3:
                  s_res_time += "13:30";
                  break;
                case 4:
                  s_res_time += "15:00";
                  break;
                case 5:
                  s_res_time += "16:30";
                  break;
                case 6:
                  s_res_time += "17:00";
                  break;
                default:
                  s_res_time = "AM/PM 00:00";
              }
              res_pre += `
              <div class="pre_box">
                  <div class="date">
                      <div class="cat">일정</div>
                      <div class="content">${res_date}.(a) ${s_res_time}</div>
                      <input class="cancel" type="button" onClick="check(${idx})" value="x">
                  </div>
                  <div class="headcount">
                      <div class="cat">인원</div>
                      <div class="content">${nop} 명</div>
                  </div>
              </div>
              `
            }

            var title = "MY PAGE";
            var head = template.header(template.login(true));
            var html = template.HTML(title, head, `
                <script>
                function check(idx) {
                  if (confirm("예약을 취소하시겠습니까?")) {
                    window.location.href = '/reservation_delete/?idx='+idx;
                  } else {
                  }
                }
                </script>
                <div class="name">
                    My Page
                </div>

                <div class="sub_name_han">
                    이용예정
                </div>

                ${res_pre};

                <div class="info_btn">
                    <div class="sub_name">
                        INFO
                    </div>
                    <a href = "/update_inform"><button class=revise_info>
                        정보 수정
                    </button></a>
                </div>

                <table class="info_table">
                    <tbody>
                      <tr>
                        <td class="info">ID</td><td>${user_id}</td>
                      </tr>
                      <tr>
                        <td class="info">이름</td><td>${name}</td>
                      </tr>
                      <tr>
                        <td class="info">전화번호</td><td>${phone}</td>
                      </tr>
                      <tr>
                        <td class="info">이메일</td><td>${email}</td>
                      </tr>
                      <tr>
                        <td class="info">생년월일</td><td>${birth}</td>
                      </tr>

                    </tbody>
                </table>

              `, "mypage");
            response.send(html);
          }
        })
      }
    })
  }
}




exports.update_inform = function(request, response){
  /*
     세션을 이용해 로그인 되어있는지 확인
     안되어있으면 경고창 띄우고 로그인 페이지로 보냄
  */
  if(request.session === undefined || request.session.isLogined === undefined || request.session.isLogined === false)
  {
    response.end(`<script>
      alert("you are not logged!!");
      window.location.href='/login';
    </script>`);
    return;
  }
  else {
    /*
      로그인 되어있으면 창 띄워주기
    */
    var title = "update_inform";
    var head = template.header(template.login(false));
    // 대충 테스트용으로 만든거라 바꿔줘야해요!!!
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
              <button type="submit">submit!</button>
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
  if(request.session === undefined || request.session.isLogined === undefined || request.session.isLogined === false)
  {
    response.end(`<script>
      alert("you are not logged!!");
      window.location.href='/login';
    </script>`);
    return;
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
