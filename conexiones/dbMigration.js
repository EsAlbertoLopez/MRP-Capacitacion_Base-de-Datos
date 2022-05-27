var mysql = require('mysql');

let mrp = {
  host     : 'localhost',
  port     : '3306',
  user     : 'MRP',
  password : 'mrpdatabase',
  database:  'mrp',
  multipleStatements: true
};

var poolCluster = mysql.createPoolCluster();
poolCluster.add('mrp', mrp);


module.exports = poolCluster;