console.log("action is loaded");
// https://www.superhi.com/blog/how-to-add-web-design-elements-that-fade-in-and-out-on-scroll

// $(document).on("scroll", function () {
//   var pageTop = $(document).scrollTop();
//   var pageBottom = pageTop + $(window).height();
//   var tags = $(".d3po-action");
//
//   for(let i = 0; i < tags.length; i ++){
//     let tag = tags[i];
//     if ($(tag).position().top < pageBottom) {
//       $(tag).addClass("active");
//       console.log("[above]",$(tag));
//     }else{
//       $(tag).removeClass("active");
//       console.log("[below]",$(tag));
//     }
//   }
//
// })
$(document).foundation();

scroller = window;//".off-canvas-content";//window

$(async function() {
    itsTimeForSomeAction();

    $(scroller).scroll(function() {
      itsTimeForSomeAction();
    });
  });

function itsTimeForSomeAction() {
  var pageTop = $(scroller).scrollTop();
  var pageBottom = pageTop + $(scroller).height();
  var tags = $(".d3po-action");
  let offset_percent = 10;//% above the bottom of the screen?

  for(let i = 0; i < tags.length; i ++){
    let tag = tags[i];
    let top = $(tag).position().top;
    let offset = top * (offset_percent / 100);

    if (top + offset < pageBottom) {
      $(tag).addClass("active");
      // console.log("[above]",$(tag));
    }else{
      $(tag).removeClass("active");
      // console.log("[below]",$(tag));
    }
  }
}//itsTimeForSomeAction
