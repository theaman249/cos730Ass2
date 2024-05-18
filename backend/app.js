const express = require('express');
const app = express();
const port = 4000;
const bodyParser = require('body-parser');
const client = require('./conn');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json()); //for json data
app.use(bodyParser.urlencoded({ extended: false })); //for URL encoded data


app.get('/', (req, res) => {
  res.send('COS730 Backend is running');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


app.post('/getETFData', (req, res) =>{

  const {resultCount, alphabetical,ticker} = req.body;

  let getAllETFsQuery = "";

  if (ticker && ticker !== "") {
    getAllETFsQuery = `SELECT * from etf WHERE ticker = '${ticker}'`;
  }
  else if(alphabetical){ //user wants in alphabetical order
    getAllETFsQuery = `SELECT * from etf ORDER BY name ASC LIMIT ${resultCount}`;
  }
  else{
    getAllETFsQuery = `SELECT * from etf LIMIT ${resultCount}`;    
  }

  console.log(getAllETFsQuery);

  client.query(getAllETFsQuery, (err,result) =>{

    if(err){
      res.status(500).send({
        message: "query fetch request error",
        error: err
      })
    }
    else{
      let arr_return = [];

      for(let i=0; i<result.rows.length;++i){

        let obj = {
          ticker: result.rows[i].ticker,
          issuer: result.rows[i].issuer,
          name: result.rows[i].name
        }

        arr_return.push(obj);
      }

      res.status(200).send({
        data: arr_return
      })
    }
  })
});
