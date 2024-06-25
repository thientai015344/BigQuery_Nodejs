const {BigQuery} = require('@google-cloud/bigquery');
const formatDate = require('../../../routers/convertDate')

const projectId = 'news-1203s';



async function searchPosts(querystr) {
    const bigqueryClient = new BigQuery({ projectId });
    const query = `
    SELECT 
      p.ID,
      p.Title,
      p.Image,
      p.Created_at,
      ARRAY_AGG(STRUCT(t.Id AS TopicId, t.NameTopic)) AS topics
  FROM 
      \`news-1203s.news.Posts\` p
  JOIN 
      \`news-1203s.news.Topics_post\` pt 
  ON 
      p.ID = pt.PostId
  JOIN 
      \`news-1203s.news.topics\` t 
  ON 
      pt.TopicId = t.Id
  WHERE 
      p.Title LIKE '%${querystr}%'
  GROUP BY 
      p.ID, p.Title, p.Image, p.Created_at
  ORDER BY 
      p.Created_at DESC
  `;
    const options = {
      query: query,
      location: 'US'
    };
    try {
      
      const [rows] = await bigqueryClient.query(options);
      const transformedDates = rows.map(dateObj => ({
        Id: dateObj.ID,
        Title: dateObj.Title,
        Image: dateObj.Image,
        NameTopic: dateObj.topics.map(topic => topic.NameTopic).join(", "),
        IdTopic: dateObj.topics.map(topic => topic.TopicId).join(", "),
        Created_at: formatDate(dateObj.Created_at),
      }));
      return transformedDates;
    } catch (e) {
      console.error('Error running query:', e);
      return [];
    }
  }


  async function searchPostsinTopic(querystr) {
    const bigqueryClient = new BigQuery({ projectId });
    const query = `
    SELECT 
  p.ID,
  p.Title,
  p.Image,
  p.Created_at,
  ARRAY_AGG(STRUCT(t.Id AS TopicId, t.NameTopic)) AS topics
  FROM 
    \`news-1203s.news.Posts\` p
  JOIN 
    \`news-1203s.news.Topics_post\` pt 
  ON 
    p.ID = pt.PostId
  JOIN 
  \`news-1203s.news.topics\` t 
  ON 
    pt.TopicId = t.Id
  WHERE 
    t.NameTopic like '%${querystr}%'
  GROUP BY 
    p.ID, p.Title, p.Image, p.Created_at
  ORDER BY 
    p.Created_at DESC
  LIMIT 100;

  `;
    const options = {
      query: query,
      location: 'US'
    };
    try {
      
      const [rows] = await bigqueryClient.query(options);
      const transformedDates = rows.map(dateObj => ({
        Id: dateObj.ID,
        Title: dateObj.Title,
        Image: dateObj.Image,
        NameTopic: dateObj.topics.map(topic => topic.NameTopic).join(", "),
        IdTopic: dateObj.topics.map(topic => topic.TopicId).join(", "),
        Created_at: formatDate(dateObj.Created_at),
      }));
      return transformedDates;
    } catch (e) {
      console.error('Error running query:', e);
      return [];
    }
  }

  async function searchPostsinDate(querystr) {
    const bigqueryClient = new BigQuery({ projectId });
    const query = `
    SELECT 
    p.ID,
    p.Title,
    p.Image,
    p.Created_at,
    ARRAY_AGG(STRUCT(t.Id AS TopicId, t.NameTopic)) AS topics
  FROM 
    \`news-1203s.news.Posts\` p
  JOIN 
    \`news-1203s.news.Topics_post\` pt 
  ON 
    p.ID = pt.PostId
  JOIN 
    \`news-1203s.news.topics\` t 
  ON 
    pt.TopicId = t.Id
  WHERE 
    p.Created_at = '${created_at}'
  GROUP BY 
    p.ID, p.Title, p.Image, p.Created_at
  ORDER BY 
    p.Created_at DESC
  LIMIT 100;

  `;
    const options = {
      query: query,
      location: 'US'
    };
    try {
      
      const [rows] = await bigqueryClient.query(options);
      const transformedDates = rows.map(dateObj => ({
        Id: dateObj.ID,
        Title: dateObj.Title,
        Image: dateObj.Image,
        NameTopic: dateObj.topics.map(topic => topic.NameTopic).join(", "),
        IdTopic: dateObj.topics.map(topic => topic.TopicId).join(", "),
        Created_at: formatDate(dateObj.Created_at),
      }));
      return transformedDates;
    } catch (e) {
      console.error('Error running query:', e);
      return [];
    }
  }

  
  module.exports = {
    searchPosts,
    searchPostsinTopic,
    searchPostsinDate,
  };

