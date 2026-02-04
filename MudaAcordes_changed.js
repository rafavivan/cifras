var myimages=new Array()
const triggerLink = document.getElementById('targetimage');
const hoverImage = document.getElementById('A');

triggerLink.addEventListener('mouseenter', () => {
  hoverImage.style.display = "block";
});

triggerLink.addEventListener('mouseleave', () => {
  hoverImage.style.display = "none";
});

document.addEventListener('mousemove', (event) => {
  // Use clientX and clientY for viewport-relative coordinates
  hoverImage.style.left = event.clientX + "px";
  hoverImage.style.top = event.clientY + "px";
});


function MudaImg(towhat) {
  
  var image = document.getElementById("targetimage");
  image.style.visibility = "visible";
  //image.style.display = "block";
  image.targetimage.src=towhat.src
  //document.images.targetimage.src=towhat.src
  //document.images.style.left = towhat.pageX + 15;
  //document.images.top = towhat.pageX + 15;
    
    
  //if (document.images) {
    
    //document.images.targetimage.src=towhat.src
  
  //}
  
}

function preloadimages() {
  for (i=0;i<preloadimages.arguments.length;i++) {
    myimages[i]=new Image()
    myimages[i].src=preloadimages.arguments[i]
  }
}

function hideImg() {
  var image = document.getElementById("targetimage");
  image.style.visibility = "hidden"; // Hides the element and removes it from the flow
  // Alternative: image.style.visibility = "hidden"; // Hides the element but it still occupies its space
  // image.style.display = "none"
}