const express = require('express')
const app = express()
var fs = require('fs');
var qs = require('querystring')
var sanitizeHtml = require('sanitize-html')
var path = require('path');
var bodyParser = require('body-parser');
var compression = require('compression');
var session = require('express-session');
var cookieParser = require('cookie-parser')
var MySQLStore = require('express-mysql-session')(session);
var options = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '1234',
  database: 'web11'
};
var sessionStore = new MySQLStore(options);

var multer = require('multer'); // express에 multer모듈 적용 (for 파일업로드)

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      file.originalname = new Date().valueOf() + path.extname(file.originalname);
      /*
        이렇게 해줘야 uploads에 올라가는 파일 이름이랑 db에 올라가는
        파일 이름이 같아요.
        path.extname은 원래 이름떼고 확장자명만 가져오는 함수
      */
      cb(null, file.originalname);
    }
  }),
});
// 입력한 파일이 uploads/ 폴더 내에 저장된다.
// multer라는 모듈이 함수라서 함수에 옵션을 줘서 실행을 시키면, 해당 함수는 미들웨어를 리턴한다.
app.use(express.static('uploads'));

// 우리가 만든 라이브러리 사용
var template = require('./lib/template.js');
var db = require('./lib/db')
var review = require('./lib/review');
var reservation = require('./lib/reservation');
var login = require('./lib/login');
var storemap = require('./lib/storemap');
var menu = require('./lib/menu');


app.use(session({
 secret: '@#@$MYSIGN#@$#$',
 resave: false,
 saveUninitialized: true,
 store: sessionStore,
 cookie:{
   maxAge: 1000*60*360    // 6시간 동안 유지
 }
}));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(compression());


// 페이지 시작

// 메인 페이지
app.get('/', function(request, response){
  var title = 'Welcome';
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
  `  `
  );
  response.send(html);
})
// 오시는길 페이지
app.get('/store', function(request, response){
  storemap.map_page(request, response);
})
// 메뉴 menu의 종류를 param으로 받기
app.get('/menu/:menuId', function(request, response){
  menu.get_menu(request,response);
})

// 로그인 페이지
app.get('/login', function(request, response){
  login.login_page(request, response);
})
// 로그인 api
app.post('/login_process', function(request, response){
  login.login_process(request, response);
})
//로그아웃 api
app.get('/logout_process', function(request, response){
  login.logout_process(request, response);
})
// 아이디 찾기 페이지
app.get('/find_ID', function(request, response){

})
// 비밀번호 찾기 페이지
app.get('/find_PW', function(request, response){

})
// 회원가입 페이지
app.get('/sign_up', function(request, response){
  login.sign_up(request, response);
})
// 회원가입 api
app.post('/sign_up_process', function(request, response){
  login.sign_up_process(request, response);
})
//리뷰 페이지
app.get('/review', function(request, response){
  review.review_page(request, response);
})
// 리뷰 작성 api
app.post('/review_write_process', upload.single('photo'), function(request, response){
  review.review_write_process(request, response);
});
// 리뷰 삭제 api
app.get('/review_delete_process', function(request, response){
  review.review_delete_process(request, response);
})
// 예약 api
app.post('/reservation_process', function(request, response){
  reservation.reservation_process(request, response);
})
// 예약 삭제 api
app.get('/reservation_delete', function(request, response){
  reservation.reservation_delete(request, response);
})


// 에러시 출력 페이지
app.use(function(req, res, test){
  res.status(404).send('Sorry cant find that!!');
})

app.use(function(err, req, res, next){
  console.log(err);
  res.status(500).send("Something wrong!");
})

app.listen(3000)
