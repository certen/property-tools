var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
 // res.send('respond with a resource');


    res.json({ a: 1 }, null, 3);
});

module.exports = router;
