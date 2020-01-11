html
```
  <!DOCTYPE html>
  <html lang="en" dir="ltr">
    <head>
      <meta charset="utf-8">
      <title></title>
      {{>business_links}}
      <style media="screen">
        .biz-hero{
            width:100%; height: 40px;
            border:1px solid #ccc;
        }
        .biz-top-menu{width:100%; border:1px solid red;
          display: flex;
        }
      </style>
    </head>
    <body>
    <!-- <div class="biz-hero">
      <div class="biz-top-menu">

      </div>
    </div> -->
      <header class="sticky-shrinknav-header">
        <div class="sticky-shrinknav-header-title intro-text">YOU CHOOSE THE ADVENTURE</div>
        <div class="sticky-shrinknav-header-title main-text">WE MAKE IT HAPPEN</div>
        <div class="sticky-shrinknav-header-title sub-text">We’ll help you find the business experience you’ve always dreamed of and tailor it to your needs</div>
        <div class="menu-container sticky-shrinknav-menu">
          <h2 class="brand-title">BusinessTech</h2>
          <ul class="menu align-center">
            <li><a href="#">ABOUT</a></li>
            <li><a href="#">INVESTORS</a></li>
            <li><a href="#">ENTREPRENEURS</a></li>
            <li class="auth-btn"><a href="#">Sign Up</a></li>
            <li class="auth-btn"><a href="#">Sign In</a></li>
          </ul>
        </div>
      </header>
      <div class="filler" style="width:100%; background: #ccc; height:1000px">

      </div>


    </body>
  </html>

```
links
```
  <!-- Latest compiled and minified CSS -->
  <link rel="stylesheet" href="./css/style.css">
  <!-- <link rel="stylesheet" href="node_modules/foundation-sites/dist/css/foundation-sites.css"> -->
  <!-- Compressed CSS -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/foundation-sites@6.5.3/dist/css/foundation.min.css" integrity="sha256-GSio8qamaXapM8Fq9JYdGNTvk/dgs+cMLgPeevOYEx0= sha384-wAweiGTn38CY2DSwAaEffed6iMeflc0FMiuptanbN4J+ib+342gKGpvYRWubPd/+ sha512-QHEb6jOC8SaGTmYmGU19u2FhIfeG+t/hSacIWPpDzOp5yygnthL3JwnilM7LM1dOAbJv62R+/FICfsrKUqv4Gg==" crossorigin="anonymous">
  <link href="https://fonts.googleapis.com/css?family=Montserrat&display=swap" rel="stylesheet">
  <!-- Compressed JavaScript -->

  <!-- jQuery library -->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js" defer ></script>

  <!-- Popper JS -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" defer ></script>

  <!-- Latest compiled JavaScript -->
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" defer ></script>

  <script src="https://cdn.jsdelivr.net/npm/foundation-sites@6.5.3/dist/js/foundation.min.js" integrity="sha256-mRYlCu5EG+ouD07WxLF8v4ZAZYCA6WrmdIXyn1Bv9Vk= sha384-KzKofw4qqetd3kvuQ5AdapWPqV1ZI+CnfyfEwZQgPk8poOLWaabfgJOfmW7uI+AV sha512-0gHfaMkY+Do568TgjJC2iMAV0dQlY4NqbeZ4pr9lVUTXQzKu8qceyd6wg/3Uql9qA2+3X5NHv3IMb05wb387rA==" crossorigin="anonymous" defer ></script>
  <script src="./js/dist/bundle.js" defer ></script>
  <!-- <script src="./js/app.js" defer ></script> -->
```

js
```
  // require('../css/style.scss');

  $(function() {
    $(window).scroll(function() {
      console.log('scrolling');
      var winTop = $(window).scrollTop();
      if (winTop >= 30) {
        $("body").addClass("sticky-shrinknav-wrapper");
      } else{
        $("body").removeClass("sticky-shrinknav-wrapper");
      }
    });
  });

```
css
```

  body {
    padding-top: 330px;
  }

  .sticky-shrinknav-menu {
    position: absolute;
    left: 50%;
    -webkit-transform: translateX(-50%);
        -ms-transform: translateX(-50%);
            transform: translateX(-50%);
    /* bottom: 0; */
    top:0;
    height: 3.75rem;
    line-height: 3.75rem;
    width: 100%;
    background-color: rgba(23, 121, 186, 0.1);
    transition: all 0.5s ease;
  }

  .sticky-shrinknav-menu > li {
    border-radius: 2px;
    transition: all 0.3s ease;
  }

  .sticky-shrinknav-menu > li:hover {
    box-shadow: 0 0 0 1px #fefefe;
  }

  .sticky-shrinknav-menu a {
    color: #fefefe;
  }

  .sticky-shrinknav-header-title {
    transition: all 0.3s ease;
    position: relative;
    -webkit-transform: translateY(-1.875rem);
        -ms-transform: translateY(-1.875rem);
            transform: translateY(-1.875rem);
    margin-bottom: 0;
    color: #fefefe;
  }

  .sticky-shrinknav-header {
    width: 100%;
    height: 400px;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-align-items: center;
        -ms-flex-align: center;
            align-items: center;
    -webkit-justify-content: center;
        -ms-flex-pack: center;
            justify-content: center;
    background-color: #2196e3;
    text-align: center;
    position: fixed;
    top: 0;
    left: 0;
    overflow: hidden;
    transition: all 0.5s ease;
    background: url("../images/architecture-big-apple-buildings-2579705.png") black center center no-repeat;
  }
  .menu > li > a {
      display: block;
      padding: 0.7rem 1rem;
      line-height: 1;
      text-decoration: none;
  }
  .menu{
    font-family: Montserrat;
    font-style: normal;
    font-weight: bold;
    font-size: .8em;
    line-height: 22px;
    text-align: center;
  }
  .menu > li, .menu.horizontal > li {
      -webkit-flex: 0 0 auto;
      -ms-flex: 0 0 auto;
      flex: 0 0 auto;
  }
  .menu {
      margin: 0;
      list-style-type: none;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      -webkit-flex-wrap: nowrap;
      -ms-flex-wrap: nowrap;
      flex-wrap: nowrap;
      -webkit-align-items: center;
      -ms-flex-align: center;
      align-items: center;
      width: 100%;
  }
  ul.menu{
    padding:unset;
    width:unset;
    margin: .5rem;
  }
  .menu-container{
    display:flex;
    justify-content: space-between;
    border-bottom: thin solid #ccc;
  }
  .align-center {
      -webkit-justify-content: center;
      -ms-flex-pack: center;
      justify-content: center;
  }

  body.sticky-shrinknav-wrapper {
    padding-top: 130px;
  }

  body.sticky-shrinknav-wrapper .sticky-shrinknav-header {
    height: 3.75rem;
    background-color: rgba(23, 121, 186, 0.9);
  }

  body.sticky-shrinknav-wrapper .sticky-shrinknav-header .sticky-shrinknav-header-title {
    -webkit-transform: scale(0);
        -ms-transform: scale(0);
            transform: scale(0);
    transition: all 0.3s ease;
  }
  .brand-title{
    width: auto;
    color: #ffff;
    margin: unset;
    padding: 0 1rem;
    vertical-align: top;
    font-family: Montserrat;
  }
  .auth-btn{
    border: 1px solid #fff;
    margin: .25rem;
  }
  .sticky-shrinknav-header {
    flex-flow:column;
  }

  .intro-text, .main-text, .sub-text{
    font-family: Montserrat;
  }
  .intro-text{
    margin-top: 3em;
    font-size: 1em;
    font-weight: bold;
  }
  .main-text{
    font-size: 3.5em;
    line-height: 1.5em;
    font-weight: bold;
  }
  .sub-text{
    width:45%;
  }

```
