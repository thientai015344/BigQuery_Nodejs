const express = require('express');
const app = express();
const path = require('path');


const mainRouter = require('./routers/mainRouter');
const adminRouter = require('./routers/admin');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'resources', 'views'));

app.use(express.static(path.join(__dirname, 'resources', 'assets')));


app.use('/', mainRouter);
app.use('/', adminRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
