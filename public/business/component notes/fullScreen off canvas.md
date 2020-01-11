
offCanvas basic

[file download](https://foundation.zurb.com/sites/download/)   
[installation](https://foundation.zurb.com/sites/docs/installation.html)   
[offCanvas guide](https://foundation.zurb.com/sites/docs/off-canvas.html)   
```
  <link rel="stylesheet" href="./css/foundation.min.css">
  <script src="./js/foundation.min.js" defer ></script>
```
**GOTCHA: offCanvas doensn't run without foundations js files**
**GOTCHA: Chrome has a problem using foundations CDN so i had to download the css and js files**

html
```
  <div class="off-canvas position-left" id="offCanvas" data-off-canvas>

    <!-- Close button -->
    <button class="close-button" aria-label="Close menu" type="button" data-close>
      <span aria-hidden="true">&times;</span>
    </button>

    <!-- Menu -->
    <ul class="vertical menu">
      <li><a href="#">Foundation</a></li>
      <li><a href="#">Dot</a></li>
      <li><a href="#">ZURB</a></li>
      <li><a href="#">Com</a></li>
      <li><a href="#">Slash</a></li>
      <li><a href="#">Sites</a></li>
    </ul>

  </div>

  <div class="off-canvas-content" data-off-canvas-content>
    <!-- Your page content lives here -->
  </div>
```
**no special css needed for basic except foundaions**

[fullScreen off canvas]()   

html
```
  <div id="offcanvas-full-screen" class="offcanvas-full-screen" data-off-canvas data-transition="overlap">
  <div class="offcanvas-full-screen-inner">
    <button class="offcanvas-full-screen-close" aria-label="Close menu" type="button" data-close>
      <span aria-hidden="true">&times;</span>
    </button>

    <ul class="offcanvas-full-screen-menu">
      <li><a href="#">Home</a></li>
      <li><a href="#">About us</a></li>
      <li><a href="#">Services</a></li>
      <li><a href="#">Contact us</a></li>
    </ul>
  </div>
</div>

<div class="off-canvas-content" data-off-canvas-content>
  <div class="top-bar">
    <div class="top-bar-title">
      <strong>Site Title</strong>
    </div>
    <div class="top-bar-right">
      <button class="menu-icon dark" type="button" data-toggle="offcanvas-full-screen"></button>
    </div>
  </div>
</div>


```

css
```


.offcanvas-full-screen {
  position: fixed;
  z-index: 1;
  transition: -webkit-transform 0.3s ease-in-out;
  transition: transform 0.3s ease-in-out;
  transition: transform 0.3s ease-in-out, -webkit-transform 0.3s ease-in-out;
  -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
  background: #0a0a0a;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  -webkit-transform: translateX(-100%);
      -ms-transform: translateX(-100%);
          transform: translateX(-100%);
  overflow-y: auto;
}

[data-whatinput='mouse'] .offcanvas-full-screen {
  outline: 0;
}

.offcanvas-full-screen.is-transition-overlap {
  z-index: 10;
}

.offcanvas-full-screen.is-transition-overlap.is-open {
  box-shadow: 0 0 10px rgba(10, 10, 10, 0.7);
}

.offcanvas-full-screen.is-open {
  -webkit-transform: translate(0, 0);
      -ms-transform: translate(0, 0);
          transform: translate(0, 0);
}

.offcanvas-full-screen.is-open ~ .off-canvas-content {
  -webkit-transform: translateX(100%);
      -ms-transform: translateX(100%);
          transform: translateX(100%);
}

.offcanvas-full-screen.is-transition-push::after {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 1px;
  box-shadow: 0 0 10px rgba(10, 10, 10, 0.7);
  content: " ";
}

.offcanvas-full-screen.is-transition-overlap.is-open ~ .off-canvas-content {
  -webkit-transform: none;
      -ms-transform: none;
          transform: none;
}

.offcanvas-full-screen-inner {
  padding: 1rem;
  text-align: center;
}

.offcanvas-full-screen-menu {
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
  -webkit-flex-wrap: wrap;
      -ms-flex-wrap: wrap;
          flex-wrap: wrap;
}

.offcanvas-full-screen-menu > li {
  -webkit-flex: 0 0 auto;
      -ms-flex: 0 0 auto;
          flex: 0 0 auto;
}

[data-whatinput='mouse'] .offcanvas-full-screen-menu > li {
  outline: 0;
}

.offcanvas-full-screen-menu > li > a {
  display: block;
  padding: 0.7rem 1rem;
  line-height: 1;
}

.offcanvas-full-screen-menu input,
.offcanvas-full-screen-menu select,
.offcanvas-full-screen-menu a,
.offcanvas-full-screen-menu button {
  margin-bottom: 0;
}

.offcanvas-full-screen-menu > li {
  -webkit-flex: 0 0 100%;
      -ms-flex: 0 0 100%;
          flex: 0 0 100%;
  max-width: 100%;
}

.offcanvas-full-screen-menu > li > a {
  -webkit-justify-content: flex-start;
      -ms-flex-pack: start;
          justify-content: flex-start;
  -webkit-align-items: flex-start;
      -ms-flex-align: start;
          align-items: flex-start;
}

.offcanvas-full-screen-menu a {
  color: #fefefe;
}

.offcanvas-full-screen-menu a:hover {
  color: #b2b2b2;
}

.offcanvas-full-screen-close {
  color: #fefefe;
  font-size: 5rem;
}

.offcanvas-full-screen-close:hover {
  color: #b2b2b2;
}



```
