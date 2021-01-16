// 리뷰 관련 미들웨어

var template = require('./template.js');
var db = require('./db');
var session = require('express-session');
var path = require('path');
var fs = require('fs');
var cookieParser = require('cookie-parser')
// 바꿔야 하는 리뷰페이지 보여주기
exports.review_page = function(request, response){
  var title = "aa"
  var logined = false;
  var head = template.header(template.login(logined));

  var html = template.HTML(title, head,
  `
  <!-- 테스트용으로 글쓸수있게 만든거라 제대로 만든 목록 페이지로 바꿔야해요-->
  <form method="POST" enctype="multipart/form-data" action="/review_write_process">
      <input type="text" name = "title" placeholder="제목">
      <textarea name="intext" placeholder = "본문"></textarea>
      <input type="file" name="photo">

      <input type="submit" value="upload" name="submit">
  </form>

  `
  );
  response.send(html);
}


// 리뷰 쓰기 프로세스
exports.review_write_process = function(request, response){
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
    // 세션에서 아이디를 받아옵니다.
    var id = request.session.uid;
    //post로 넘겨준 데이터를 각 변수에 넣어줍니다.
    var post = request.body;
    var title = post.title;
    var intext = post.intext;
    if(request.file === undefined)
    {
        var filename = undefined;
    }
    else {
      var filename = request.file.originalname;
    }
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
        if(filename){     //첩부파일이 있는 경우
          db.query("INSERT INTO reviews (id, pwd, title, intext, date, filename) values(?,?,?,?,NOW(),?)", [id, pwd, title, intext, filename], function(err2){
            if(err2)
            {
              throw err2;
            }
            response.redirect('/review');  //일단 리뷰 페이지로 보내도록 했습니다.
          })
        }
        else{     //첨부파일이 없는경우
          db.query("INSERT INTO reviews (id, pwd, title, intext, date) values(?,?,?,?,NOW())", [id, pwd, title, intext], function(err2){
            if(err2)
            {
              throw err2;
            }
            response.redirect('/review');  //일단 리뷰 페이지로 보내도록 했습니다.
          })
        }
      }
      else {       // 해당 아이디가 없다면 경고문 띄우고 홈으로 보냅니다.
        response.end(`<script>
          alert("you are not real!!");
          window.location.href='/';
        </script>`);
      }
    })
  }
}


exports.review_delete_process = function(request, response){
  /*
     세션을 이용해 로그인 되어있는지 확인
     안되어있으면 경고창 띄우고 로그인 페이지로 보냄
  */
  if(request.session === undefined || request.session.isLogined === undefined || request.session.isLogined === false)
  {
    console.log("shit");
    response.end(`<script>
      alert("you are not logged!!");
      window.location.href='/login';
    </script>`);
    return;
  }
  else {
    // 세션에서 아이디를 받아옵니다.
    var id = request.session.uid;
    //get으로 넘겨준 데이터를 각 변수에 넣어줍니다.
    var idx = request.query.idx;
    // 글의 비밀번호를 위해 글을 검색해 비밀번호를 받아옵니다.
    db.query("SELECT id, pwd, filename FROM reviews WHERE idx = ?", [idx], function(err, data){
      if(err)
      {
        throw err;
      }
      if(data.length != 0)    // 해당 글이 있다면...
      {
        // 비밀번호, 아이디, 첨부파일 이름을 받습니다.
        var pwd = data[0].pwd;
        var id = data[0].id;
        var filename = data[0].filename;

        db.query("SELECT pwd FROM members WHERE id = ?",[id], function(err2, memberdata){
          if(err2)
          {
            throw errr2;
          }
          if(memberdata.length != 0 && memberdata[0].pwd === pwd)
          {
            db.query("DELETE FROM reviews WHERE idx = ?", [idx], function(err3){
              if(err3)
              {
                throw err3;
              }
              if(filename === null)    // 첨부한 파일이 없다면..
              {
                response.redirect('/review');
              }
              else {        // 첨부한 파일이 있었다면...
                fs.unlink(`./uploads/${filename}`, function(err4){
                  if(err4)
                  {
                    throw err4;
                  }
                  response.redirect('/review');
                })
              }
            })
          }
          else {  // 아이디가 없거나 비밀번호가 다르다면 경고를 띄우고 리뷰페이지로..
            response.end(`<script>
              alert("Sorry.. There was an ID error...);
              window.location.href='/review';
            </script>`);
          }
        })

      }
      else {     //해당 리뷰가 없다면 경고문 띄우고 리뷰페이지로 보냅니다.
        response.end(`<script>
          alert("Sorry.. We can't find this review...);
          window.location.href='/review';
        </script>`);
      }
    })
  }
}


exports.recommend_process = function(req, res){
  /*
     세션을 이용해 로그인 되어있는지 확인
     안되어있으면 경고창 띄우고 로그인 페이지로 보냄
  */
  if(req.session === undefined || req.session.isLogined === undefined || req.session.isLogined === false)
  {
    res.end(`<script>
      alert("you are not logged!!");
      window.location.href='/login';
    </script>`);
    return;
  }
  else {
    /*
      저번에 추천했을때 만든 쿠키가있는지 확인
    */
    var idx = req.query.idx;
    console.log(req.cookies);
    if(req.cookies !== undefined && req.cookies['rec5'] !== undefined){
      // 쿠키가 있다면 경고 띄우고 페이지로...
      res.end(`<script>
        alert("you already recommended this review today!");
        window.location.href='/review?idx=${idx}';
      </script>`);
      return;
    }
    else{
      // 쿠키가 없다면
      db.query("SELECT recommendation FROM reviews where idx = ?", [idx], function(err, data)
      {
        if(err)
        {
          throw err;
        }
        if(data.length !== 0)     // 게시글이 있다면...
        {
          // 추천수를 받아와서 +1 해준걸 다시 db에 업데이트 해줌!
          var recommend = data[0].recommendation;
          recommend = parseInt(recommend)+1;
          db.query("UPDATE reviews SET recommendation = ? where idx = ?",[recommend, idx], function(err2){
            if(err2)
            {
              throw err2;
            }
            // 쿠키를 생성해서 24시간동안 추천 못하게!
            res.cookie(`rec${idx}`, idx, {maxAge:1000*60*60*24});
            res.redirect(`/review?idx=${idx}`);
          })
        }
        else {          // 게시글이 없다면...
          res.end(`<script>
            alert("Sorry.. We can't find this review...);
            window.location.href='/review';
          </script>`);
        }
      })
    }
  }
}
