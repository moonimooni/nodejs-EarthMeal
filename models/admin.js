const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Admin = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  tel: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExp: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('Admin', Admin);