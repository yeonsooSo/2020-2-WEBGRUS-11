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
var db = require('./lib/db.js')
var review = require('./lib/review.js');
var reservation = require('./lib/reservation.js');
var login = require('./lib/login.js');
var storemap = require('./lib/storemap.js');
var menu = require('./lib/menu.js');
var main_page = require('./lib/main_page.js');
var mypage = require('./lib/mypage.js');
var notify = require('./lib/notify.js')

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
  main_page.get_main(request, response);
})
// 오시는길 페이지
app.get('/store', function(request, response){
  storemap.map_page(request, response);
})
// 메뉴 페이지 (menu의 종류를 param으로 받았음)
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

// 공지사항
app.get('/notify', function(request, response){
  notify.get_list(request, response);
})
// 공지사항 보기
app.get('/notify/view', function(request, response){
  notify.get_notify(request, response);
})
// 공지사항 쓰기
app.get('/notify_write', function(request, response){
  notify.notify_write_page(request, response);
})
// 공지사항 쓰기 api
app.post('/notify_write_process', function(request, response){
  notify.notify_write_process(request, response);
})
// 공지사항 삭제 api
app.get('/notify_delete_process', function(request, response){
  notify.notify_delete_process(request, response);
})
// 공지사항 수정 페이지
app.get('/notify_modify', function(request, response){
  notify.notify_modify(request, response);
})
// 공지사항 수정 api
app.get('/notify_modify_process', function(request, response){
  notify.notify_modify_process(request, response);
})


// 마이페이지
app.get('/mypage', function(request, response){
  mypage.mypage_page(request, response);
})
// 정보 변경 폼
app.get('/update_inform', function(request, response){
  mypage.update_inform(request, response);
})
// 정보 변경 api
app.post('/update_inform_process', function(request, response){
  mypage.update_inform_process(request, response);
})

//리뷰 페이지
app.get('/review', function(request, response){
  review.review_page(request, response);
})
// 리뷰 상세 페이지
app.get('/review_watch', function(request, response){
  review.review_watch(request, response);
})
// 리뷰 작성 페이지
app.get('/review_write', function(request, response){
  review.review_write(request, response);
})
// 리뷰 작성 api
app.post('/review_write_process', upload.single('photo'), function(request, response){
  review.review_write_process(request, response);
});
// 리뷰 삭제 api
app.get('/review_delete_process', function(request, response){
  review.review_delete_process(request, response);
})

// 예약 페이지 api
app.get('/reservation', function(request, response){
  reservation.reservation_page(request, response);
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
