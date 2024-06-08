const express = require('express');
const router = express.Router();


router.get('/category', (req, res) => {
  res.render('category'); 
});

router.get('/contact', (req, res) => {
  res.render('contact'); 
});

router.get('/', (req, res) => {
  res.render('home'); 
});

router.get('/search', (req, res) => {
  res.render('search'); 
});

router.get('/single', (req, res) => {
  res.render('single'); 
});

module.exports = router;
