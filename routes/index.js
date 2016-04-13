var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Disc = mongoose.model('Disc');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Discs Catalog' });
});

router.get('/discs', function(req, res, next) {
    Disc.find(function(err, discs) {
        if (err) { return next(err); }

        res.json(discs);
    });
});

router.post('/discs', function(req, res, next) {
    var disc = new Disc(req.body);

    disc.save(function(err, disc) {
        if (err) { return next(err); }

        res.json(disc);
    });
});

router.post('/search', function(req, res, next) {
    
    Disc.search(
        {
          query_string:
          { query: req.body }
        } , function(err, results) {
            if (err) return next(err);
            if(!results) return next(new Error('No discs found'));
            res.json(results);
        });
});



module.exports = router;