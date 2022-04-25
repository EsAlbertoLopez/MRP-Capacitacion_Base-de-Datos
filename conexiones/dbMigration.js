var mysql = require('mysql');

let mrp = {
  host     : 'localhost',
  port     : '3307',
  user     : 'root',
  password : 'root',
  database:  'mrp',
  multipleStatements: true
};

var poolCluster = mysql.createPoolCluster();
poolCluster.add('mrp', mrp);


module.exports = poolCluster;