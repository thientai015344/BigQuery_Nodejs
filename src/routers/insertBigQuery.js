const {BigQuery} = require('@google-cloud/bigquery');

const projectId = 'news-1203s';
async function insertData(rows) {
    // Set the environment variable GOOGLE_APPLICATION_CREDENTIALS to the file path of the JSON file that contains your service account key.
    
  
    // Set the Project Id
    
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


// async function insertDataPost(rows) {

    
//     const bigqueryClient = new BigQuery({ projectId });
  
//     const datasetId = 'news';
//     const tableId = 'Posts';
//     let idpost = rows[0].Id
//     let idtopic = rows[1]
//     const rowss = idtopic.map(id => ({ Id: idpost, TopicId: id }));
    
//     try {
//         await bigqueryClient.dataset(datasetId).table(tableId).insert(rows[0]);
//         console.log(`Inserted ${rows[0].length} rows`);
    
//         await insertDataTopic_post(rowss)
//       } catch (e) {
//         console.error('Error inserting rows:', e);
//         if (e.name === 'PartialFailureError') {
//           e.errors.forEach(err => {
//             console.error('Row insert error:', err.row);
//             console.error('Error details:', err.errors);
//           });
//         }
//     }
// }







module.exports = insertData;

//module.exports = insertDataPost;