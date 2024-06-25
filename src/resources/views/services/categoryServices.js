const {BigQuery} = require('@google-cloud/bigquery');
const formatDate = require('../../../routers/convertDate')
const projectId = 'news-1203s';

async function getPostforIdTopics(Id) {
  const bigqueryClient = new BigQuery({ projectId });
  const query = `SELECT 
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
  WHERE 
    t.Id = CAST(@id AS INT64)
  GROUP BY 
    p.ID, p.Title, p.Image, p.Created_at, p.Updated_at
  ORDER BY 
  p.Updated_at DESC`;
  const options = {
    query: query,
    location: 'US',
    params: { id: parseInt(Id)}
  };
  try {
    const [rows] = await bigqueryClient.query(options);
    const transformedDates = rows.map(dateObj => ({
      Id: dateObj.ID,
      Title: dateObj.Title,
      Image: dateObj.Image,
      Description: dateObj.Description,
      Detail: dateObj.Detail,
      NameTopic: dateObj.topics.map(topic => topic.NameTopic).join(", "),
      IdTopic: dateObj.topics.map(topic => topic.TopicId).join(", "),
      Updated_at: formatDate(dateObj.Updated_at),
    }));
    return transformedDates;
  } catch (e) {
    console.error('Error running query:', e);
    return [];
  }
}

module.exports = getPostforIdTopics;