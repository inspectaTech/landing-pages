console.log('[quick panel running]');
$(document).ready(function () {

  // $("#sidebar").mCustomScrollbar({
  //     theme: "minimal"
  // });

  $('.qp_dismiss, .qp_overlay').on('click', function () {
      // hide sidebar
      $('#qp_sidebar').removeClass('active');
      // hide overlay
      $('.qp_overlay').removeClass('active');
  });

  $('#qp_panelBtn').on('click', function () {
      // open sidebar
      $('#qp_sidebar').addClass('active');
      // fade in the overlay
      $('.qp_overlay').addClass('active');
      $('.collapse.in').toggleClass('in');
      $('a[aria-expanded=true]').attr('aria-expanded', 'false');
  });

});
