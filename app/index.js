process.title = process.argv[2];
var _ = require('lodash');

const handler = require('./handler')
const app = require('./config/app_config')
const app_config = app.config

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

	if(app_config.newUsers && app_config.newTeams){
		handler.processNewUserPermissions(d.toISOString()).then((x) => {
			log.info("processNewUserPermissions",x);
			handler.processNewProjectPermissions(d.toISOString()).then((x) => {
				log.info("processNewProjectPermissions",x);
			});
		});
	}else if(app_config.newUsers){
		handler.processNewUserPermissions(d.toISOString()).then((x) => {
			log.info("processNewUserPermissions",x);
		});
	}else if(app_config.newTeams){
		handler.processNewProjectPermissions(d.toISOString()).then((x) => {
			log.info("processNewProjectPermissions",x);
		});
	}else{
		console.log('Nothing to do. Please set newUsers and/or newTeams to true to run the scripts');
		log.info('Nothing to do. Please set newUsers and/or newTeams to true to run the scripts');
	}

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

