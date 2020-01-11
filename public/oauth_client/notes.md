

does node_modules have to be in the root
can multiple node_modules folders be read (detected)?
can node_modules be nested?

### Client side

#### set path to view
```
  const oauthClientPath = path.join(__dirname,"../public/oauth_client/views");// client side auth

```
used with
```
  app.set('view engine', 'hbs');
  app.set('views', [..., oauthClientPath, ...]);//this works
```

#### set partial path
```
  const oauthClientPartialsPath = path.join(__dirname,"../public/oauth_client/views");// client side auth
  hbs.registerPartials(oauthClientPartialsPath);// client side auth
```

#### set the routes public directory
```
  app.use('/auth',express.static(publicDirectoryPath));// client side auth
```

#### set the router
```
  app.use('/auth', require('../public/oauth_client/routers/auth'))// client side auth
```


### Server side

#### server side only needs to set the routers
```
  app.use('/api', require('./oauth_server/routers/oauth'))// server side auth
```

## how do i protect the protected sections with jwt authentication?
> my guess is they're separate entities that can be controlled by the server routers but theres also a way to add jwt authentication to the app.use router path using passport-jwt as middleware


#### Not required
[renderToString hint](https://dev.to/marvelouswololo/how-to-server-side-render-react-hydrate-it-on-the-client-and-combine-client-and-server-routes-1a3p)   
```
  import ReactDOMServer from 'react-dom/server'

  ...
  const component = ReactDOMServer.renderToString(<Hello name={name} />)
```
[Combine the Express router with React Router](https://dev.to/marvelouswololo/how-to-server-side-render-react-hydrate-it-on-the-client-and-combine-client-and-server-routes-1a3p)   
```
  // webpack.config.js
  entry: {
    'home.js': path.resolve(__dirname, 'src/public/home.js'),
    'multipleRoutes.js': path.resolve(__dirname, 'src/public/multipleRoutes.js')
  }
```
**this seems complicated and totally unneccessary - no one else has done all this**
