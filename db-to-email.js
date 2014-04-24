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
db.query('SELECT id FROM properties where emailed=0', function (appsError, apps) {
    if (appsError) {
        console.log(appsError);
    } else {
        for (var appIndex = 0; appIndex < apps.length; appIndex++) {
            processAppComments(apps[appIndex]);
        }
    }
    db.end();
});


function processAppComments(app)
{
    var db1 = getMysqlConnection();
    db1.connect();

    //id address site title price description location retrieved_date emailed
    db1.query('SELECT * FROM properties  WHERE emailed=0 and  id = ?', app.id, function (error, rows) {
        if (error) {
            console.log(error);
        } else {
            console.log("Property " + rows.length + " new properties for " + app.id);
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
                    var mapaddress = "https://www.google.co.uk/maps/search/" + encodeURIComponent(address);

                    text += index +' ------------------------------\n';
                    text += title + '\n';
                    text += price + '\n';
                    text += description + '\n';
                    text += webaddress + '\n';
                    text += mapaddress + '\n';
                    text += '------------------------------\n';


                    text += '\n';

                }


               // sendEmail(text);
                console.log(text);
                markReviewsAsEmailed(rows);

            }
        }
    });
    db1.end();
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
        to: "home@canerten.com",
        subject: "New properties " ,
        text: body
    }, function(error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log("Sending email for " + appName + " at " + Date() + " with response \n", response);
        }

        smtpTransport.close();
    });
}

function markReviewsAsEmailed(reviews)
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
