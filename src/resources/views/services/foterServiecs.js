const {BigQuery} = require('@google-cloud/bigquery');
const formatDate = require('../../../routers/convertDate')

const projectId = 'news-1203s';



async function getTagsFotter() {
  const bigqueryClient = new BigQuery({ projectId });
  const query = `SELECT Id, NameTopic FROM \`news-1203s.news.topics\` LIMIT 20`;
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

async function getpost3Fotter() {
    const bigqueryClient = new BigQuery({ projectId });
    const query = `
    WITH FirstThirtyPosts AS (
      SELECT 
          p.ID,
          p.Title,
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
      GROUP BY 
          p.ID, p.Title, p.Created_at
      ORDER BY 
          p.Created_at DESC

  )
  SELECT 
      ID,
      Title,
      Created_at,
      topics
  FROM 
      FirstThirtyPosts
  ORDER BY 
      RAND()
  LIMIT 3;
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

  async function getpost6Fotter() {
    const bigqueryClient = new BigQuery({ projectId });
    const query = `
    WITH FirstThirtyPosts AS (
      SELECT 
          p.ID,
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
      GROUP BY 
          p.ID, p.Title, p.Image, p.Created_at
      ORDER BY 
          p.Created_at DESC
      LIMIT 33
  )
  SELECT 
      ID,
      Image,
      Created_at,
      topics
  FROM 
      FirstThirtyPosts
  ORDER BY 
      RAND()
  LIMIT 9;
  
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
    getTagsFotter,
    getpost3Fotter,
    getpost6Fotter,
  };
