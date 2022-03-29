require('dotenv').config();
const { Pool } = require('pg');
const { productQuery, styleQuery } = require('./queries');

  console.log(productQuery);

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT
});

module.exports = {
  queryProduct: (productId, callback) => {
    pool.query(productQuery, [productId], (err, res) => {
      if (err) {
        callback(err);
      } else {
        callback(null, res);
      }
    });
  },
  queryStyle: (productId, callback) => {
    pool.query(styleQuery, [productId], (err, res) => {
      if (err) {
        console.log(err);
        callback(err);
      } else {
        // callback(null, res.rows[0]);
        console.log(res);
        callback(null, res);
      }
    });
  }
}





// client.query('SELECT $1::text as message', ['Hello world!'], (err, res) => {
//   console.log(err ? err.stack : res.rows[0].message) // Hello World!
//   client.end()
// })

// console.log(process.env.POSTGRES_PASSWORD);