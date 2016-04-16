'use strict';

var mongoose = require('mongoose'),
  mongoosastic = require('mongoosastic'),
  Schema = mongoose.Schema



var DiscSchema = new Schema({
  band: { type: String, es_indexed: true },
  title: { type: String, es_indexed: true },
  songs: [String],
  description: String
});


DiscSchema.plugin(mongoosastic);


//Synchronizing ES with MongoDB
var Disc = mongoose.model('Disc', DiscSchema)
, stream = Disc.synchronize()
  , count = 0;

stream.on('data', function(err, doc){
  count++;
});
stream.on('close', function(){
  console.log('indexed ' + count + ' documents!');
});
stream.on('error', function(err){
  console.log(err);
});;
