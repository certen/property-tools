var express = require('express');
var router = express.Router();

function processProperties(rows, res, query)
{

    console.log( rows.length + " results for query " + query);
    var someresults = [];
    if (rows.length > 0) {

        for (var index = 0; index < rows.length; index++) {

            var row = rows[index];

            var webaddress = row.site + row.id;
            var title = row.title;
            var price = row.price;
            var description = row.description;

            var address = row.address;
            var previousprice = row.previousprice;
            var d = row.retrieved_date;

            var curr_date = d.getDate();
            var curr_month = d.getMonth();
            curr_month++;
            var curr_year = d.getFullYear();
            var retrieved_date = curr_date + "/" + curr_month  + "/" + curr_year);


            var mapaddress = "https://www.google.co.uk/maps/search/" + encodeURIComponent(address);


            result1 = {header:title, content:description, link:webaddress,price:price, previousprice:previousprice, map:mapaddress,added:retrieved_date};

            someresults.push(result1);

        }
    }

    res.render('search',
        {
            query: query,
            results : someresults,
            noresults : someresults.length == 0
        });
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
    var criteria = '%'+query+'%' ;

    criteria = db.escape(criteria);

    var sql = 'SELECT *, (  (SELECT  price   FROM properties p2 WHERE p2.id = properties.id and p2.retrieved_date < properties.retrieved_date  order by  retrieved_date desc limit 1)) as previousprice FROM properties';
    sql += ' where title like '+criteria+'  or  description like '+criteria+' limit 20';
    console.log(sql);

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

router.get('/', function(req, res) {
    res.render('index', { title: 'Property Search Engine' });

});

router.get('/search', function(req, res) {
    var query = req.param("searchstring");
    connecttodb(res, query);


});

module.exports = router;
