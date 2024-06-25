const {BigQuery} = require('@google-cloud/bigquery');
const getDateTimeString = require('./getDateTimeString');

const projectId = 'news-1203s';

async function queryDatatopicforInsertPost() {
  const bigqueryClient = new BigQuery({ projectId });
  const query = `SELECT Id, NameTopic FROM \`news-1203s.news.topics\``;
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


async function getAllPosts() {
  const bigqueryClient = new BigQuery({ projectId });
  const query = `
  SELECT 
    p.ID,
    p.Title,
    p.Image,
    p.Created_at,
    p.Updated_at,
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
    p.ID, p.Title, p.Image, p.Created_at, p.Updated_at
  ORDER BY 
    p.ID;
`;
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
  
  // Calculate the timestamp for 1 hour ago
  const oneHourAgo = getDateTimeString()
  const query = `
    DELETE FROM \`news-1203s.news.Posts\`
    WHERE ID = CAST(@id AS INT64)
    AND Created_at < ${oneHourAgo}
  `;
  
  const options = {
    query: query,
    location: 'US',
    params: { id: parseInt(id)},
  };

  try {
    const [job] = await bigqueryClient.createQueryJob(options);
    await job.getQueryResults();
    console.log(`Successfully deleted row with Id ${id}`);
    return id;
  } catch (e) {
    console.error('Error running delete query:', e);
  }
}



module.exports = {
  queryDatatopicforInsertPost,
  getAllPosts,
  deleteRowById
};
