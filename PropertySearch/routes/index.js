var express = require('express');
var router = express.Router();

function processProperties(rows)
{
    //id address site title price description location retrieved_date emailed
    console.log("Property " + rows.length + " new properties ");
    if (rows.length > 0) {

        var text = '------------------------------\n';
        text +=  rows.length + ' new properties\n';
        text += '------------------------------\n\n';


        for (var index = 0; index < rows.length; index++) {
            var row = rows[index];

            var webaddress = row.site + row.id;
            var title = row.title;
            var price = row.price;
            var description = row.description;

            var address = row.address;
            var previousprice = row.previousprice;
            var mapaddress = "https://www.google.co.uk/maps/search/" + encodeURIComponent(address);

            //text += (index+1) +' ------------------------------\n';
            text += title + '\n';
            text += price + '\n';
            text += description + '\n';
            text += webaddress + '\n';

            if (previousprice != null && previousprice != "")
            {
                text += "Previous price:" + previousprice + '\n';
            }
            // text += mapaddress + '\n';
            text += '------------------------------\n';


            text += '\n';

            console.log(title);

        }
    }
}
function connecttodb() {
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
    db.query('SELECT *, (  (SELECT  price   FROM properties p2 WHERE p2.id = properties.id and p2.retrieved_date < properties.retrieved_date  order by  retrieved_date desc limit 1)) as previousprice FROM properties limit 10', function (appsError, apps)
    {
        if (appsError) {
            console.log(appsError);
        } else {
            processProperties(apps);

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
    connecttodb();
    res.render('search', { query: query,
        results : [
            {
                header: "somewhere", content: "abc"
            }
        ]});

});

router.get('/search/q/:q/start/:s', function(req, res) {
    //res.render('index', { title: 'Express' });
    res.send('Searching ' + req.param("q") + ' ' + req.param("s"));
});

module.exports = router;
