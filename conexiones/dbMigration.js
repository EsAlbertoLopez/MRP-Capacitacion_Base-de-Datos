var mysql = require('mysql');

let mrp = {
  host     : 'localhost',
  port     : '3306',
  user     : 'mrp',
  password : 'mrpdatabase',
  database:  'MRP',
  multipleStatements: true
};

var poolCluster = mysql.createPoolCluster();
poolCluster.add('mrp', mrp);


module.exports = poolCluster;