var request = require('request'); // lets you connect to web pages

var cheerio = require('cheerio'); // cheerio mimics the DOM and jQuery/CSS style selectors

var mysql = require('mysql');
console.log("Starting Rightmove.js at " + Date());


var pool  = mysql.createPool ({
    connectionLimit : 5,
    user : 'root',
    password : 'C!01082e',
    host : "localhost",
    database : "properties",
    port : "3306"
});



function insertPropertyToDb( id, address, site, title, price, description)
{
    var property = {
        id : id,
        address: address,
        site: site,
        title: title,
        price : price,
        description : description,
        emailed : false
    }
    pool.getConnection(function(err, connection) {
        if (err) {
            console.error(err);
        }
        else {
            connection.query('INSERT IGNORE INTO properties SET ?', property, function(err) {
                if (err) {
                    console.error(err);
                }
                else {
                    console.log("id upsert " + id);
                }
                connection.release();

            });


        }
    });
}

var n1 = 'http://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=OUTCODE%5E1666&minPrice=300000&maxPrice=420000&displayPropertyType=flats&sortType=6&numberOfPropertiesPerPage=50';
var e3 = 'http://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=OUTCODE%5E756&insId=2&sortType=6&minPrice=210000&maxPrice=420000&minBedrooms=2&displayPropertyType=flats&oldDisplayPropertyType=flats&numberOfPropertiesPerPage=50';
var n1environs = 'http://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=USERDEFINEDAREA^{%22id%22%3A2267199}&sortType=6&minPrice=300000&maxPrice=420000&minBedrooms=1&displayPropertyType=flats&oldDisplayPropertyType=flats&numberOfPropertiesPerPage=50&viewType=LIST';
var greenwich='http://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E85358&insId=2&sortType=6&minPrice=210000&maxPrice=420000&minBedrooms=2&displayPropertyType=flats&oldDisplayPropertyType=flats&numberOfPropertiesPerPage=50&googleAnalyticsChannel=buying';
var blackheath = 'http://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E85278&insId=3&sortType=6&minPrice=210000&maxPrice=420000&minBedrooms=2&displayPropertyType=flats&oldDisplayPropertyType=flats&numberOfPropertiesPerPage=50&googleAnalyticsChannel=buying';

ReadProperty(n1);
ReadProperty(e3);
ReadProperty(n1environs);
//ReadProperty(greenwich);
ReadProperty(blackheath);

function ReadProperty(url)
{
    console.log(url);
    request(url, function (err, resp, body) {

        if (err) {
            console.error(err);
        }
        $ = cheerio.load(body);

        $('.address.bedrooms a:contains()').each(function () {
            var id = $(this).attr('href')
            console.log(id);

            request('http://www.rightmove.co.uk' + $(this).attr('href'), function (err, resp, body) {

                $ = cheerio.load(body);

                var address = $('#addresscontainer h2').text().replace(/\s+/g, ' ');
                var price = $('#propertyprice').text().replace(/\s+/g, ' ');
                var description = $('.propertyDetailDescription').text().replace(/\s+/g, ' ').replace(/'\'/, '');
                var tit = $('head title').text();


                var imageLinksTemp = new Array();
                links = $('.thumbnailimage a img');
                $(links).each(function (i, link) {
                    imageLinksTemp[i] = ($(link).attr('src'));
                    //console.log('imageLinks[' + i + ']' + imageLinks[i]);
                });


                console.log('Title: ' + tit);
                console.log('id: ' + id);
                console.log('Address: ' + address);
                console.log('Price: ' + price);
                console.log('Description: ' + description);


                console.log(tit);
                //( id, address, site, title, price, description)
                if (price != "" && id != "")
                {
                    insertPropertyToDb(id, address, "http://www.rightmove.co.uk", tit, price, description);
                }
            });
        });
    });
}