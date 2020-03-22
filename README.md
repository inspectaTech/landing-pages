# landing-pages

### nginx setup
[nginx server block](https://www.nginx.com/resources/wiki/start/topics/examples/server_blocks/)   
server should already be set up to reverse proxy node js servers running express

[add a new location block](https://www.linode.com/docs/web-servers/nginx/how-to-configure-nginx/)   
> see location block section
```
    location /newRouteName {
      add_header X-app2-message "newRouteName section entered" always;
      proxy_pass http://localhost:1027;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_cache_bypass $http_upgrade;
    }

```
**each route needs the different port that node.js is listening on**
> proxy_pass http://localhost:[yourNewPort];


set up an express server with the given route
```
  npm init -y
  npm i express body-parser cors chalk request hbs

```
[express](https://www.npmjs.com/package/express)      
[bodyParser](https://www.npmjs.com/package/body-parser)    
[cors](https://www.npmjs.com/package/cors)    
[chalk](https://www.npmjs.com/package/chalk)   
[request](https://www.npmjs.com/package/request)   
[hbs (for handlebars)](https://www.npmjs.com/package/hbs)   

**GOTCHA: static files showing 404 error**


**GOTCHA: subdomain couldn't find 'A' record**
fix:  i has to update 'A' record on cloudflare's dns server

#### Run server with nodemon
```
  nodemon src/index.js
```
