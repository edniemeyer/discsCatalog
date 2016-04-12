'use strict';

var mongoose  = require('mongoose'),
  Schema    = mongoose.Schema

var DiscSchema = new Schema({
  band: String,
  title: String,
  songs: [String],
  description: String
});



mongoose.model('Disc', DiscSchema);
