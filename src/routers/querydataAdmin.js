const {BigQuery} = require('@google-cloud/bigquery');


async function queryDatatopicforInsertPost() {

    const projectId = 'news-1203s';
    const bigqueryClient = new BigQuery({ projectId });



  const query = `
    SELECT Id, NameTopic FROM \`news-1203s.news.topics\`
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

module.exports = queryDatatopicforInsertPost;
