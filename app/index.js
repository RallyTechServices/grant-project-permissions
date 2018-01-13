process.title = process.argv[2];
//const bodyParser = require('body-parser')
//const express = require('express')  
const handler = require('./handler')
const app_config = require('./config/app.json')

//const app = express()

// log4js Logger
const log4js = require('log4js');
log4js.configure('app/config/log4js.json');


//use a timer to pass the datetime
handler.processPermissions('xx');