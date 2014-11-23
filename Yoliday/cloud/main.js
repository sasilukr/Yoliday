var express = require('express');
var _ = require('underscore');
var querystring = require('querystring');

/**
 * Create an express application instance
 */
var app = express();

/**
 * Create a Parse ACL which prohibits public access.  This will be used
 *   in several places throughout the application, to explicitly protect
 *   Parse User, TokenRequest, and TokenStorage objects.
 */
var restrictedAcl = new Parse.ACL();
restrictedAcl.setPublicReadAccess(false);
restrictedAcl.setPublicWriteAccess(false);

/**
 * Global app configuration section
 */
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body


app.get('/yoliday', function(req, res) {
    var yoName = req.query.username;
//  var yoLink = req.params.link;
//  var tempLocation = req.params.location; //42.360091;-71.09415999999999
//  var yoLatitude = (tempLocation.split(';'))[0];
//  var yoLongitude = (tempLocation.split(';'))[1];
//  res.end('username ='+yoName+' link='+yoLink);

    var yoLink = 'https://yoliday.parseapp.com/today'; // google search

    SendYo(yoName,yoLink, function(){
        res.end();
    });

});

function SendYo(yoUsername, yoLink, callback){
    Parse.Config.get().then(function(config) {
        var YO_TOKEN = config.get("YO_TOKEN");
        Parse.Cloud.httpRequest({
            url: 'http://api.justyo.co/yo/',
            method: "POST",
            body: {
                link:(yoLink ? yoLink : ''),
                api_token: YO_TOKEN,
                username: yoUsername
            },
            success: function (httpResponse) {
                console.log("Yo is sent to " + yoUsername + " with " + yoLink);
                callback();
            },
            error: function (httpResponse) {
                console.log("Fail to YO");
                callback();
            }
        });
    }, function(error) {
        // Something went wrong (e.g. request timed out)
        console.log("Fail to get parse Config");
        callback();
    });
}

app.get('/today', function(req, res) {
    Parse.Config.get().then(function(config) {
        var KIMONO_TOKEN = config.get("KIMONO_TOKEN");

        var today = new Date();
        var monthNames = [ "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December" ];
        var d = today.getDate();
        var m = today.getMonth();
        var y = today.getFullYear();
        var holidaySrc = "";
    //    holidaySrc = 'http://holidayapi.com/v1/holidays&country=us&year='+ yyyy + '&day=' + dd + '&month=' + mm; // US holiday
        holidaySrc = "http://nationaldaycalendar.com/latest-posts/"; // national day blog
        holidaySrc = "https://www.kimonolabs.com/api/cv6ue1gu?apikey=" + KIMONO_TOKEN; // kimono lab api to checkiday.com with list of national holiday

        Parse.Cloud.httpRequest({
            url: holidaySrc,
            method: "GET",
            success: function (httpResponse) {
                var data = JSON.parse(httpResponse.text);
    //            ----- holidayapi -----
    //            console.log("Holiday on " + mm + "/" + dd + "/" + yyyy + ": " + JSON.stringify(data["holidays"]));
    //            var holidayName = "No+Holiday";
    //
    //            if ( data["holidays"].length > 0 ) {
    //                holidayName = data["holidays"][0].name;
    //            }
    //
    //            var yoLink = 'https://www.google.com/search?q=' + holidayName; // google search



    //            ------ kimono lab api ------
                res.render('yoliday', {yolidays: data.results.holidays, currentDate: monthNames[m] + " " + d + ", " + y});
    //            res.json(data.results.holidays);
    //            res.json(data.results.holidays);

            },
            error: function (httpResponse) {
                console.log("Error getting holiday api " + httpResponse);
    //            callback();
            }
        });
    }, function(error) {
        // Something went wrong (e.g. request timed out)
        console.log("Fail to get parse Config");
        callback();
    });
});

// Attach the Express app to your Cloud Code
app.listen();