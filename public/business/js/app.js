// require('../css/style.scss');
// require('action.j's);
console.log("app.js is loaded");

(function(){
let scroll_element = window;//".off-canvas-content";//window
let wrapper = "body"//".off-canvas-content";//"body"

$(async function() {
  scroll_test();
  // await window.scroll(0,0);
  // console.log("im scrolling");

  // $(window).scroll(function() {
    $(scroll_element).scroll(function() {
    // console.log('scrolling');
    scroll_test();
  });
});

function scroll_test()
{
  // console.log("scroll test running");
  // var winTop = $(window).scrollTop();
  var winTop = $(scroll_element).scrollTop();
  let zoom_start = 75;
  let zoom_rate = 40;

  if(document.querySelector(".sticky-shrinknav-header.fix_me") == null){

    console.log(`[scroll top 5] top: ${winTop} calc: ${ winTop/5} total: ${zoom_start + winTop/5}`);
    console.log(`[scroll top ${zoom_rate}] top: ${winTop} calc: ${ winTop/zoom_rate} total: ${zoom_start + winTop/zoom_rate}`);

    $(".sticky-shrinknav-header").css({
      backgroundSize: "auto " + (zoom_start + winTop/zoom_rate)  + "%"});
  }//if

  // i want the hero banner to move as expected then jump into a fixed position after some scrolling
  // change the action point from 30 to 300 so it at least scrolls to 300
  if (winTop > 300) {
    $(wrapper).addClass("sticky-shrinknav-wrapper");
    $(".sticky-shrinknav-header").addClass("fix_me");//modify the header to switch position to sticky after 300
  } else if(winTop < 50){
    //change it all back but only when its lower than 50
    $(wrapper).removeClass("sticky-shrinknav-wrapper");
    $(".sticky-shrinknav-header").removeClass("fix_me");
  }
}
})();

// $(window).scroll(function() {
// var scroll = $(window).scrollTop();
// $(".zoom").css({
// backgroundSize: (100 + scroll/5)  + "%",
// top: -(scroll/10)  + "%",
//     });
// });
