var express = require('express');
var router = express.Router();

function processProperties(rows, res, query)
{
    //id address site title price description location retrieved_date emailed
    console.log("Property " + rows.length + " new properties ");
    if (rows.length > 0) {
        var someresults = [];

        for (var index = 0; index < rows.length; index++) {

            var row = rows[index];

            var webaddress = row.site + row.id;
            var title = row.title;
            var price = row.price;
            var description = row.description;

            var address = row.address;
            var previousprice = row.previousprice;
            var mapaddress = "https://www.google.co.uk/maps/search/" + encodeURIComponent(address);


            var titlewithcost = title + "-" + price;

            console.log(titlewithcost);

            result1 = {header:titlewithcost, content:description, link:webaddress,price:price, previousprice:previousprice, map:mapaddress};

            someresults.push(result1);

        }

        res.render('search',
            {
                query: query,
                results : someresults
            });
    }
}
function connecttodb(res, query) {
    var mysql = require('mysql');

    function getMysqlConnection()
    {
        var db = mysql.createConnection ({
            user : 'root',
            password : 'C!01082e',
            host : 'localhost',
            database : 'properties',
            port : "3306"
        });

        return db;
    }

    var db = getMysqlConnection();
    db.connect();

    var sql = 'SELECT *, (  (SELECT  price   FROM properties p2 WHERE p2.id = properties.id and p2.retrieved_date < properties.retrieved_date  order by  retrieved_date desc limit 1)) as previousprice FROM properties';
    sql += 'description like \'%'+query+'%\' limit 10';

    db.query(sql, function (appsError, apps)
    {
        if (appsError) {
            console.log(appsError);
            res.render('search', { query: query,
                results : [
                    {
                        header: "somewhere", content: "abc"
                    }
                ]});
        } else {
            processProperties(apps, res, query);

        }
        db.end();
});
}


/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Property Search Engine' });
    //res.send('Property SearchEngine');
});

router.get('/search', function(req, res) {
    var query = req.param("searchstring");
    connecttodb(res, query);


});

router.get('/search/q/:q/start/:s', function(req, res) {
    //res.render('index', { title: 'Express' });
    res.send('Searching ' + req.param("q") + ' ' + req.param("s"));
});

module.exports = router;
