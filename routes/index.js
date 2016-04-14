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

router.param('disc', function(req, res, next, id) {
    var query = Disc.findById(id);

    query.exec(function(err, disc) {
        if (err) { return next(err); }
        if (!disc) { return next(new Error('can\'t find disc')); }

        req.disc = disc;
        return next();
    });
});

router.get('/discs/:disc', function(req, res) {
    res.json(req.disc);
});

router.put('/discs/:disc', function(req, res, next) {
    Disc.findById(req.disc._id, function(err, disc) {
        if (err) { return next(err); };

        if (req.body.band) disc.band = req.body.band;
        if (req.body.title) disc.title = req.body.title;
        if (req.body.description) disc.description = req.body.description;
        if (req.body.songs) disc.songs = req.body.songs;

        disc.save(function(err) {
            if (err) { return next(err); };
            res.json(disc);
        });
    });
});

router.delete('/discs/:disc', function(req, res) {
    Disc.remove({
        _id: req.params._id
    }, function(err, disc) {
        if (err) return res.send(err);
        res.json({ message: 'Disc deleted' });
    });
});

router.post('/search', function(req, res, next) {

    Disc.search(
        {
            query_string:
            { query: req.body }
        }, function(err, results) {
            if (err) return next(err);
            if (!results) return next(new Error('No discs found'));
            res.json(results);
        });
});



module.exports = router;