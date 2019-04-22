const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Quote = new Schema({ //was Todo
  zipcode: {
    type: Number
  },
  height: {
    type: Number
  },
  heightCharge: {
    type: Number
  },
  width: {
    type: Number
  },
  quote: {
    type: Number
  },
  finish: {
    type: String
  },
  finishCharge:{
    type:Number
  },
  wood: {
    type: String
  },
  woodCharge:{
    type:Number
  },
  side:{
    type: String
  },
  sideCharge:{
    type: Number
  }
});

module.exports = mongoose.model('Quote', Quote);