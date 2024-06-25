const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const Jimp = require('jimp');
const creatId = require('./services/adminServices/createId');
const getDateTimeString = require('./services/adminServices/getDateTimeString');
const {queryDatatopicforInsertPost, getAllPosts, deleteRowById} = require('./services/adminServices/querydataAdmin');
  

const {insertDataPost} = require('./services/adminServices/insertBigQuery');


const formatDate = require('../routers/convertDate')

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const uploadDir = path.join(path.dirname(path.dirname(__dirname)), 'src', 'resources', 'assets', 'img');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

router.get('/admin/post', async (req, res) => {
  let data = await getAllPosts();
  const reversed = data.reverse();

  const transformedDates = reversed.map(dateObj => ({
    Id: dateObj.ID,
    Title: dateObj.Title,
    Image: dateObj.Image,
    NameTopic: dateObj.topics.map(topic => topic.NameTopic).join(", "),
    IdTopic: dateObj.topics.map(topic => topic.TopicId).join(", "),
    Created_at: formatDate(dateObj.Created_at),
    Updated_at: formatDate(dateObj.Updated_at)
  }));
  res.render('admin/managePost', {data: transformedDates});
});

router.get('/admin/createNewPost', async (req, res) => {
  let data = await queryDatatopicforInsertPost();
  res.render('admin/createNewPost', { data: data });
});

router.post('/admin/createNewPost', upload.single('image'), async (req, res) => {
  const result = creatId();
  if (!req.file) {
    return res.status(400).send('No image uploaded');
  }
  const image = await Jimp.read(req.file.buffer);
  image.resize(700, 435);
  const imagePath = path.join(uploadDir, `${result}.jpg`);
  const resizedImageBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);

  fs.writeFile(imagePath, resizedImageBuffer, (err) => {
    if (err) {
      return res.status(500).send('An error occurred while uploading the image');
    }

    const Dataform = req.body;
    const title = Dataform.titlePost;
    const Discription = Dataform.Discription;
    const detailPost = Dataform.detailPost;
    const topicId = Dataform.mySelectBox;
    const dateTimeString = getDateTimeString();

    const rows = [
      {
        ID: result, Title: title, Image: `img/${result}.jpg`, Description: Discription,
        Detail: detailPost, Created_at: dateTimeString, Updated_at: dateTimeString
      },
      { topicID: topicId}
    ];

    insertDataPost(rows)
      .then(() => {
        res.redirect('/admin/post')
      })
      .catch((err) => {
        res.status(500).send('An error occurred while inserting data');
      });
  });
});





router.post('/admin/delete-post/:id', async(req, res) => {
  const id = req.params.id;
  var idRemove = await deleteRowById(id)
  if(idRemove == id){
    res.redirect('/admin/post')
  }
});

// Route to handle edit request
router.get('/admin/edit-post/:id', (req, res) => {
  const id = req.params.id;
  // Your logic to retrieve and show the item by ID for editing
  // For example: const item = getItemById(id);
  console.log("edit",id) // Redirect to the desired page after deletion

 // res.render('editPage', { id: id }); // Render the edit page with item data
});

module.exports = router;
