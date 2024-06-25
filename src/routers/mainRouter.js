const express = require('express');
const {getTags, get7Posts, get5PostsSlider, latestNews, getpost5} = require('../resources/views/services/homeServices');
const {searchPosts, searchPostsinTopic, searchPostsinDate} = require('../resources/views/services/searchServiecs');
const singerPost = require('../resources/views/services/singerServices');
const getPostforIdTopics = require('../resources/views/services/categoryServices');
const {getTagsFotter, getpost3Fotter, getpost6Fotter } = require('../resources/views/services/foterServiecs');
const router = express.Router();

router.get('/category/:id', async(req, res) => {
  const id = req.params.id;
  var data = await getPostforIdTopics(id)
  let tags = await getTags();
  let post45 = await getpost5();
  var datatagFotter = await getTagsFotter()
  var data3Fotter = await getpost3Fotter()
  var data6Fotter = await getpost6Fotter()
  res.render('category',{data, tags, post45, datatagFotter, data3Fotter, data6Fotter}); 
});

router.get('/contact', async(req, res) => {
  var datatagFotter = await getTagsFotter()
  var data3Fotter = await getpost3Fotter()
  var data6Fotter = await getpost6Fotter()
  res.render('contact',{datatagFotter, data3Fotter, data6Fotter}); 
});

router.get('/', async(req, res) => {
  var datatagFotter = await getTagsFotter()
  var data3Fotter = await getpost3Fotter()
  var data6Fotter = await getpost6Fotter()
  let tags = await getTags();
  let post45 = await getpost5();
  let posts7 = await get7Posts();
  let posts5 = await get5PostsSlider();
  let datalatestNews = await latestNews();
  res.render('home', {tags, posts7, posts5, datalatestNews, post45, datatagFotter, data3Fotter, data6Fotter}); 
});

router.get('/search', async(req, res) => {
  var datatagFotter = await getTagsFotter()
  var data3Fotter = await getpost3Fotter()
  var data6Fotter = await getpost6Fotter()
  const query = req.query.query;
  const type = req.query.type;
    let data = null;
    if (query) {
      switch(true) {
        case (type == 'Title'):
           const sampleDataTitle = await searchPosts(query);
            data = sampleDataTitle;
            break;
        case (type == 'Topic'):
           const sampleTopic = await searchPostsinTopic(query);
          data = sampleTopic;
            break;
        // case (type == 'Date'):
        //    const sampleDate = await searchPostsinDate(query);
        //   data = sampleDate;
        //     break;
        default:
          const sampleData = await searchPosts(query);
          data = sampleData;
      }  
    }
    res.render('search', { query, data ,datatagFotter, data3Fotter, data6Fotter });
});

router.get('/single/:id', async (req, res) => {
  const id = req.params.id;
  var datatagFotter = await getTagsFotter()
  var data3Fotter = await getpost3Fotter()
  var data6Fotter = await getpost6Fotter()


  var data = await singerPost(id)
  let post45 = await getpost5();
  let tags = await getTags();
  res.render('single', {data, post45, tags, datatagFotter, data3Fotter, data6Fotter}); 
});

module.exports = router;
