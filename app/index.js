process.title = process.argv[2];
var _ = require('lodash');

const handler = require('./handler')
const app_config = require('./config/app.json')
var cron = require('node-cron');

// log4js Logger
const log4js = require('log4js');
log4js.configure('app/config/log4js.json');

var log = log4js.getLogger('index');

const run = () => {
	var d = new Date();
	var days = app_config.days || 1;
	d.setDate(d.getDate() - days);
	console.log('Time (ISO) to check from ',d.toISOString(), 'Days Prior: ',days);

	handler.processNewUserPermissions(d.toISOString()).then((x) => {
		log.info(x);
		handler.processNewProjectPermissions(d.toISOString()).then((x) => {
			log.info(x);
		});
	});

}

if(app_config.runOnce){
	console.log('Running Once');
	run();
}else{
	//use a timer 
	console.log('Cron job started', app_config.cronTimer);

	cron.schedule(app_config.cronTimer, function(){
		run();
	});
}

