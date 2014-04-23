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
        database : 'reviews',
        port : "3306"
    });

    return db;
}

var db = getMysqlConnection();
db.connect();
db.query('SELECT * FROM properties where emailed=0', function (appsError, apps) {
    if (appsError) {
        console.log(appsError);
    } else {
        for (var appIndex = 0; appIndex < apps.length; appIndex++) {
            processAppComments(apps[appIndex]);
        }
    }
    db.end();
});



function sendEmail(appName, body)
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
        to: "erten@icloud.com",
        subject: "New reviews for " + appName,
        text: body,
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
