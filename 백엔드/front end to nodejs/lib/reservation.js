// 예약 관련 미들웨어
var template = require('./template.js')
var db = require('./db')
var session = require('express-session');

exports.reservation_page = function(request, response){
  /*
    로그인 되어있지 않다면 로그인 페이지로...
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
    var userId = request.session.uid;
    // db에서 아이디에 맞는 정보 가져오기
    db.query("SELECT name, phone, email from members WHERE id = ?", [userId], function(err, data)
    {
      // 사용자가 넣어줄 텍스트 area에 미리 넣어줄 값 받기
      var name = data[0].name;
      var phone = data[0].phone;
      var email = data[0].email;
      var title = "예약";
      var head = template.header(template.login(true));
      var html = template.HTML(title, head, `
      <script type="text/javascript" src="JS/reservation.js"></script>
      <form action = "/reservation_process" method = "post">
        <div class="contents_box">
          <div class="res_wrapper">
            <h3>예약</h3>
            <div class="res_box">
              <div class="res_top">
                <table id="calendar" align="center">
                    <tr><!-- label은 마우스로 클릭을 편하게 해줌 -->
                        <td><label onclick="prevCalendar()"><</label></td>
                        <td align="center" id="tbCalendarYM" colspan="5">
                        yyyy년 m월</td>
                        <td><label onclick="nextCalendar()">>
                        </label></td>
                    </tr>
                    <tr>
                        <td align="center"><font color ="#F79DC2">일</td>
                        <td align="center">월</td>
                        <td align="center">화</td>
                        <td align="center">수</td>
                        <td align="center">목</td>
                        <td align="center">금</td>
                        <td align="center"><font color ="skyblue">토</td>
                    </tr>
                </table>
                <hr>
                <h4>날짜</h4>
                <input type="text" readonly id="date" name = "date" value="0000년 00월 00일">
                <hr class="hr95">
                <h4>시간</h4>
                <div class="timeselectwrapper">
                  <table>
                      <tr>
                        <input type="text" id="s1" onclick="timeselect(1)" class="rt" value="00:00" readonly>
                        <input type="text" id="s2" onclick="timeselect(2)" class="rt" value="00:00" readonly>
                        <input type="text" id="s3" onclick="timeselect(3)" class="rt" value="00:00" readonly>
                      </tr>
                      <tr>
                        <input type="text" id="s4" onclick="timeselect(4)" class="rt" value="00:00" readonly>
                        <input type="text" id="s5" onclick="timeselect(5)" class="rt" value="00:00" readonly>
                        <input type="text" id="s6" onclick="timeselect(6)" class="rt" value="00:00" readonly>
                      </tr>
                  </table>
                  <input type="hidden" id = "resTime" name = "time">
                  <br>
                </div>
                <hr class="hr95">
                <h4>인원</h4>
                <input type="text" name="nop" id=hmp onclick="hmpopen()" value="인원을 선택해 주세요" readonly oncontextmenu="return false" ondragstart="return false" onselectstart="return false">
                <i class="fas fa-chevron-down"></i><i class="fas fa-chevron-up"></i>
                <div class="hmplist">
                  <hr class="hr95_in06">
                  <h4>성인</h4>
                  <div class="numbox">
                    <div class="nb minus" onclick="personminus(0)">-</div>
                    <div class="nb num">0</div>
                    <div class="nb plus" onclick="personplus(0)">+</div>
                  </div>
                  <hr class="hr95_in02">
                  <h4>유아</h4>
                  <div class="numbox">
                    <div class="nb minus" onclick="personminus(1)">-</div>
                    <div class="nb num">0</div>
                    <div class="nb plus" onclick="personplus(1)">+</div>
                  </div>
                  <hr class="hr95_in02">
                  <h4>어린이</h4>
                  <div class="numbox">
                    <div class="nb minus" onclick="personminus(2)">-</div>
                    <div class="nb num">0</div>
                    <div class="nb plus" onclick="personplus(2)">+</div>
                  </div>
                  <hr class="hr95_in06">
                  <h4>총 인원</h4>
                  <h5 id="totalnum">0명</h5>
                </div>
              </div>
            </div>
            <br>
            <div class="res_inf">
              <h4>예약자 정보</h4><hr>
              <h5>*예약자</h5> <textarea class="res_inf_text" id="res_name" name="name" rows="1" cols="25">${name}</textarea>
              <h5>*연락처</h5> <textarea class="res_inf_text" id="res_contact" name="phone" rows="1" cols="25">${phone}</textarea>
              <h5>이메일</h5> <textarea class="res_inf_text" id="res_email" name="email" rows="1" cols="25">${email}</textarea>
              <h5>요청사항</h5> <textarea class="res_inf_text" id="res_request" name="req" rows="1" cols="25"></textarea>
            </div>
            <button type="submit" style="padding:0"><div class="resbutton" style="border=0"><div class="rbcen">예약하기</div></div></button>
          </div>
        </div>
      </form>
        `, 'reservation');
        response.send(html);
    })
  }
}


// 예약 api
exports.reservation_process = function(request, response){
  /*
    로그인 되어있지 않다면 로그인 페이지로...
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
    // 세션에서 아이디를 받아옵니다.
    var id = request.session.uid;
    //post로 넘겨준 데이터를 각 변수에 넣어줍니다.
    var post = request.body;
    var date_unparsing = post.date;
    var time = post.time;
    /*
      번호별로 시간 정해줘야해요!
    */
    var phone = post.phone;
    var email = post.email;
    var req = post.req;
    var reser_name = post.name;
    var nop = post.nop;
    // 시간이나 인원수를 안 쓴 경우 경고창 띄우고 홈으로 보냄
    if(time == "" || nop == "인원을 선택해 주세요")
    {
      response.end(`<script>
        alert("One more check your reservation!!!");
        window.location.href='/reservation';
      </script>`);
      return;
    }
    // 띄어쓰기 다 지워줌
    date_unparsing= date_unparsing.replace(/ /gi, "");
    // 예약 날짜 파싱해줌
    var distingdate = ["", "", ""];
    var date = "";
    var cnt = 0;
    for(var i = 0; i < date_unparsing.length - 1; i++)
    {
      if(date_unparsing[i] >='0' && date_unparsing[i] <= '9')
      {
        distingdate[cnt] += date_unparsing[i];
        date += date_unparsing[i];
      }
      else {
        // 만든 날짜 숫자로 변경
        distingdate[cnt] = parseInt(distingdate[cnt]);
        cnt++;
        date += "-";
      }
    }
    // 유효한 예약 날짜인지 확인
    distingdate[cnt] = parseInt(distingdate[cnt]);
    var year = new Date().getFullYear();
    var month = new Date().getMonth();
    var day = new Date().getDay();
    if(distingdate[0] > year || distingdate[0] == year && distingdate[1] > month || distingdate[0] == year && distingdate[1] == month && distingdate[2] >= day)
    {
      response.end(`<script>
        alert("Check your reservation date!!");
        window.location.href='/reservation';
      </script>`);
      return;
    }

    // 예약 인원수 파싱해줌
    var slist = ["", "" ,""];
    var i = 4;
    while('0' <= nop[i] && nop[i] <='9')
    {
      slist[0] += nop[i];
      i++;
    }
    i += 7;
    while('0' <= nop[i] && nop[i] <='9')
    {
      slist[1] += nop[i];
      i++;
    }
    i+= 7;
    while('0' <= nop[i] && nop[i] <='9')
    {
      slist[2] += nop[i];
      i++;
    }
    var adult = parseInt(slist[0]);
    var baby = parseInt(slist[1]);
    var child = parseInt(slist[2]);
    // 글의 비밀번호를 위해 아이디를 검색해 비밀번호를 받아옵니다.
    db.query("SELECT pwd FROM members WHERE id = ?", [id], function(err, data){
      if(err)
      {
        throw err;
      }
      if(data.length != 0)    // 해당 아이디가 있다면...
      {
        // 비밀번호를 받습니다.
        var pwd = data[0].pwd;
        // 받아온 데이터를 db에 넣어줍니다.
        db.query("INSERT INTO reservation (id, pwd, phone, date, time, adult, child, baby, email, request) values(?,?,?,?,?,?,?,?,?,?)", [id, pwd, phone, date, time, adult, child, baby, email, req], function(err2){
          if(err2)
          {
            throw err2;
          }
          // 성공했다면 성공 알림을 띄우고 홈으로 보냅니다.
          response.end(`<script>
            alert("Thanks! Reservated!!");
            window.location.href='/';
          </script>`);
        })
      }
      else {            // 해당 아이디가 없다면 경고문 띄우고 홈으로 보냅니다.
        response.end(`<script>
          alert("you are not real!!");
          window.location.href='/';
        </script>`);
      }
    })
  }
}


//예약 삭제 api
exports.reservation_delete = function(request, response){
  /*
    로그인 되어있지 않다면 로그인 페이지로...
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
    // 세션에서 아이디를 받아옵니다.
    var id = request.session.uid;
    //post로 넘겨준 데이터를 각 변수에 넣어줍니다.
    var post = request.body;
    var idx = request.idx;

    // 해당 예약의 비밀번호와 맞는지 확인하기 위해 아이디를 검색해 비밀번호를 받아옵니다.
    db.query("SELECT pwd FROM members WHERE id = ?", [id], function(err, data){
      if(err)
      {
        throw err;
      }
      if(data.length != 0)    // 해당 아이디가 있다면...
      {
        // 비밀번호를 받습니다.
        var pwd = data[0].pwd;

        // 받아온 데이터를 db에 넣어줍니다.
        db.query("SELECT pwd FROM reservation WHERE idx = ?", [idx], function(err2, reservation_data)
        {
          if(err2)
          {
            throw err2;
          }

          if(reservation_data.length != 0)
          {
            if(reservation_data[0].pwd == pwd)      // 비밀번호가 같다면
            {
              db.query("DELETE FROM reservation WHERE idx = ?", [idx], function(err3){
                if(err3)
                {
                  throw err3;
                }
                // 성공했다면 성공 알림을 띄우고 홈으로 보냅니다.
                response.end(`<script>
                  alert("Reservation was deleted! See you again!");
                  window.location.href='/';
                </script>`);
              })
            }
            else {        // 비밀번호가 다르다
              response.end(`<script>
                alert("Sorry, you are not this reservation's master...");
                window.location.href='/';
              </script>`);
            }
          }
          else {          //해당 예약이 없다면
            response.end(`<script>
              alert("Sorry, can't find that reservation...");
              window.location.href='/';
            </script>`);
          }
        })
      }
      else {            // 해당 아이디가 없다면 경고문 띄우고 홈으로 보냅니다.
        response.end(`<script>
          alert("you are not real!!");
          window.location.href='/';
        </script>`);
      }
    })
  }
}
