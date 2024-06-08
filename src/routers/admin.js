const express = require('express');
const bodyParser = require("body-parser");
const multer = require('multer');
const router = express.Router();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const creatId = require('./createId')
const getDateTimeString = require('./getDateTimeString');
const insertData = require('./insertBigQuery')
const queryDatatopicforInsertPost = require('./querydataAdmin')
const insertDataPost = require('./insertBigQuery')
// router.get('/admin-login', (req, res) => {
//   res.render('home');
// });




router.get('/admin', (req, res) => {
  res.render('admin/index');
});

router.get('/admin/topic', (req, res) => {
  res.render('admin/manageTopic');
});

router.get('/admin/createNewTopic', (req, res) => {
  res.render('admin/createNewTopic');
});
///////////////////////////////////////////////
router.post('/admin/createNewTopic', urlencodedParser, (req, res) => {
  let nameTopic = req.body.nameTopic;
  const result = creatId();
  const dateTimeString = getDateTimeString();
  const rows = [
      {Id: result, NameTopic: nameTopic, Created_at: dateTimeString, Updated_at: dateTimeString},
  ];
  insertData(rows).catch(console.error);

  res.render('admin/createNewTopic');
});


///////////////////////////////////////////////
router.get('/admin/post', (req, res) => {
  res.render('admin/managePost');
});

router.get('/admin/createNewPost', async(req, res) => {
  let data = await queryDatatopicforInsertPost()
  res.render('admin/createNewPost', {data: data});
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/') // Make sure this directory exists
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname)
  }
});
const upload = multer({ storage: storage });

router.post('/admin/createNewPost', urlencodedParser, upload.single('image'),(req, res) => {
  let Dataform = req.body;
  console.log(req.file); // File details
  const imageFilename = req.file ? req.file.filename : "No Image Uploaded";

console.log(imageFilename);
  let title = Dataform.titlePost;
  let Discription = Dataform.Discription;
  let detailPost = Dataform.detailPost;
  let topicId = Dataform.mySelectBox;



  const result = creatId();
  const dateTimeString = getDateTimeString();
  const rows = [
      {Id: result, Title: title, Description: Discription, Detail: detailPost, Created_at: dateTimeString, Updated_at: dateTimeString},{topicID: topicId} 
  ];
  //insertDataPost(rows).catch(console.error);

  //res.redirect('/admin/createNewPost');
});

module.exports = router;
