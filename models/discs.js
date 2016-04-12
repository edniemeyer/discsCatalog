'use strict';

var mongoose     = require('mongoose'),
    mongoosastic = require('mongoosastic'),
    Schema       = mongoose.Schema
  


var DiscSchema = new Schema({
  band: String,
  title: { type:String, es_indexed:true },
  songs: [String],
  description: String
});


DiscSchema.plugin(mongoosastic);

mongoose.model('Disc', DiscSchema);
