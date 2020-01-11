const express = require('express');
const router = express.Router();
const cors = require('cors');// make sure not just anyone can use my post requests

const corsOptions = require('../utils/cors-options');
// const process_memory = require('../utils/process_memory.js');


router.get('/', cors(corsOptions), (req, res) => {
  // res.send('Hello express!')
  console.log(`[index] running!`);
  res.render('apps', {
    title:'push tester',
    name: 'your pusher'
  })
});// push

router.get('/init', cors(corsOptions), (req, res) => {
  // res.send('Hello express!')
  console.log(`[index] running!`);
  res.status(200).send({message:"initiated"})
});// push

router.get('/help', cors(corsOptions), (req, res) => {
  // res.send('Hello express!')
  res.render('help', {
    title:'Help',
    name: 'Andrew Mead',
    help_txt: 'Some help message'
  })
})

router.get('/*', cors(corsOptions), (req, res) => {
  // res.send('my 404 page')
  res.render('404', {
    title:'404',
    errorMessage:'article not found'
  });
})// catch all


module.exports = router;

// const express = require('express');
// const router = express.Router();
//
// module.exports = router;
