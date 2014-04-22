var request = require('request'); // lets you connect to web pages

var cheerio = require('cheerio'); // cheerio mimics the DOM and jQuery/CSS style selectors

var geonoder = require('geonoder'); //used for geocoding

function Property() {
    this.address = "";
    this.latitude = 0;
    this.longitude = 0;
    this.rooms =0;
    this.price = 0;
    this.desc = "";
    this.Schedule = "";
    this.EstateAgent ="";
    this.imageLinks = "";
    this.loc = 0;
    this.saleID = "";
    this.addedOn= "";
    this.title = "";
    this.desciption = "";

}

function PropertyToString(prop) {
    var ret = prop.title + " : " + prop.price + " ";
    return ret;
}

for(counter=10;counter<30;counter=counter+10){
    var url = 'http://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=OUTCODE%5E1666&insId=2&minPrice=250000&maxPrice=350000&primaryDisplayPropertyType=flats&radius=0.5&index=' + counter;
    //var url = 'http://www.rightmove.co.uk/property-for-sale/Edinburgh.html?index=' + counter;
    console.log(url);
    request(url, function(err, resp, body) {

        if (err)

            throw err;

        $ = cheerio.load(body);

        $('.address.bedrooms a:contains()').each(function() {

            console.log ($(this).attr('href'));

            request ('http://www.rightmove.co.uk' + $(this).attr('href'), function(err,resp,body) {

                $ = cheerio.load(body);


                var address = $('#addresscontainer h2').text().replace(/\s+/g,' ');
                var rooms = $('#propertyAddress h1').text().replace(/\s+/g,' ');
                var price = $('#propertyprice').text().replace(/\s+/g,' ');
                var description = $('.propertyDetailDescription').text().replace(/\s+/g,' ').replace(/'\'/,'');
                var schedule = ('http://www.rightmove.co.uk' + $('#brochure-0-link').attr('href'));
                var estate = $('#agentdetails h2').text().replace(/\s+/g,' ').replace(/'\'/,'');
                var addOn = 'Not available.';
                var tit = $('#displayaddress').text();
                var desc = $('.propertyDetailDescription').text();

                var imageLinksTemp=new Array();
                links = $('.thumbnailimage a img');
                $(links).each(function (i,link) {
                    imageLinksTemp[i] =($(link).attr('src'));
                    //console.log('imageLinks[' + i + ']' + imageLinks[i]);
                });

                console.log ('Title: ' + $('#fs-22 h1').text());
                console.log ('Address: ' + $('#addresscontainer h2').text());
                console.log ('Price: ' + $('#propertyprice').text());
                console.log ('Description: ' + $('.propertyDetailDescription').text());
                //  console.log ('Images: ' + $('meta[property="og:image"]').attr('content'))

                //console.log ('Images: ' + $('meta[property="og:image"]').attr('content'));

                geonoder.toCoordinates(address, geonoder.providers.google, function geo(lat, long) {
                    //console.log('Lat: ' + lat + ' Long: ' + long) //
                    var lattitude = lat;
                    var longtitude = long;
                    save(lattitude, longtitude);

                });
                function save(lattitude, longtitude) {


                    var house = new Property({
                        address: (address),
                        latitude: (lattitude),
                        longitude: (longtitude),
                        rooms: (rooms),
                        price: (price),
                        desc: (description),
                        Schedule: (schedule),
                        EstateAgent: (estate),
                        imageLinks: imageLinksTemp,
                        loc: [(longtitude), (lattitude)],
                        saleID: 'For Sale',
                        addedOn: addOn,
                        title :  tit,
                        desciption :  desc
                        //images:
                    });

                    console.log(PropertyToString(house));
                }
                /*console.log ('Title: ' + $('#propertyAddress h1').text());
                 console.log ('Address: ' + $('#addresscontainer h2').text());
                 console.log ('Price: ' + $('#propertyprice').text());
                 console.log ('Description: ' + $('.propertyDetailDescription').text());
                 console.log ('Images: ' + $('meta[property="og:image"]').attr('content'));*/


            });
        });
    });
}
