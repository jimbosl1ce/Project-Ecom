const { queryProduct, queryStyle } = require('./models');

module.exports = {
  getProduct: (req, res, next) => {
    const { product_id } = req.params;
    queryProduct(product_id, (err, success) => {
      if (err) {
        res.status(400).send({err, errorMessage: 'Not Found', result: product_id});
      } else {
        if (success.rowCount) {
          res.status(200).send(success.rows[0].row_to_json);
        } else {
          res.status(400).send({err, errorMessage: 'Not Found', result: product_id});
        }
      }
    });
  },
  getStyles: (req, res, next) => {
    const { product_id } = req.params;
    queryStyle(product_id, (err, success) => {
      if (err) {
        res.status(400).send(err);
      } else {
        if (success.rowCount) {
          res.status(200).send(success.rows[0]);
        } else {
          res.status(400).send({err, errorMessage: 'Not Found', result: product_id});
        }
      }
    });
  }
};

