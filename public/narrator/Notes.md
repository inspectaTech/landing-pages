# to run
```
  // install all the dependencies
  npm install

  // then run
  npx nodemon path-to/server.js
```
> npx http-server -o path-to/server.js fails

[nodemon to track changes to extensions](https://github.com/remy/nodemon)
use -e or --ext to track extensions
```
  nodemon path-to/server.js -e hbs,js,css
```

find and replace all instances of the word "sample" in the following files:

- src/server.js
- templates/partials/headers
- public/sample/routers/sample.js
- public/sample/views/sample.js

rename the following file names:
- public/sample/views/sample.js
- public/sample/routers/sample.js

rename the following directory names:

- public/sample

