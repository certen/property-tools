/**
 * Created by certen on 22/04/2014.
 */

console.log("Starting property-to-email.js at " + Date());


var nodemailer = require("nodemailer");


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
db.query('SELECT *, (  (SELECT  price   FROM properties p2 WHERE p2.id = properties.id and p2.retrieved_date < properties.retrieved_date  order by  retrieved_date desc limit 1)) as previousprice FROM properties where emailed=0', function (appsError, apps) {
    if (appsError) {
        console.log(appsError);
    } else {
        processProperties(apps);

    }
    db.end();
});


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

            text += (index+1) +' ------------------------------\n';
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
        sendEmail(text);
       // console.log(text);
        markAsEmailed(rows);

        }


}

function sendEmail( body)
{
    var smtpTransport = nodemailer.createTransport("SMTP",{
        service: "Gmail",
        auth: {
            user: "certen@gmail.com",
            pass: " mpnmambcpckhlqfp"
        }
    });

    smtpTransport.sendMail({
        from: "certen@gmail.com",
        to: "erten@icloud.com, harriet.rawlings@icloud.com",
        subject: "New properties " ,
        text: body
    }, function(error, response) {
        if (!error) {
            console.log("Sending email at " + Date() + " with response \n", response);
        } else {
            console.error(error);
        }

        smtpTransport.close();
    });
}

function markAsEmailed(reviews)
{
    var db = getMysqlConnection();
    db.connect();

    for (var i = 0; i < reviews.length; i++) {
        var review = reviews[i];
        db.query("UPDATE properties SET emailed=1 WHERE id=?", review.id, function (error) {
            if (error) {
                console.log(error);
            }
        });
    }
    db.end();
}
