window.onload = function() {
  document.getElementsByClassName("dot")[0].style.backgroundColor="white";
}

var slidenum=1;
var changenum=1;
setInterval(function(){cnchange();},5000);


function changeslide(num2){
  document.getElementById("s"+slidenum).style.opacity=0;
  document.getElementById("s"+num2).style.opacity=1;
  document.getElementsByClassName("dot")[slidenum-1].style.backgroundColor="grey";
  document.getElementsByClassName("dot")[num2-1].style.backgroundColor="white";
  slidenum=num2;
  changenum=num2;
}

function cnchange(){
  changenum++;
  if(changenum==6){
    changenum=1;
  }
  changeslide(changenum);
}
