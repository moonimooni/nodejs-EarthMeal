const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = `mongodb+srv://moonimooni:UjaqBY9cQsXak37O@cluster0.9tapk.mongodb.net/shop?retryWrites=true&w=majority`;

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