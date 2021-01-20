//로그인 관련 미들웨어

var template = require('./template.js');
var db = require('./db');
var session = require('express-session');


// 로그인 페이지를 띄우는 함수
exports.login_page = function(request, response)
{
  /*
     세션을 이용해 로그인 되어있는지 확인
     안되어있으면 경고창 띄우고 로그인 페이지로 보냄
  */
  if(request.session !== undefined)
  {
    if(request.session.islogined)
    {
      response.end(`
      <script>
        alert("you already logged in!!");
        window.location.href='/login'
      </script>`);
      return;
    }
  }
  /*
      로그인 안되어있다면 페이지를 띄워줌
      로그인을 시도하면 post방식으로 '/login_process'로 정보를 보냄
  */
  var title = "Login";
  var head = template.header(template.login(false));
  var html = template.HTML(title, head,`
    <div class="name">
        LOG IN
    </div>
    <section class="login-input-section">
      <form action = "login_process" method = 'post'>
        <div class="login-input-wrap">
            <input placeholder=" ID" name = "id" type="text"></input>
        </div>
        <div class="login-input-wrap pw-wrap">
            <input placeholder=" PW" name = "pwd" type="text"></input>
        </div>
        <div class="login-button">
            <button type="submit">LOG IN</button>
        </div>
    </section>

    <div class="login-option">
        <div><a href="/sign_up">회원가입</a></div>
        <div>|</div>
        <div><a href="/find_ID">아이디 찾기</a></div>
        <div>|</div>
        <div><a href="/find_PW">비밀번호 찾기</a></div>
    </div>
    `, "login");
  response.send(html);
}

// 로인
exports.login_process = function(request, response){
  /*
     세션을 이용해 로그인 되어있는지 확인
     안되어있으면 경고창 띄우고 로그인 페이지로 보냄
  */
  if(request.session !== undefined)
  {
    if(request.session.islogined)
    {
      response.end(`<script>
        alert("you already logged in!!");
        window.location.href='/login';
      </script>`);
      return;
    }
  }
  var post = request.body;
  var id = post.id;
  var pwd = post.pwd;
  //해당 아이디가 있는지 확인
  db.query('SELECT * FROM members WHERE id = ?', [id], function(error, member){
    if(error)
    {
      throw error;
    }
    // 해당아이디가 없다면
    if(member.length === 0 || member[0].pwd !== pwd)
    {
      ret = `<script>
        alert("회원정보가 없습니다.");
        window.location.href='/login';
      </script>`
      response.send(ret);
    }
    else {
      /*
        있다면 로그인되었다는 세션을 만들고 db에 세션을 저장해줌
      */
      request.session.uid = id;
      request.session.isLogined = true;
      request.session.save(function(){
        response.redirect('/');
      });
    }
  });
}

// 로그아웃
exports.logout_process = function(request, response){
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
      세션을 지우고 홈으로 보내
    */
    request.session.destroy(function(){
      request.session;
    });
    response.redirect('/');
  }
}

// 회원가입 프로세스
exports.sign_up_process = function(request, response){
  /*
     세션을 이용해 로그인 되어있는지 확인
     안되어있으면 경고창 띄우고 로그인 페이지로 보냄
  */
  if((request.session !== undefined && request.session.isLogined === true))
  {
    response.end(`<script>
      alert("Something wrong...");
      window.location.href='/login';
    </script>`);
    return;
  }
  else
  {
    var post = request.body;
    var id = post.id;
    var pwd = post.pwd;
    var phone = post.phone;
    var email = post.email;
    var year = post.year;
    var month = post.month;
    var day = post.day;
    var name = post.name;
    /*
      가입하려는 아이디가 있는지 확인
    */
    db.query('SELECT * FROM members WHERE id = ?', [id], function(error, member){
      if(member.length == 0)
      {
        /*
          없다면 계정을 db에 저장하고 홈으로 보냄
        */
        db.query('INSERT INTO members (id, name, pwd, phone, email, year, month, day) values(?,?,?,?,?,?,?,?)',[id, name, pwd, phone, email, year, month, day], function(error2){
          response.writeHead(302, {Location: `/`});
          response.end();
        })
      }
      else {
        /*
           이미 해당 아이디가 있다면 다시 회원가입 페이지로 보냄
        */
        response.end(`<script>
          alert("This ID is already exist!!");
          window.location.href='/sign_up';
        </script>`);
        return;
      }
    })
  }
}

// 회원가입 창 띄우기
exports.sign_up = function(request, response){
  /*
     세션을 이용해 로그인 되어있는지 확인
     안되어있으면 경고창 띄우고 로그인 페이지로 보냄
  */
  if(request.session !== undefined)
  {
    if(request.session.islogined === true)
    {
      response.end(`<script>
        alert("you already logged in!!");
        window.location.href='/login'
      </script>`);
      return;
    }
  }
  /*
    정보를 "대충" 입력받고 '/sign_up_process'로 보냄
    이메일이 제대로 되어있는지 아이디, 비밀번호 길이 등을 체크하는걸 추가해줘야 합니다.
  */
  var title = "SIGN UP";
  var head = template.header(template.login(false));
  var html = template.HTML(title, head,`
  <!-- 디자인은 나중에 제대로 만들어진걸로 바꿔야해요! -->
  <form action="/sign_up_process" method = "post">
  <div id="wrapper">
      <div id="content">

          <div class="name">
              회원가입
          </div>
              <div>
                  <h3 class="join_title">
                      <label for="name">이름</label>
                  </h3>
                  <span class="box int_name">
                      <input type="text" id="name" name="name" class="int" maxlength="20">
                  </span>
                  <span class="error_next_box"></span>
              </div>
              <div>
                  <h3 class="join_title">
                      <label for="id">아이디</label>
                  </h3>
                  <span class="box int_id">
                      <input type="text" id="id" name = "id" class="int" maxlength="20">
                  </span>
                  <span class="error_next_box"></span>
              </div>
              <div>
                  <h3 class="join_title">
                      <label for="pwd">비밀번호</label>
                  </h3>
                  <span class="box int_pwd">
                      <input type="password" id="pwd" name="pwd" class="int" maxlength="20">
                      <span id="alertTxt">사용불가</span>
                  </span>
                  <span class="error_next_box"></span>
              </div>
              <div>
                  <h3 class="join_title">
                      <label for="pwd">비밀번호 확인</label>
                  </h3>
                  <span class="box int_pwd_check">
                      <input type="password" id="pwd2" class="int" maxlength="20">
                  </span>
                  <span class="error_next_box"></span>
              </div>
              <div>
                  <h3 class="join_title">
                      <label for="email">본인확인 이메일
                          <span class="optional">(선택)</span>
                      </label>
                  </h3>
                  <span class="box int_email">
                      <input type="text" id="email" name="email" class="int" maxlength="100" placeholder="선택입력">
                  </span>
                  <span class="error_next_box">이메일 주소를 다시 확인해주세요.</span>
              </div>
              <div>
                  <h3 class="join_title"><label for="phoneNo">휴대전화</label></h3>
                  <span class="box int_mobile">
                      <input type="tel" id="mobile" name="phone" class="int" maxlength="16" placeholder="전화번호 입력">
                  </span>
                  <span class="error_next_box"></span>
              </div>
              <div>
                  <h3 class="join_title"><label for="yy">생년월일</label></h3>

                  <div id="bir_wrap">
                      <div id="bir_yy">
                          <span class="box int_yy">
                              <input type="text" id="yy" name = "year" class="int_bir" maxlength="4" placeholder="년(4자)">
                          </span>
                      </div>

                      <div id="bir_mm">
                          <span class="box int_mm">
                              <select id="mm" name = "month" class="sel">
                                  <option>월</option>
                                  <option value="01">1</option>
                                  <option value="02">2</option>
                                  <option value="03">3</option>
                                  <option value="04">4</option>
                                  <option value="05">5</option>
                                  <option value="06">6</option>
                                  <option value="07">7</option>
                                  <option value="08">8</option>
                                  <option value="09">9</option>
                                  <option value="10">10</option>
                                  <option value="11">11</option>
                                  <option value="12">12</option>
                              </select>
                          </span>
                      </div>

                      <div id="bir_dd">
                          <span class="box int_dd">
                              <input type="text" id="dd" name = "day" class="int_bir" maxlength="2" placeholder="일">
                          </span>
                      </div>

                  </div>
                  <span class="error_next_box"></span>
              </div>

              <div class="btn_area">
                  <button type="submit" id="btnJoin">
                      <span>가입하기</span>
                  </button>
              </div>

          </div>
      </div>
      </form>
    `, "sign_up");
  response.send(html);
}
