// 리뷰 관련 미들웨어

var template = require('./template.js');
var db = require('./db');
var session = require('express-session');
var path = require('path');
var fs = require('fs');
var cookieParser = require('cookie-parser')

// 리뷰페이지 보여주기
exports.review_page = function(request, response){
  var page_num = request.query.page_num;
  if(page_num === undefined || page_num < 1)
  {
    page_num = 1;
  }
  var review_s = (page_num-1)*6;      // 이 페이지의 시작 리뷰 idx
  var review_e = (page_num-1)*6+6;    // 이 페이지의 마지막 리뷰 idx
  db.query("SELECT * FROM reviews ORDER BY idx desc LIMIT ?,?",[review_s, review_e], function(err, data)
  {
      if(err)
      {
        throw err;  return;
      }
      else
      {
        var review_list = "";
        for(var i = 0; i < data.length;)
        {
          review_list += '<div class="RV">';
          var cnt = 0;
          while(i < data.length){
            if(cnt == 3)
            {
              break;
            }
            var idx = data[i].idx;
            var id = data[i].id;
            var hit = data[i].hit;
            var menu = data[i].menu;
            var intext = data[i].intext;
            var date = data[i].date;
            var date = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
            var filename = data[i].filename;
            var recommendation = data[i].recommendation;
            var stars = "별점: ";
            for(var j = 0;j<recommendation;j++)
            {
              stars += '<i class="fas fa-star"></i>';
            }
            for(var j = recommendation; j<5;j++)
            {
              stars += '<i class="far fa-star"></i>';
            }
            stars = `<span style="color:rgb(150, 150, 150)">${stars}</span>`
            review_list += `

              <div class="RV-item">
                <a href = "/review_watch/?idx=${idx}">
                  <div class="RV-item-box">
                    <div class="RV-item-DAY">
                    ${date}
                    </div>
                    <div class="RV-item-MENU">
                      ${menu}
                    </div>
                    <div class="RV-item-CONTENT">
                       ${intext}
                    </div>
                    <div class="RV-item-STAR">
                    ${stars}
                    </div>
                    <div class="RV-item-HITS">
                    조회수 ${hit}
                    </div>
                  </div>
                </a>
              </div>
            `
            cnt++;
            i++;
          }
          review_list += "</div> "
        }
        db.query("SELECT COUNT(*) FROM reviews", function(err1, data1){
          if(err1)
          {
            throw err;  return;
          }
          else
          {
            //리뷰 개수
            var sum_of_reviews = data1[0]['COUNT(*)'];
            var sum_of_pages = parseInt(sum_of_reviews/6);
            if(sum_of_reviews%6 != 0)
            {
              ++sum_of_pages;
            }

            // 페이지 링크 만들기
            var page_links = "";
            var page_s = parseInt(page_num/10)*10 + 1;
            var page_e = page_s + 9 > sum_of_pages ? sum_of_pages : page_s + 9;

            for(var i = page_s; i <= page_e; i++)
            {
              page_links += `
                <a href="/review/?page_num=${i}" class = page-item0>${i}</a>
              `
            }
            var page_prev = page_s - 1 < 1 ? 1 : page_s-1;
            var page_next = page_e + 1 > sum_of_pages ? sum_of_pages : page_e+1;
            // html만들기

            var title = "REVIEW";
            var logined = false;
            if(request.session !== undefined && request.session.isLogined === true)
            {
              logined = true;
            }
            var head = template.header(template.login(logined));
            var html = template.HTML(title, head,  `
              <div class="nav1">
                <div class="nav1-items">
                  <a href="/review"><div class="nav1-item1">고객리뷰</div></a>
                  <a href="/review_write"><div class="nav1-item2">리뷰작성</div></a>
                </div>
              </div>
              <div class="main">

                ${review_list}

              </div>
              <!--자바스크립트로 더이상 못가게 만들어줘야해!-->
              <div class= "page">
                <a href="/review/?page_num=${page_prev}" class = page-item0>←</a>
                ${page_links}
                <a href="/review/?page_num=${page_next}" class = page-item0>→</a>
              </div>
            `, "review"
            );
            response.send(html);
          }
        })
      }
  })
}

// 리뷰 작성 페이지
exports.review_write = function(request, response){
  if(request.session === undefined || request.session.isLogined === undefined || request.session.isLogined === false)
  {
    response.end(`<script>
      alert("you are not logged!!");
      window.location.href='/login';
    </script>`);
    return;
  }
  else {
    var title = "Review Write";
    var logined = true;
    var head = template.header(template.login(logined));

    var html = template.HTML(title, head,
    `
    <div class="nav1">
        <div class="nav1-items">
          <a href="/review"><div class="nav1-item1">고객리뷰</div></a>
          <a href="/review_write"><div class="nav1-item2">리뷰작성</div></a>
        </div>
        </div>
      </div>
      <form method="POST" enctype="multipart/form-data" action="/review_write_process">
        <div class="main">
          <div class="RV"">
              <div class="RV-item">
                <div class="RV-item-box">
                  <div class="RV-item-DAY">
                    방문일자 : <INPUT TYPE ="DATE" name = "date" id = "calender">
                  </div>
                  <div class="RV-item-MENU">
                    주문메뉴 :
                      <SELECT style="width:143px;height:25px;" name = "menu">
                        <OPTION>불고기 정식</OPTION>
                        <OPTION>파스타 정식</OPTION>
                        <OPTION>점심 특선 메뉴</OPTION>
                        <OPTION>초밥 정식</OPTION>
                        <OPTION>스테이크 정식</OPTION>
                        <OPTION>메뉴 1</OPTION>
                        <OPTION>메뉴 2</OPTION>
                      </select>
                  </div>
                  <div class= "RV-item-st">
                    <input type="radio" name="star" value="1">★
                    <input type="radio" name="star" value="2">★★
                    <input type="radio" name="star" value="3">★★★
                    <input type="radio" name="star" value="4">★★★★
                    <input type="radio" name="star" value="5" checked = "checked">★★★★★
                    </div>
                  <div class= "RV-item-WR">
                     <textarea rows=20 cols=70 style="text-align:left;" border=gray name = "intext"> </textarea>
                  </div>
                  <br>
                  <div class= "RV-item-WR-bt">
                    <input type ="submit" value="작성완료">
                  </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
    <script>
      document.getElementById("calender").value = new Date().toISOString().substring(0, 10);
      // 오늘 날짜로 초깃값 줌
    </script>
    `, "review_write"  );
    response.send(html);
  }
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
    var date = post.date;
    var intext = post.intext;
    var star = post.star;
    var menu = post.menu;
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
          db.query("INSERT INTO reviews (id, pwd, menu, intext, date, filename, recommendation) values(?,?,?,?,?,?,?)", [id, pwd, menu, intext, date, filename, star], function(err2){
            if(err2)
            {
              throw err2;
            }
            response.redirect('/review');  //일단 리뷰 페이지로 보내도록 했습니다.
          })
        }
        else{     //첨부파일이 없는경우
          db.query("INSERT INTO reviews (id, pwd, menu, intext, date, recommendation) values(?,?,?,?,?,?)", [id, pwd, menu, intext, date, star], function(err2){
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
    response.end(`<script>
      alert("you are not logged!!");
      window.location.href='/login';
    </script>`);
    return;
  }
  else {
    // 세션에서 아이디를 받아옵니다.
    var user_id = request.session.uid;
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
          if(memberdata.length != 0 && memberdata[0].pwd === pwd && id === user_id)
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
          else {  // 아이디가 없거나 다르거나 비밀번호가 다르다면 경고를 띄우고 리뷰페이지로..
            console.log(user_id);
            response.end(`<script>
              alert("Sorry.. An account error has occurred...");
              window.location.href='/review_watch/?idx=${idx}';
            </script>`);
          }
        })

      }
      else {     //해당 리뷰가 없다면 경고문 띄우고 리뷰페이지로 보냅니다.
        response.end(`<script>
          alert("Sorry.. We couldn't found the review...");
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


exports.review_watch = function(request, response)
{
  var idx = request.query.idx;
  var title = `${idx}th REVIEW`;
  var logined = false;
  if(request.session !== undefined && request.session.isLogined === true)
  {
    logined = true;
  }
  var head = template.header(template.login(logined));

  db.query("SELECT * FROM reviews WHERE idx = ?", [idx], function(err, data){
    if(err)
    {
      throw err;
    }
    else
    {
      if(data.length == 0) // 해당되는 데이터가 없다면!
      {
        html = template.HTML(title, head,`
          <h1 style = "text-align:center">"Sorry, No reviews were found...."</h1>
          `)
        response.send(html);
      }
      else {
        // 저장값들 받아오고 전처리
        var pwd = data[0].pwd;
        var menu = data[0].menu;
        var intext = data[0].intext;
        var visit_day = data[0].date;
        visit_day = visit_day.getFullYear() + '-' + (visit_day.getMonth()+1) + '-' + visit_day.getDate();
        var hit = data[0].hit + 1;
        var star = "";

        var recommendation = data[0].recommendation;
        for(var j = 0;j<recommendation;j++)
        {
          star += '<i class="fas fa-star"></i>';
        }
        for(var j = recommendation; j<5;j++)
        {
          star += '<i class="far fa-star"></i>';
        }
        star = `<span style = "color:rgb(150, 150, 150)">${star}</span>`
        // 전처리 끝!

        // 조회했으므로 조회수 +1
        db.query("UPDATE reviews SET hit = ? WHERE idx = ?", [hit, idx], function(err2)
        {
          if(err2)
          {
            throw err2;
          }
          else {
            html = template.HTML(title, head, `
              <div class="nav1">
                <div class="nav1-items">
                  <a href="/review"><div class="nav1-item1">고객리뷰</div></a>
                  <a href="/review_write"><div class="nav1-item2">리뷰작성</div></a>
                  </div>
                </div>
              </div>
              <div class="main">
                <div class="RV"">
                    <div class="RV-item">
                      <div class="RV-item-box">
                        <div class="RV-item-DAY">
                          방문일자 : ${visit_day}
                        </div>
                        <div class="RV-item-MENU">
                          주문메뉴 :  ${menu}
                        </div>
                        <div class="RV-item-STAR">
                          별점 : ${star}
                        </div>
                        <div class= "RV-item-WR">
                          ${intext}
                        </div>
                        <form action = "/review_delete_process">
                          <input type = "hidden" name = "idx" value = ${idx}>
                          <div class= "RV-item-WR-bt">
                            <input type ="submit" value="삭제">
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `, "review_watch")
            response.send(html);
          }
        })
      }
    }
  })
}
