const express = require('express');
const app = express();
const port = 4000;
const bodyParser = require('body-parser');

app.use(bodyParser.json()); //for json data
app.use(bodyParser.urlencoded({ extended: false })); //for URL encoded data


app.get('/', (req, res) => {
  res.send('COS730 Backend is running');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
