var template = require('./template.js')
var db = require('./db')
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
  var head = template.header(template.navi(), template.login(false));
  var html = template.HTML(title, head,`
      <!-- 디자인은 나중에 제대로 만들어진걸로 바꿔야해요! -->
    <div style = "height:300px;">
    <form action = '/login_process' method = 'post'>
      <input type="text" name = "id" placeholder="아이디">
      <input type="password" name="pwd" placeholder="비밀번호">
      <input type="submit" value="로그인">
    </form>
    <a href = "/find_ID">find ID</a>
    <a href = "/find_PW">find PW</a>
    <a href = "/sign_up">JOIN US </a>
    </div>
    `);
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
  if(request.session === undefined || request.session.isLogined === false)
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
    var birth = post.birth;
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
        db.query('INSERT INTO members (id, name, pwd, phone, email,birth) values(?,?,?,?,?,?)',[id, name, pwd, phone, email, birth], function(error2){
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
  var title = "sign up";
  var head = template.header(template.navi(), template.login(false));
  var html = template.HTML(title, head,`
  <!-- 디자인은 나중에 제대로 만들어진걸로 바꿔야해요! -->
    <div style = "height:300px;">
    <form action = '/sign_up_process' method = 'post'>
      <input type="text" name = "name" placeholder="이름">
      <input type="text" name = "id" placeholder="아이디">
      <input type="password" name="pwd" placeholder="비밀번호">
      <input type="text" name = "email" placeholder="이메일">
      <input type="text" name = "birth" placeholder="생일">
      <input type="text" name = "phone" placeholder="전화번호">
      <input type="submit" value="회원가입">
    </form>
    </div>
    `);
  response.send(html);
}
