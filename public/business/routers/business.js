const express = require('express');
const router = express.Router();
const cors = require('cors');// make sure not just anyone can use my post requests

const corsOptions = require('../../../src/utils/cors-options');// use the main one in landing-pages src dir
// const process_memory = require('../utils/process_memory.js');


  // router.get('/', cors(corsOptions), (req, res) => {
  //   // res.send('Hello express!')
  //   console.log(`[index] running!`);
  //   res.render('alight', {
  //     title:'push tester',
  //     name: 'your pusher'
  //   })
  // });// push

  // router.get('/*', cors(corsOptions), (req, res) => {
  //   // res.send('Hello express!')
  //   //I do need this catchall for the react router to take direct links (address bar initiated - not in the router link)
  //   // without this even page refreshes won't work in restoring the samee page
  //   res.render('login', {
  //     title:'Help',
  //     name: 'Andrew Mead',
  //     help_txt: 'Some help message'
  //   })
  // })

  router.get('/business', cors(corsOptions), (req, res) => {
    // res.send('Hello express!')
    res.render('business', {
      title:'Help',
      name: 'Andrew Mead',
      help_txt: 'Some help message',
      thisYear: function(){ return (new Date).getFullYear()}
    })
  })


module.exports = router;
