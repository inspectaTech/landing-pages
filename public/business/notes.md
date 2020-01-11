
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

add router
```
  app.use('/brand', require('../public/business/routers/business'))
  or
  app.use('/brand',businessRouter);
```
