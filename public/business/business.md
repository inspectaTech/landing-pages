# business notes

### To add to a new server
server.js

add the component to the server's public dir

prep router
```
  const businessRouter = require("../public/business/routers/business");
```

add views
```
const businessPath = path.join(__dirname,"../public/business/views");

//setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', [viewsPath, appsPath, alightPath, /*oauthClientPath,*/ businessPath]);//this works
```
**make sure view engine is set**

add partials
```
  const bizPartialsPath = path.join(__dirname,"../public/business/views");
  hbs.registerPartials(bizPartialsPath);
```

make sure public directory path is set and add public directory and desired path
```
  const publicDirectoryPath = path.join(__dirname,"../public");
  app.use('/brand',express.static(publicDirectoryPath));
```
> NOTE: you dont need brand/:val1?/:val2? to make the links work properly - you do need them if it becomes necessary to pass important data in the url - in this case the placeholders will serve as the
> root path and the link path will begin after the placeholders

```
// not needed
// app.use('/brand/:val1?',express.static(publicDirectoryPath));
// app.use('/brand/:val1?/:val2?',express.static(publicDirectoryPath));
```
> for example brand/business/brand/business will be a valid link address - the first instance of 
> /brand/business/ holds a place and represents the root whereas the link then uses the 
> 2nd /brand/business to find the given file.

add router
```
  app.use('/brand', require('../public/business/routers/business'))
  or
  app.use('/brand',businessRouter);
```

GOTCHA: i had an issue with crossorigin - the images wouldn't show on the home page because the business route didn't use the options 
that allowed me to set the Access-Control-Allow-Origin.
Idk why my own images on my own origin need to be processed as crossorigin

```
    router.options('/*', cors(corsOptions),function(req,res){
      // GOTCHA: this is required so i don't have to use crossorigin in img, link, and style tags
      // i don't see this triggering
      if(display_console || false) console.log(chalk.bgYellow('[alight route] setting Access-Control header'));
      //if it gets through run this script
      res.setHeader("Access-Control-Allow-Origin",`*`);///firebasejs/3.6.0/firebase.js
      // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.end();
    });
```