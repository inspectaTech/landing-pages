# marketing site footer


html
```
  <footer class="marketing-site-footer">
  <div class="row medium-unstack">
    <div class="medium-4 columns">
      <h4 class="marketing-site-footer-name">Yeti Snowcone</h4>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita dolorem accusantium architecto id quidem, itaque nesciunt quam ducimus atque.</p>
      <ul class="menu marketing-site-footer-menu-social simple">
        <li><a href="#"><i class="fa fa-youtube-square" aria-hidden="true"></i></a></li>
         <li><a href="#"><i class="fa fa-facebook-square" aria-hidden="true"></i></a></li>
         <li><a href="#"><i class="fa fa-twitter-square" aria-hidden="true"></i></a></li>
      </ul>
    </div>
    <div class="medium-4 columns">
       <h4 class="marketing-site-footer-title">Contact Info</h4>
      <div class="marketing-site-footer-block">
        <i class="fa fa-map-marker" aria-hidden="true"></i>
        <p>100 W Rincon<br>San Francisco, CA 94015</p>
      </div>
      <div class="marketing-site-footer-block">
        <i class="fa fa-phone" aria-hidden="true"></i>
        <p>1 (800) 555-5555</p>
      </div>
      <div class="marketing-site-footer-block">
        <i class="fa fa-envelope-o" aria-hidden="true"></i>
        <p>yetirules@fakeemail.com</p>
      </div>
    </div>
    <div class="medium-4 columns">
      <h4 class="marketing-site-footer-title">Instagram</h4>
      <div class="row small-up-3">
        <div class="column column-block">
          <img src="https://placehold.it/75" alt="" />
        </div>
        <div class="column column-block">
          <img src="https://placehold.it/75" alt="" />
        </div>
        <div class="column column-block">
          <img src="https://placehold.it/75" alt="" />
        </div>
        <div class="column column-block">
          <img src="https://placehold.it/75" alt="" />
        </div>
        <div class="column column-block">
          <img src="https://placehold.it/75" alt="" />
        </div>
        <div class="column column-block">
          <img src="https://placehold.it/75" alt="" />
        </div>
      </div>
    </div>
  </div>
  <div class="marketing-site-footer-bottom">
    <div class="row large-unstack align-middle">
      <div class="column">
        <p>&copy; 2017 No rights reserved</p>
      </div>
      <div class="column">
        <ul class="menu marketing-site-footer-bottom-links">
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Services</a></li>
          <li><a href="#">Works</a></li>
          <li><a href="#">News</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </div>
    </div>
  </div>
</footer>


```


css
```

.marketing-site-footer {
  background: #2c3840;
  color: #8aa0ae;
  padding: 2rem 0 0;
}

.marketing-site-footer .marketing-site-footer-menu-social a {
  color: #fefefe;
}

.marketing-site-footer .column-block {
  margin-bottom: 30px;
}

.marketing-site-footer > .row {
  margin-bottom: 1rem;
}

@media screen and (max-width: 39.9375em) {
  .marketing-site-footer .columns {
    margin-bottom: 2rem;
  }
}

.marketing-site-footer-name {
  color: #fefefe;
  margin-bottom: 1rem;
  font-size: 2rem;
}

.marketing-site-footer-title {
  color: #fefefe;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.marketing-site-footer-block {
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  margin-bottom: 1rem;
}

.marketing-site-footer-block .fa {
  font-size: 2rem;
  color: #020304;
}

.marketing-site-footer-block p {
  margin-left: 1rem;
  line-height: 1.125rem;
}

.marketing-site-footer-bottom {
  background: #020304;
  padding: 1rem 0;
}

.marketing-site-footer-bottom p,
.marketing-site-footer-bottom .menu {
  margin-bottom: 0;
}

.marketing-site-footer-bottom .marketing-site-footer-bottom-links {
  -webkit-justify-content: flex-end;
      -ms-flex-pack: end;
          justify-content: flex-end;
}

.marketing-site-footer-bottom .marketing-site-footer-bottom-links a {
  color: #8aa0ae;
}

@media screen and (max-width: 63.9375em) {
  .marketing-site-footer-bottom .marketing-site-footer-bottom-links {
    -webkit-justify-content: center;
        -ms-flex-pack: center;
            justify-content: center;
  }
}

@media screen and (max-width: 63.9375em) {
  .marketing-site-footer-bottom {
    text-align: center;
  }
}


```
