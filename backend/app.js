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

app.get('/getUserData', (req,res) =>{
  let getAllUserDataQuery = 'SELECT * FROM users';

  client.query(getAllUserDataQuery, (err, result) =>{
    if(err){
      res.status(500).send({
        message: "query fetch request error",
        error: err
      })
    }
    else{
      let obj ={
        id: result.rows[0].id,
        fname: result.rows[0].fname,
        lname: result.rows[0].lname,
        email: result.rows[0].email,
        company: result.rows[0].company,
        portfolio: result.rows[0].portfolio,
        role:result.rows[0].role
      }

      res.status(200).send({
        data: obj
      })
    }

   
  })
});

/**
 * Returns all ETFs who's volume is above avergae
*/

app.post('/getMomentumETFs', (req, res) =>{

  const {result_count} = req.body;

  myQuery = `
    SELECT ticker, issuer, name, risk, volume, ytd_return
    FROM etf
    WHERE volume > (
      SELECT AVG(volume) FROM etf
    )
    LIMIT ${result_count};
  `

  client.query(myQuery, (err, result) =>{
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
          name: result.rows[i].name,
          risk: result.rows[i].risk,
          volume: result.rows[i].volume,
          ytd_return: result.rows[i].ytd_return

        }

        arr_return.push(obj);
      }

      res.status(200).send({
        data: arr_return
      })
    }
  })

})

app.post('/getESGData', (req,res) =>{
  const {result_count,alphabetical,ticker,agencies,rating} = req.body

  let min = 0; //default is a poor ratings
  let max = 39;

  if(rating === "green"){
    min = 80;
    max = 100;
  }
  else if(rating === "orange"){
    min = 60;
    max = 79;
  }
  else if(rating === "yellow"){
    min = 40;
    max = 59;
  }

  let getESGDataQuery = "";

  //console.log(req.body);

  if (ticker && ticker !== "") {
    getESGDataQuery = `SELECT * from esg WHERE ticker = '${ticker}'`;
  }
  else if(alphabetical){ //user wants in alphabetical order
    
    if(rating === "all")
    {
      if(agencies.length === 1){ //the most inefficient way to do this; Not proud :
        getESGDataQuery = `SELECT * from esg WHERE agency IN ('${agencies[0]}') ORDER BY name ASC LIMIT ${result_count}`;
      } 
      else if(agencies.length === 2){
        getESGDataQuery = `SELECT * from esg WHERE agency IN ('${agencies[0]}','${agencies[1]}') ORDER BY name ASC LIMIT ${result_count}`;
      }
      else if(agencies.length === 3){
        getESGDataQuery = `SELECT * from esg WHERE agency IN ('${agencies[0]}','${agencies[1]}','${agencies[2]}') ORDER BY name ASC LIMIT ${result_count}`;
      }
      else{
        getESGDataQuery = `SELECT * from esg ORDER BY name ASC LIMIT ${result_count}`;
      }
    }
    else
    {
      if(agencies.length == 1){
        getESGDataQuery = `SELECT * from esg WHERE agency IN ('${agencies[0]}') AND rating>= ${min} AND rating <=${max} ORDER BY name ASC LIMIT ${result_count}`;
      } 
      else if(agencies.length === 2){
        getESGDataQuery = `SELECT * from esg WHERE agency IN ('${agencies[0]}','${agencies[1]}') AND rating>= ${min} AND rating <=${max} ORDER BY name ASC LIMIT ${result_count}`;
      }
      else if(agencies.length === 3){
        getESGDataQuery = `SELECT * from esg WHERE agency IN ('${agencies[0]}','${agencies[1]}','${agencies[2]}') AND rating>= ${min} AND rating <=${max} ORDER BY name ASC LIMIT ${result_count}`;
      }
      else
        getESGDataQuery = `SELECT * from esg WHERE rating>= ${min} AND rating <=${max} ORDER BY name ASC LIMIT ${result_count}`;
    }
  }
  else{
    if(rating === "all")
      {
        if(agencies.length === 1){ //the most inefficient way to do this; Not proud :
          getESGDataQuery = `SELECT * from esg WHERE agency IN ('${agencies[0]}') LIMIT ${result_count}`;
        } 
        else if(agencies.length === 2){
          getESGDataQuery = `SELECT * from esg WHERE agency IN ('${agencies[0]}','${agencies[1]}') LIMIT ${result_count}`;
        }
        else if(agencies.length === 3){
          getESGDataQuery = `SELECT * from esg WHERE agency IN ('${agencies[0]}','${agencies[1]}','${agencies[2]}') LIMIT ${result_count}`;
        }
        else{
          getESGDataQuery = `SELECT * from esg LIMIT ${result_count}`;
        }
      }
      else
      {
        if(agencies.length == 1){
          getESGDataQuery = `SELECT * from esg WHERE agency IN ('${agencies[0]}') AND rating>= ${min} AND rating <=${max} LIMIT ${result_count}`;
        } 
        else if(agencies.length === 2){
          getESGDataQuery = `SELECT * from esg WHERE agency IN ('${agencies[0]}','${agencies[1]}') AND rating>= ${min} AND rating <=${max} LIMIT ${result_count}`;
        }
        else if(agencies.length === 3){
          getESGDataQuery = `SELECT * from esg WHERE agency IN ('${agencies[0]}','${agencies[1]}','${agencies[2]}') AND rating>= ${min} AND rating <=${max} LIMIT ${result_count}`;
        }
        else
          getESGDataQuery = `SELECT * from esg WHERE rating>= ${min} AND rating <=${max} LIMIT ${result_count}`;
      }
  }

  //console.log(getESGDataQuery);

  client.query(getESGDataQuery, (err,result) =>{
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
          name: result.rows[i].name,
          rating: result.rows[i].rating,
          agency: result.rows[i].agency
        }

        arr_return.push(obj);
      }

      res.status(200).send({
        data: arr_return
      })
    }
  })


})


app.post('/getETFData', (req, res) =>{

  const {resultCount, alphabetical,ticker,min_volume,risk} = req.body;

  let getAllETFsQuery = "";

  //console.log(req.body);

  if (ticker && ticker !== "") {
    getAllETFsQuery = `SELECT * from etf WHERE ticker = '${ticker}'`;
  }
  else if(alphabetical){ //user wants in alphabetical order
    getAllETFsQuery = `SELECT * from etf WHERE volume >= ${min_volume} ORDER BY name ASC LIMIT ${resultCount}`;

    if(risk != "all"){
      getAllETFsQuery = `SELECT * from etf WHERE risk = '${risk}' AND volume >= ${min_volume} ORDER BY name ASC LIMIT ${resultCount}`;
    }
  }
  else{
    getAllETFsQuery = `SELECT * from etf WHERE volume >= ${min_volume} LIMIT ${resultCount}`;   
    
    if(risk != 'all'){
      getAllETFsQuery = `SELECT * from etf WHERE risk = '${risk}' AND volume >= ${min_volume} LIMIT ${resultCount}`;   
    }
  }

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
          name: result.rows[i].name,
          risk: result.rows[i].risk,
          volume: result.rows[i].volume,
          ytd_return: result.rows[i].ytd_return

        }

        arr_return.push(obj);
      }

      res.status(200).send({
        data: arr_return
      })
    }
  })
});
