// 공지사항 관련 미들웨어
var template = require('./template.js')
var db = require('./db')
var session = require('express-session');

exports.get_list = function(request,response)
{
  var page_num = request.query.page_num;
  if(page_num === undefined || page_num < 1)
  {
    page_num = 1;
  }
  const one_page_element = 10;
  // 이 페이지의 시작 리뷰 idx
  var review_s = (page_num-1) * one_page_element;
  // 이 페이지의 마지막 리뷰 idx
  var review_e = (page_num-1) * one_page_element + one_page_element;
  var write = "";
  if(request.session !== undefined && request.session.uid === 'admin')
  {
    write = "<a href = '/notify_write' id = 'write' class = 'btn'>공지 작성</a>"
  }
  db.query("SELECT idx, title, date  FROM notice ORDER BY idx desc LIMIT ?,?",[review_s, review_e], function(err, data)
  {
    if(err)
    {
      throw err
    }
    else
    {
      if(data.length != 0)
      {
        var notify_list = `<table>`;

        for(var i = 0 ;i < data.length; i++)
        {
          var noti_title = data[i].title;
          var idx = data[i].idx;
          var date = data[i].date;
          date= date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
          notify_list += `<tr>
            <td>${idx}</td>
            <td class="article"><a href="/notify/view/?idx=${idx}">${noti_title}</a></td>
            <td>${date}</td>
          </tr>`
        }
        notify_list+="</table>"
        // 페이지 이동 네비게이션 만들기!
        db.query("SELECT COUNT(*) FROM notice", function(err1, data1)
        {
          if(err1)
          {
            throw err1;
          }
          else
          {
            // 공지 개수
            var sum_of_notifys = data1[0]['COUNT(*)'];
            var sum_of_pages = parseInt(sum_of_notifys/one_page_element);
            if(sum_of_notifys % one_page_element != 0)
            {
              ++sum_of_pages;
            }
            // 페이지 링크 만들기
            var page_links = "";
            // 페이지를 10단위로 끊을때 이 페이지가 있는 곳의 시작 페이지 번호
            var page_s = parseInt(page_num / 10) * 10 + 1;
            // 페이지를 10단위로 끊을때 이 페이지가 있는 곳의 끝 페이지 번호
            var page_e = page_s + 9 > sum_of_pages ? sum_of_pages : page_s + 9;

            for(var i = page_s; i <= page_e; i++)
            {
              page_links += `
                <a href="/notify/?page_num=${i}" class = page-item0>${i}</a>
              `
            }

            var page_prev = page_s - 1 < 1 ? 1 : page_s-1;
            var page_next = page_e + 1 > sum_of_pages ? sum_of_pages : page_e+1;

            // html만들기
            var title = "NOTIFY";
            var logined = false;
            if(request.session !== undefined && request.session.isLogined === true)
            {
              logined = true;
            }
            var head = template.header(template.login(logined));
            var html = template.HTML(title, head,  `
              <div id = "container">
                <a href="/notify/?page_num=1">
                  <h2>공지 및 이벤트</h2>
                </a>
                ${notify_list}
                ${write}
                <div class= "page">
                  <a href="/notify/?page_num=${page_prev}" class = page-item0>←</a>
                  ${page_links}
                  <a href="/notify/?page_num=${page_next}" class = page-item0>→</a>
                </div>
              </div>

            `, "notify"
            );
            response.send(html);
          }
        })
      }
      else{
        var title = "NOTIFY";
        var logined = false;
        if(request.session !== undefined && request.session.isLogined === true)
        {
          logined = true;
        }
        var head = template.header(template.login(logined));
        var html = template.HTML(title, head,  `
          <div id = "container">
            <a href="/notify/?page_num=1">
              <h2>공지 및 이벤트</h2>
            </a>
            <table>
              <tr>
                <td>
                  아직 등록된 공지가 없습니다!
                </td>
              </tr>
            </table>
            ${write}
          </div>
        `, "notify"
        );
        response.send(html);
      }
    }
  })
}

// 글 보여주기 (notify/view 페이지)
exports.get_notify = function(request, response)
{
  var idx = request.query.idx;

  db.query("SELECT * FROM notice WHERE idx = ?", [idx], function(err, data)
  {
    if(err)
    {
      throw err;
    }
    else
    {
      if(data.length != 0)    // 해당 인덱스의 글이 있을때
      {
        var title = data[0].title;
        var date = data[0].date;
        date= date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate()+ '  '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
        var hit = data[0].hit;
        var intext = data[0].intext;
        var logined = false;
        var del_mod = "";
        if(request.session !== undefined && request.session.isLogined === true)
        {
          logined = true;
          if(request.session.uid === "admin")
          {
            del_mod = `<a href='/notify_modify/?idx=${idx}' class="del_mod">수정</a>/<a href='/notify_delete_process/?idx=${idx}'class="del_mod">삭제</a>`
          }
        }
        db.query("UPDATE notice SET hit = ? where idx = ?",[hit + 1, idx], function(err2){
          var head = template.header(template.login(logined));
          var html = template.HTML(title, head,  `
            <div id = "container">
              <a href="/notify/?page_num=1">
                <h2>공지 및 이벤트</h2>
              </a>
              <hr>
              <table style="border:0px">
                <tr style = "text-aling:left">
                  &nbsp&nbsp
                  ${title}
                </tr>
                <tr>
                  <td style="text-align:left">
                    ${date}
                  </td>
                  <td style="text-align:right">
                    조회수: ${hit + 1} &nbsp ${del_mod}
                  </td>
                </tr>
              </table>
              <div style = "padding-left:10px; padding-top: 7px">
                ${intext}
              </div>
            </div>
          `, "notify"
          );
          response.send(html);
        })
      }
      else
      {
        var title = "알수없는 공지사항";
        var logined = false;
        if(request.session !== undefined && request.session.isLogined === true)
        {
          logined = true;
        }
        var head = template.header(template.login(logined));
        var html = template.HTML(title, head,  `
          <div id = "container">
            <a href="/notify/?page_num=1">
              <h2>공지 및 이벤트</h2>
            </a>
            <hr>
            <div>
              <h1>해당 공지를 찾을 수 없습니다!</h1>
            </div>
          </div>
        `, "notify"
        );
        response.send(html);
      }
    }
  })
}
// 공지사항 작성 페이지
exports.notify_write_page = function(request, response)
{
  if(request.session === undefined || request.session.isLogined === undefined || request.session.isLogined === false || request.session.uid != 'admin')     // admin이 아니면
  {
    response.end(`<script>
      alert("Sorry we can't find the page..");
      window.location.href='/';
    </script>`);
    return;
  }
  else {
    var title = "Review Write";
    var logined = true;
    var head = template.header(template.login(logined));

    var html = template.HTML(title, head,
    `
    <div id = "container">
      <a href="/notify/?page_num=1">
        <h2>공지 및 이벤트</h2>
      </a>
      <div style = "border:8px solid rgb(223,223,223); padding: 30px; padding-bottom:60px">
        <form action = "notify_write_process" method = "post">
          <input type = "text" name="title" placeholder="제목" size=30;>
          <br>
          <br>
          <textarea placeholder="내용" id="intext" name = "intext"></textarea>
          <input type="submit" value = "글쓰기" class="sub">
        </form>
      </div>
    </div>
    `, "notify"  );
    response.send(html);
  }
}
// 공지사항 작성 프로세스
exports.notify_write_process = function(request, response)
{
  if(request.session === undefined || request.session.isLogined === undefined || request.session.isLogined === false || request.session.uid != 'admin')     // admin이 아니면
  {
    response.end(`<script>
      alert("Sorry we can't find the page..");
      window.location.href='/';
    </script>`);
    return;
  }
  else {
    var post = request.body;
    var title = post.title;
    var intext = post.intext;
    db.query("INSERT INTO notice (title, intext, date, hit) values(?,?,NOW(),0)", [title, intext], function(err){
      if(err)
      {
        throw err;
      }
      else {
        response.redirect('/notify')
      }
    })
  }
}
// 공지사항 수정 페이지
exports.notify_modify = function(request, response)
{
  if(request.session === undefined || request.session.isLogined === undefined || request.session.isLogined === false || request.session.uid != 'admin')     // admin이 아니면
  {
    response.end(`<script>
      alert("Sorry we can't find the page..");
      window.location.href='/';
    </script>`);
    return;
  }
  else
  {
    var idx = request.query.idx;
    db.query("SELECT title, intext FROM notice WHERE idx = ?", [idx], function(err, data){
      if(err)
      {
        throw err;
      }
      else
      {
        var intext = data[0].intext;
        var notice_title = data[0].title;
        var title = "Review Write";
        var logined = true;
        var head = template.header(template.login(logined));

        var html = template.HTML(title, head,
        `
        <div id = "container">
          <a href="/notify/?page_num=1">
            <h2>공지 및 이벤트</h2>
          </a>
          <div style = "border:8px solid rgb(223,223,223); padding: 30px; padding-bottom:60px">
            <form action = "notify_write_process" method = "post">
              <input type = "text" name="title" placeholder="제목" size=30; value = ${notice_title}>
              <br>
              <br>
              <textarea placeholder="내용" name="intext" id="intext">${intext}</textarea>
              <input type="submit" value = "글쓰기" class="sub">
            </form>
          </div>
        </div>
        `, "notify"  );
        response.send(html);
      }
    })
  }
}
// 공지사항 수정 프로세스
exports.notify_modify_process = function(request, response)
{
  if(request.session === undefined || request.session.isLogined === undefined || request.session.isLogined === false || request.session.uid != 'admin')     // admin이 아니면
  {
    response.end(`<script>
      alert("Sorry we can't find the page..");
      window.location.href='/';
    </script>`);
    return;
  }
  else
  {

  }
}

//공지사항 삭제 프로세스
exports.notify_delete_process = function(request, response)
{
  if(request.session === undefined || request.session.isLogined === undefined || request.session.isLogined === false || request.session.uid != 'admin')     // admin이 아니면
  {
    response.end(`<script>
      alert("Sorry we can't find the page..");
      window.location.href='/';
    </script>`);
    return;
  }
  else
  {
    var idx = request.query.idx;
    db.query("DELETE FROM notice WHERE idx = ?", [idx], function(err){
      if(err)
      {
        throw err;
      }
      else {
        response.redirect('/notify');
      }
    })
  }
}
