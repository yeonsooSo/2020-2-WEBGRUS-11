// 메뉴 페이지
var template = require('./template.js');
var session = require('express-session');

exports.get_menu = function(request, response){

  var title = "";
  var body = "";
  var menuId = request.params.menuId;
  if(menuId === "1")
  {
    title = "추천 메뉴";
    body = `
    <div style = "padding-top:100px">
      <div class="nav1">
        <div class="nav1-items">
          <a href="/menu/1"><div class="nav1-item1">추천메뉴</div></a>
          <a href="/menu/2"><div class="nav1-item2">전체메뉴</div></a>
          <a href="/menu/3"><div class="nav1-item3">음료/주류</div></a>
        </div>

      </div>
      <div class="main">
        <div class="title">
          추천메뉴
        </div>
        <div class="subtitle">
          점심 특선 메뉴는 주말/공휴일에 제공되지 않습니다.
        </div>
        <div class="menues">
          <div class="menu-item">
            <a href='https://ifh.cc/v-DSQEYF' alt='메뉴1' target='_blank'><img src='https://ifh.cc/g/DSQEYF.jpg' border='0' width='180' ></a>
            <div class="menu-item-name">
              뚝배기 불고기 정식
            </div>
            <div class="menu-item-price">
              6900\
            </div>
          </div>
          <div class="menu-item">
             <a href='https://ifh.cc/v-DSQEYF' alt='메뉴1' target='_blank'><img src='https://ifh.cc/g/DSQEYF.jpg' border='0' width='180' ></a>
            <div class="menu-item-name">
              뚝배기 불고기 정식
            </div>
            <div class="menu-item-price">
              6900\
            </div>
          </div>
          <div class="menu-item">
            <a href='https://ifh.cc/v-DSQEYF' alt='메뉴1' target='_blank'><img src='https://ifh.cc/g/DSQEYF.jpg' border='0' width='180' ></a>
            <div class="menu-item-name">
              뚝배기 불고기 정식
            </div>
            <div class="menu-item-price">
              6900\
            </div>
         </div>
        </div>
      </div>
    </div>
    `
  }
  else if(menuId ==="2")
  {
    title = "메뉴";
    body = `

    <div style = "padding-top:100px">
      <div class="nav1">
        <div class="nav1-items">
          <a href="/menu/1"><div class="nav1-item1">추천메뉴</div></a>
          <a href="/menu/2"><div class="nav1-item2">전체메뉴</div></a>
          <a href="/menu/3"><div class="nav1-item3">음료/주류</div></a>
        </div>

      </div>
      <div class="main">
        <div class="title">
          전체메뉴
        </div>
        <div class="subtitle">
          점심 특선 메뉴는 주말/공휴일에 제공되지 않습니다.
        </div>
        <div class="menues">
          <div class="menu-item">
            <a href='https://ifh.cc/v-DSQEYF' alt='메뉴1' target='_blank'><img src='https://ifh.cc/g/DSQEYF.jpg' border='0' width='180' ></a>
            <div class="menu-item-name">
              뚝배기 불고기 정식
            </div>
            <div class="menu-item-price">
              6900\
            </div>
          </div>
          <div class="menu-item">
             <a href='https://ifh.cc/v-DSQEYF' alt='메뉴1' target='_blank'><img src='https://ifh.cc/g/DSQEYF.jpg' border='0' width='180' ></a>
            <div class="menu-item-name">
              뚝배기 불고기 정식
            </div>
            <div class="menu-item-price">
              6900\
            </div>
          </div>
          <div class="menu-item">
            <a href='https://ifh.cc/v-DSQEYF' alt='메뉴1' target='_blank'><img src='https://ifh.cc/g/DSQEYF.jpg' border='0' width='180' ></a>
            <div class="menu-item-name">
              뚝배기 불고기 정식
            </div>
            <div class="menu-item-price">
              6900\
            </div>
          </div>
        </div>
        <div class="menues">
          <div class="menu-item">
            <a href='https://ifh.cc/v-DSQEYF' alt='메뉴1' target='_blank'><img src='https://ifh.cc/g/DSQEYF.jpg' border='0' width='180' ></a>
            <div class="menu-item-name">
              뚝배기 불고기 정식
            </div>
            <div class="menu-item-price">
              6900\
            </div>
          </div>
          <div class="menu-item">
             <a href='https://ifh.cc/v-DSQEYF' alt='메뉴1' target='_blank'><img src='https://ifh.cc/g/DSQEYF.jpg' border='0' width='180' ></a>
            <div class="menu-item-name">
              뚝배기 불고기 정식
            </div>
            <div class="menu-item-price">
              6900\
            </div>
          </div>
          <div class="menu-item">
            <a href='https://ifh.cc/v-DSQEYF' alt='메뉴1' target='_blank'><img src='https://ifh.cc/g/DSQEYF.jpg' border='0' width='180' ></a>
            <div class="menu-item-name">
              뚝배기 불고기 정식
            </div>
            <div class="menu-item-price">
              6900\
            </div>
          </div>
        </div>
              <div class="menues">
          <div class="menu-item">
            <a href='https://ifh.cc/v-DSQEYF' alt='메뉴1' target='_blank'><img src='https://ifh.cc/g/DSQEYF.jpg' border='0' width='180' ></a>
            <div class="menu-item-name">
              뚝배기 불고기 정식
            </div>
            <div class="menu-item-price">
              6900\
            </div>
          </div>
          <div class="menu-item">
             <a href='https://ifh.cc/v-DSQEYF' alt='메뉴1' target='_blank'><img src='https://ifh.cc/g/DSQEYF.jpg' border='0' width='180' ></a>
            <div class="menu-item-name">
              뚝배기 불고기 정식
            </div>
            <div class="menu-item-price">
              6900\
            </div>
          </div>
          <div class="menu-item">
            <a href='https://ifh.cc/v-DSQEYF' alt='메뉴1' target='_blank'><img src='https://ifh.cc/g/DSQEYF.jpg' border='0' width='180' ></a>
            <div class="menu-item-name">
              뚝배기 불고기 정식
            </div>
            <div class="menu-item-price">
              6900\
            </div>
          </div>
        </div>
      </div>
    </div>
    `
  }
  else if(menuId === "3")
  {
    title = "음료 및 주류";
    body = `
    <div style="padding-top:100px">
      <div class="nav1">
        <div class="nav1-items">
          <a href="/menu/1"><div class="nav1-item1">추천메뉴</div></a>
          <a href="/menu/2"><div class="nav1-item2">전체메뉴</div></a>
          <a href="/menu/3"><div class="nav1-item3">음료/주류</div></a>
        </div>

      </div>
      <div class="main">
        <div class="title">
          음료/주류
        </div>
        <div class="subtitle">
          미성년자에게는 주류를 판매하지 않습니다.
        </div>
        <div class="menues">
          <div class="menu-item">
            <a href='https://ifh.cc/v-DSQEYF' alt='메뉴1' target='_blank'><img src='https://ifh.cc/g/DSQEYF.jpg' border='0' width='180' ></a>
            <div class="menu-item-name">
              콜라
            </div>
            <div class="menu-item-price">
              1900\
            </div>
          </div>
          <div class="menu-item">
             <a href='https://ifh.cc/v-DSQEYF' alt='메뉴1' target='_blank'><img src='https://ifh.cc/g/DSQEYF.jpg' border='0' width='180' ></a>
            <div class="menu-item-name">
              뚝배기 불고기 정식
            </div>
            <div class="menu-item-price">
              6900\
            </div>
          </div>
          <div class="menu-item">
            <a href='https://ifh.cc/v-DSQEYF' alt='메뉴1' target='_blank'><img src='https://ifh.cc/g/DSQEYF.jpg' border='0' width='180' ></a>
            <div class="menu-item-name">
              뚝배기 불고기 정식
            </div>
            <div class="menu-item-price">
              6900\
            </div>
          </div>
        </div>
        <div class="menues">
          <div class="menu-item">
            <a href='https://ifh.cc/v-DSQEYF' alt='메뉴1' target='_blank'><img src='https://ifh.cc/g/DSQEYF.jpg' border='0' width='180' ></a>
            <div class="menu-item-name">
              뚝배기 불고기 정식
            </div>
            <div class="menu-item-price">
              6900\
            </div>
          </div>
          <div class="menu-item">
             <a href='https://ifh.cc/v-DSQEYF' alt='메뉴1' target='_blank'><img src='https://ifh.cc/g/DSQEYF.jpg' border='0' width='180' ></a>
            <div class="menu-item-name">
              뚝배기 불고기 정식
            </div>
            <div class="menu-item-price">
              6900\
            </div>
          </div>
          <div class="menu-item">
            <a href='https://ifh.cc/v-DSQEYF' alt='메뉴1' target='_blank'><img src='https://ifh.cc/g/DSQEYF.jpg' border='0' width='180' ></a>
            <div class="menu-item-name">
              뚝배기 불고기 정식
            </div>
            <div class="menu-item-price">
              6900\
            </div>
          </div>
        </div>
              <div class="menues">
          <div class="menu-item">
            <a href='https://ifh.cc/v-DSQEYF' alt='메뉴1' target='_blank'><img src='https://ifh.cc/g/DSQEYF.jpg' border='0' width='180' ></a>
            <div class="menu-item-name">
              뚝배기 불고기 정식
            </div>
            <div class="menu-item-price">
              6900\
            </div>
          </div>
          <div class="menu-item">
             <a href='https://ifh.cc/v-DSQEYF' alt='메뉴1' target='_blank'><img src='https://ifh.cc/g/DSQEYF.jpg' border='0' width='180' ></a>
            <div class="menu-item-name">
              뚝배기 불고기 정식
            </div>
            <div class="menu-item-price">
              6900\
            </div>
          </div>
          <div class="menu-item">
            <a href='https://ifh.cc/v-DSQEYF' alt='메뉴1' target='_blank'><img src='https://ifh.cc/g/DSQEYF.jpg' border='0' width='180' ></a>
            <div class="menu-item-name">
              뚝배기 불고기 정식
            </div>
            <div class="menu-item-price">
              6900\
            </div>
          </div>
        </div>
      </div>
    </div>
    `
  }
  // 로그인 되어있는지 확인
  var logined = false;
  var sess = request.session;
  if(sess !== undefined)
  {
    if(sess.isLogined === true)
    {
      logined = true;
    }
  }

  // 페이지의 메뉴에 따라 강조되는 글
  var jspart = `
  <script>
    var temp = document.getElementsByClassName( "nav1-item${menuId}" );
    temp[0].style.color = "black";
  </script>
  `

  var head = template.header(template.login(logined));
  var html = template.HTML(title, head,
  `
    ${body}
    ${jspart}
   `, "menu"
  );
  response.send(html);
}
