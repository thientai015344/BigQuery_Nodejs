const {BigQuery} = require('@google-cloud/bigquery');
const formatDate = require('../../../routers/convertDate')

const projectId = 'news-1203s';



async function getTags() {
  const bigqueryClient = new BigQuery({ projectId });
  const query = `SELECT Id, NameTopic FROM \`news-1203s.news.topics\` LIMIT 10`;
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


async function get7Posts() {
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
GROUP BY 
    p.ID, p.Title, p.Image, p.Created_at
ORDER BY 
    p.Created_at DESC
LIMIT 7;
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

async function get5PostsSlider() {
  const bigqueryClient = new BigQuery({ projectId });
  const query = `
  WITH FirstTwelvePosts AS (
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
    GROUP BY 
        p.ID, p.Title, p.Image, p.Created_at
    ORDER BY 
        p.Created_at DESC
    LIMIT 12
)
SELECT 
    ID,
    Title,
    Image,
    Created_at,
    topics
FROM 
    FirstTwelvePosts
ORDER BY 
    Created_at DESC
LIMIT 5 OFFSET 7;
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

async function latestNews() {
  const bigqueryClient = new BigQuery({ projectId });
  const query = `
  WITH FirstTwentyFourPosts AS (
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
    GROUP BY 
        p.ID, p.Title, p.Image, p.Created_at
    ORDER BY 
        p.Created_at DESC
    LIMIT 25
)
SELECT 
    ID,
    Title,
    Image,
    Created_at,
    topics
FROM 
    FirstTwentyFourPosts
ORDER BY 
    Created_at DESC
LIMIT 13 OFFSET 12;
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

async function getpost5() {
  const bigqueryClient = new BigQuery({ projectId });
  const query = `
  WITH FirstThirtyPosts AS (
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
    GROUP BY 
        p.ID, p.Title, p.Image, p.Created_at
    ORDER BY 
        p.Created_at DESC
    LIMIT 30
)
SELECT 
    ID,
    Title,
    Image,
    Created_at,
    topics
FROM 
    FirstThirtyPosts
ORDER BY 
    RAND()
LIMIT 5;

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
  getTags,
  get7Posts,
  get5PostsSlider,
  latestNews,
  getpost5
};