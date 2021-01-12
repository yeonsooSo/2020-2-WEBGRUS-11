var template = require('./template.js')
var db = require('./db')
var session = require('express-session');

// 예약 api
exports.reservation_process = function(request, response){
  /*
    로그인 되어있지 않다면 로그인 페이지로...
  */
  if(request.session === undefined || request.session.isLogined === false)
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
    var day = request.day;
    var time = request.time;
    var phone = request.phone;
    var email = request.email;
    var req = request.req;
    var reser_name = request.name;
    var number_Of_People = request.nop;

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
        db.query("INSERT INTO reservation (id, pwd, phone, date, time, nop, email, request) values(?,?,?,?,?,?,?,?)", [id, pwd, phone, date, time, nop, email, request], function(err2){
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
  if(request.session === undefined || request.session.isLogined === false)
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
