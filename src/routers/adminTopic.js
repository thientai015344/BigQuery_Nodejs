const express = require('express');
const bodyParser = require('body-parser');
const creatId = require('./services/adminServices/createId');
const getDateTimeString = require('./services/adminServices/getDateTimeString');
const {insertData} = require('./services/adminServices/insertBigQuery');
const router = express.Router(); 
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const {BigQuery} = require('@google-cloud/bigquery');
const projectId = 'news-1203s';
const convertDate = require('../routers/convertDate')


async function getAllTopics() {

  const bigqueryClient = new BigQuery({ projectId });
  const query = `SELECT * FROM \`news-1203s.news.topics\``;
  const options = {
    query: query,
    location: 'US'
  };
  try {
    const [rows] = await bigqueryClient.query(options);
    return rows;
  } catch (e) {
    console.error('Error running query:', e);
    return [];
  }
}


async function deleteRowById(id) {
  const bigqueryClient = new BigQuery({ projectId });
  const query = `DELETE FROM \`news-1203s.news.topics\` WHERE Id = CAST(@id AS INT64)`;
  const options = {
    query: query,
    location: 'US',
    params: { id: parseInt(id) },
  };

  try {
    await bigqueryClient.query(options);
    console.log(`Successfully deleted row with Id ${id}`);
    return id;
  } catch (e) {
    console.error('Error running delete query:', e);
  }
}


router.post('/admin/createNewTopic', urlencodedParser, (req, res) => {
  let nameTopic = req.body.nameTopic;
  const result = creatId();
  const dateTimeString = getDateTimeString();
  const rows = [
    { Id: result, NameTopic: nameTopic, Created_at: dateTimeString, Updated_at: dateTimeString },
  ];
  insertData(rows).catch(console.error);

  res.render('admin/createNewTopic');
});

router.get('/admin', (req, res) => {
  res.render('admin/index');
});

router.get('/admin/topic', async(req, res) => {
  let data = await getAllTopics();
  const reversed = data.reverse();
  const transformedDates = reversed.map(dateObj => ({
    Id: dateObj.Id,
    NameTopic: dateObj.NameTopic,
    Created_at: convertDate(dateObj.Created_at),
    Updated_at: convertDate(dateObj.Updated_at)
  }));
  //console.log(transformedDates)
  res.render('admin/manageTopic', {data : transformedDates});
});

router.get('/admin/createNewTopic', (req, res) => {
  res.render('admin/createNewTopic');
});

router.post('/admin/delete-topic/:id', async(req, res) => {
  const id = req.params.id;
  var idRemove = await deleteRowById(id)
  if(idRemove == id){
    res.redirect('/admin/topic')
  }
});

module.exports = router;
