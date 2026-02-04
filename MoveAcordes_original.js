function setVariables() {
  if (document.layers) {
    v=".top=";
    dS="document.";
    sD="";
    y="window.pageYOffset";
  }
  else if (document.all) {
    v=".pixelTop=";
    dS="";
    sD=".style";
    y="document.body.scrollTop";
  } 
  else if (document.getElementById) {
    y="window.pageYOffset";
  }
}

function checkLocation() {
  object="object1";
  yy=eval(y);
  if (document.getElementById)
    document.getElementById("object1").style.top=yy
  else
    eval(dS+object+sD+v+yy)
  setTimeout("checkLocation()",10);
}