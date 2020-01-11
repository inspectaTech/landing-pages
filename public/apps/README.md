[to make the links work](https://stackoverflow.com/questions/13395742/can-not-get-css-file)
> connect the path to the public directory - may have multiple connections

src/index.js
```
  app.use('/arc',express.static(publicDirectoryPath));
```

public/app/views/title.hbs
```
  <!DOCTYPE html>
  <html lang="en" dir="ltr">
    <head>
      <meta charset="utf-8">
      <title></title>
      <link rel="stylesheet" href="./alight/css/style.css">
    </head>
```
> use ./ relative path
