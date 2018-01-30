const rally_utils = require('./common/rally_utils')
var _ = require('lodash');
const app_config = require('./config/app.json')

var log = require('log4js').getLogger("handler");
var Promise = require("bluebird");

module.exports.processPermissions = (date) => {
	//process.env.RALLY_WORKSPACE
	//let workspace_ref = app_config.workspace;
	let workspace_ref = process.env.RALLY_WORKSPACE;
	let data = {}
	let create_permissions = []
	//Get newly created teams
	//get Users
	    Promise.all([rally_utils.getProjectsByCreationDate(workspace_ref,true,date),rally_utils.getIntegrationUsers(workspace_ref,['c_IntegrationRole'])])
			.then((results) => {
				log.info('results>>',results);
				var data_array = [];
				if(results[0].TotalResultCount > 0 && results[1].TotalResultCount > 0){
					log.info(results[0].Results,results[1].Results)
					_.each(results[0].Results, function(project){
						_.each(results[1].Results, function(user){
							//sub admins and workspace admins have access to everything in this workspace. 
							if(user.SubscriptionPermission !=  'Workspace Admin' && user.SubscriptionPermission !=  'Subscription Admin' ){
								//log.info('roles config>>',app_config.roles,project);
								var role = app_config.roles[user.c_IntegrationRole] && app_config.roles[user.c_IntegrationRole].access || null;
								var exclude_restricted = app_config.roles[user.c_IntegrationRole] && app_config.roles[user.c_IntegrationRole].excludeRestricted || null;
								if(role && !(exclude_restricted && _.includes(project._refObjectName.toLowerCase(), 'restricted'))){
									data = {'User':user._ref, 'Project':project._ref, 'Workspace': workspace_ref, 'Role':role}	
									data_array.push(rally_utils.createArtifact(workspace_ref, 'ProjectPermission',  true, data));
								}
							}
						})
					})

					log.info('Total permissions to create>>', data_array.length)

					Promise.each(data_array, function(results){
						log.info('Total permissions created',results)
					}).catch((error) => {
						log.error(error)
					})


				}else{
					log.info('No action needed. Newly created projects:', results[0].TotalResultCount, ' Number of Users:',results[1].TotalResultCount)
				}

			}).catch((error) => {
				log.error(error)
			})
}