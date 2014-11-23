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
//app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body


app.get('/yoliday', function(req, res) {
    var yoName = req.params.username; //ch4ch4
//  var yoLink = req.params.link; //http://harveychan.net
//  var tempLocation = req.params.location; //42.360091;-71.09415999999999
//  var yoLatitude = (tempLocation.split(';'))[0];
//  var yoLongitude = (tempLocation.split(';'))[1];
//  res.end('username ='+yoName+' link='+yoLink);

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    var options = {
        host: 'http://holidayapi.com/v1/holidays&country=us&year='+ yyyy + '&day=' + dd + '&month=' + mm,
        method: 'GET',
        headers: {
            accept: 'application/json'
        }
    };

    console.log("Start");
    var x = http.request(options,function(res){
        console.log("Connected");
        res.on('data',function(data){
            console.log(data);
        });
    });

    x.end();


});

app.get('/outgoingYo', function(req, res) {

});

// Attach the Express app to your Cloud Code
app.listen();