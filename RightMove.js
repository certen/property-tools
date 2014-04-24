var request = require('request'); // lets you connect to web pages

var cheerio = require('cheerio'); // cheerio mimics the DOM and jQuery/CSS style selectors

var geonoder = require('geonoder'); //used for geocoding

var mysql = require('mysql');
console.log("Starting Rightmove.js at " + Date());



function mysqlConnection()
{
    var db = mysql.createConnection ({
        user : 'root',
        password : 'C!01082e',
        host : "localhost",
        database : "reviews",
        port : "3306"
    });

    return db;
}

function insertPropertyToDb( id, address, site, title, price, description)
{
    var property = {
        id : id,
        address: address,
        site: site,
        title: title,
        price : price,
        description : description
    }

    var db = mysqlConnection();
    db.connect();
    db.query('INSERT IGNORE INTO properties SET ?', property);
    db.end();
}


for(counter=10;counter<30;counter=counter+10){
    var url = 'http://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=OUTCODE%5E1666&insId=2&minPrice=300000&maxPrice=400000&primaryDisplayPropertyType=flats&radius=0.5&index=' + counter;
    console.log(url);
    request(url, function(err, resp, body) {

        if (err)

            throw err;

        $ = cheerio.load(body);

        $('.address.bedrooms a:contains()').each(function() {
            var id =$(this).attr('href')
            console.log (id);

            request ('http://www.rightmove.co.uk' + $(this).attr('href'), function(err,resp,body) {

                $ = cheerio.load(body);


                var address = $('#addresscontainer h2').text().replace(/\s+/g,' ');
                var price = $('#propertyprice').text().replace(/\s+/g,' ');
                var description = $('.propertyDetailDescription').text().replace(/\s+/g,' ').replace(/'\'/,'');
                var tit = $('head title').text();


                var imageLinksTemp=new Array();
                links = $('.thumbnailimage a img');
                $(links).each(function (i,link) {
                    imageLinksTemp[i] =($(link).attr('src'));
                    //console.log('imageLinks[' + i + ']' + imageLinks[i]);
                });


                console.log ('Title: ' + tit);
                console.log ('id: ' + id);
                console.log ('Address: ' + address);
                console.log ('Price: ' + price);
                console.log ('Description: ' + description);


                //  console.log ('Images: ' + $('meta[property="og:image"]').attr('content'))

                //console.log ('Images: ' + $('meta[property="og:image"]').attr('content'));

          /*      geonoder.toCoordinates(address, geonoder.providers.google, function geo(lat, long) {
                    //console.log('Lat: ' + lat + ' Long: ' + long) //
                    var lattitude = lat;
                    var longtitude = long;
                    save(lattitude, longtitude);

                });
                function save(lattitude, longtitude) {
                    console.log(lattitude + " " + longtitude)
                    */
                    console.log(tit);
                    //( id, address, site, title, price, description)
                    insertPropertyToDb(id, address , "http://www.rightmove.co.uk" , tit, price, description);


            /*    }*/

            });
        });
    });
}
