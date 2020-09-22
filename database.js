const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = ``;

let db;

exports.mongoConnect = (callback) => {
  MongoClient.connect(url)
    .then(client => {
      db = client.db();
      callback();
    })
    .catch(err => console.log(err));
};

exports.getDB = () => {
  if (db) return db;
  else return 'NO DB';
};