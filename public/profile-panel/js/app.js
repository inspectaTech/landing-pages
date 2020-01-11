console.log('[quick panel running]');
const {get_pp_contents} = require('./main');
const {get_mobx} = require('./mobx');
const {get_mxr} = require('./mxr');
// [require is not defined](https://stackoverflow.com/questions/19059580/client-on-node-uncaught-referenceerror-require-is-not-defined)
// const Guest = require('./guestContent');
require("../css/profile_panel_module.scss");

document.addEventListener('DOMContentLoaded', async function () {
// $(document).ready(function () {

  // $("#sidebar").mCustomScrollbar({
  //     theme: "minimal"
  // });

  let closeList = document.querySelectorAll('.pp_dismiss, .pp_overlay');

  closeList.forEach( item => {

    // $('.pp_dismiss, .pp_overlay').on('click', function () {
    item.addEventListener("click", function () {

      // hide sidebar
      // $('#pp_sidebar').removeClass('active');
      document.querySelector('#pp_sidebar').classList.remove('active');
      // hide overlay
      // $('.pp_overlay').removeClass('active');
      // document.querySelector('.pp_overlay').classList.remove('active');

    });
    // });

  });

  document.querySelector('#pp_panelBtn').addEventListener('click', function () {

    // $('#pp_panelBtn').on('click', function () {
      // open sidebar
      // $('#pp_sidebar').addClass('active');
      document.querySelector('#pp_sidebar').classList.add('active');
      // fade in the overlay
      // $('.pp_overlay').addClass('active');
      // document.querySelector('.pp_overlay').classList.add('active');// deprecated
      // $('.collapse.in').toggleClass('in');
      // document.querySelector('.collapse.in').classList.toggle('in');// deprecated
      // $('a[aria-expanded=true]').attr('aria-expanded', 'false');
      // });

  });

  get_pp_contents();
  // get_mobx();
  // get_mxr();


});
