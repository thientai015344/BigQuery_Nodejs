const {BigQuery} = require('@google-cloud/bigquery');


const projectId = 'news-1203s';


async function insertData(rows) {
    const bigqueryClient = new BigQuery({ projectId });
  
    const datasetId = 'news';
    const tableId = 'topics';
   
    console.log(rows)
  
    try {
        await bigqueryClient.dataset(datasetId).table(tableId).insert(rows);
        console.log(`Inserted ${rows.length} rows`);
      } catch (e) {
        console.error('Error inserting rows:', e);
        if (e.name === 'PartialFailureError') {
          e.errors.forEach(err => {
            console.error('Row insert error:', err.row);
            console.error('Error details:', err.errors);
          });
        }
      }
}

async function insertDataTopic_post(rows) {
    const bigqueryClient = new BigQuery({ projectId });
  
    const datasetId = 'news';
    const tableId = 'Topics_post';

    try {
        await bigqueryClient.dataset(datasetId).table(tableId).insert(rows);
        console.log(`Inserted ${rows.length} rows`);
      } catch (e) {
        console.error('Error inserting rows:', e);
        if (e.name === 'PartialFailureError') {
          e.errors.forEach(err => {
            console.error('Row insert error:', err.row);
            console.error('Error details:', err.errors);
          });
        }
      }
}


async function insertDataPost(rows) {  
    const bigqueryClient = new BigQuery({ projectId });
    var rowss
    const datasetId = 'news';
    const tableId = 'Posts';
    let idpost = rows[0].ID
    let idtopic = rows[1]
    if(typeof(idtopic.topicID) == 'object'){
       rowss = idtopic.topicID.map((value) => {
        return  { PostId: idpost, TopicId: value  }
      });
    }
    else{
      rowss = { PostId: idpost, TopicId: idtopic.topicID };
    }
    
    try {
        await bigqueryClient.dataset(datasetId).table(tableId).insert(rows[0]);
        console.log(`Inserted ${rows[0].length} rows`);
    
        await insertDataTopic_post(rowss)
      } catch (e) {
        console.error('Error inserting rows:', e);
        if (e.name === 'PartialFailureError') {
          e.errors.forEach(err => {
            console.error('Row insert error:', err.row);
            console.error('Error details:', err.errors);
          });
        }
    }
}



module.exports = {insertData, insertDataPost};



module.exports = {
  insertData,
  insertDataPost
};
