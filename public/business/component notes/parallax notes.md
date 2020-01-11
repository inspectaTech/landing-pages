

### Parallax scrolling for the hero header

modifications:
the off-canvas-content wrapper has to become a viewport scrolling window for all the content
```
  .off-canvas-content{
    height:100vh;
    overflow-y:auto;
    overflow-x: hidden;
    perspective: 2px;
  }
```
> somehow its dependent on the existence of perspective.   

**GOTCHA: i can't set body up like this wrapper and get any good results**

header after css
```
header:after{
  content: " ";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform: translateZ(-1px) scale(1.8);
  background-size: cover;
  z-index: -1;
  background: url(./images/architecture-big-apple-buildings-2579705.png) black center center no-repeat;
}
```
**GOTCHA: The only issue with this is that the js file works of the position of the document scroll not a single elements scroll.**

all the body references in sticky_hero have to be changed
```
  body.sticky-shrinknav-wrapper
  .off-canvas-content.sticky-shrinknav-wrapper
```

app.js
```
  let scroll_element = ".off-canvas-content";//window
  let wrapper = ".off-canvas-content";//"body"

    $(scroll_element).scroll(function() {

    var winTop = $(scroll_element).scrollTop();

      $(wrapper).addClass("sticky-shrinknav-wrapper");

      $(wrapper).removeClass("sticky-shrinknav-wrapper");

```

action.js
```

```

sticky_hero.scss
```
  .sticky-shrinknav-header.fix_me {
    /*position: fixed;*/
    position: sticky;
}
```
**fixed worked when body was the scrolling element. its probably still fixing but i cant see what its fixed to anymore (offscreen)**
**sticky works but the old body padding adjustment pushes it down way to far.**  


sticky_hero.scss
```

.off-canvas-content.sticky-shrinknav-wrapper {
  /*padding-top: 200px $mp;*/
  /*padding-top: 450px $mp;*/
  padding-top: 100px $mp;
}
```
**padding was changed to 100px because it pushed the sticky header down to 450px. I didn't change it to zero because of some scroll animation issues, the next element needed some room**
