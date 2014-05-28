var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res) {
    //res.render('index', { title: 'Express' });
    res.send('Property SearchEngine');
});

router.get('/search/q/:q/start/:s', function(req, res) {
    //res.render('index', { title: 'Express' });
    res.send('Searching ' + req.param("q") + ' ' + req.param("s"));
});
module.exports = router;
