const rally_utils = require('./common/rally_utils')
var _ = require('lodash');
const app_config = require('./config/app.json')

var log = require('log4js').getLogger("handler");

const workspace_ref = process.env.RALLY_WORKSPACE;

// this creates permission to all the existing users with integration role to the all the newly created projects.
module.exports.processNewProjectPermissions = (date) => {
	return new Promise((resolve, reject) => {

		log.info('Creating Permissions for existing users to new teams');
		
		let data = {}
		let create_permissions = []
		//Get newly created teams
		//get Users
		    Promise.all([rally_utils.getProjectsByCreationDate(workspace_ref,['Name'],date),rally_utils.getIntegrationUsers(workspace_ref,['c_IntegrationRole'],Object.keys(app_config.roles))])
				.then((results) => {
					log.info('Projects Created: ',results[0].TotalResultCount, 'Users that will be updated: ',results[1].TotalResultCount );
					var data_array = [];
					if(results[0].TotalResultCount > 0 && results[1].TotalResultCount > 0){
						//log.info(results[0].Results,results[1].Results)
						_.each(results[1].Results, function(user){
							_.each(results[0].Results, function(project){
								//sub admins and workspace admins have access to everything in this workspace. 
								if(user.SubscriptionPermission !=  'Workspace Admin' && user.SubscriptionPermission !=  'Subscription Admin' ){
									//log.info('roles config>>',app_config.roles,project);
									var role = app_config.roles[user.c_IntegrationRole] && app_config.roles[user.c_IntegrationRole].access || null;
									var exclude_restricted = app_config.roles[user.c_IntegrationRole] && app_config.roles[user.c_IntegrationRole].excludeRestricted || null;
									if(role && !(exclude_restricted && _.includes(project._refObjectName.toLowerCase(), 'restricted'))){
										data = {'User':user._ref, 'Project':project._ref, 'Workspace': workspace_ref, 'Role':role}	
										data_array.push(data);
										//data_array.push(rally_utils.createArtifact(workspace_ref, 'ProjectPermission',  true, data));
									}
								}
							})
						})

						log.info('Total permissions to create>>', data_array.length)
						runSerialPermissions(data_array).then((result) => {
								log.info('Permissions have been created to all the existing users for the newly created teams')
								resolve("Permissions have been created to all the existing users for the newly created teams")
							}).catch((error) => {
								log.error(error)
								reject()
								//TODO: notify 
							})

					}else{
						log.info('No action needed. Newly created projects:', results[0].TotalResultCount, ' Number of Users:',results[1].TotalResultCount)
					}

		}).catch((error) => {
			log.error(error)
			reject()
		})
	});
}

// this creates permission to all the new users with integration role to the all the existing projects.
module.exports.processNewUserPermissions = (date) => {
	return new Promise((resolve, reject) => {

		log.info('Creating Permissions for existing users to new teams');
		let workspace_ref = process.env.RALLY_WORKSPACE;
		let data = {}
		let create_permissions = []
		//Get newly created teams
		//get Users
		    Promise.all([rally_utils.getAllProjects(workspace_ref,['Name']),rally_utils.getIntegrationUsersByCreationDate(workspace_ref,['c_IntegrationRole'],date,Object.keys(app_config.roles))])
				.then((results) => {
					log.info('Projects Created: ',results[0].TotalResultCount, 'Users that will be updated: ',results[1].TotalResultCount );
					var data_array = [];
					if(results[0].TotalResultCount > 0 && results[1].TotalResultCount > 0){
						//log.info(results[0].Results,results[1].Results)
						_.each(results[1].Results, function(user){
							_.each(results[0].Results, function(project){
								//sub admins and workspace admins have access to everything in this workspace. 
								if(user.SubscriptionPermission !=  'Workspace Admin' && user.SubscriptionPermission !=  'Subscription Admin' ){
									//log.info('roles config>>',app_config.roles,project);
									var role = app_config.roles[user.c_IntegrationRole] && app_config.roles[user.c_IntegrationRole].access || null;
									var exclude_restricted = app_config.roles[user.c_IntegrationRole] && app_config.roles[user.c_IntegrationRole].excludeRestricted || null;
									if(role && !(exclude_restricted && _.includes(project._refObjectName.toLowerCase(), 'restricted'))){
										data = {'User':user._ref, 'Project':project._ref, 'Workspace': workspace_ref, 'Role':role}	
										data_array.push(data);
										//data_array.push(rally_utils.createArtifact(workspace_ref, 'ProjectPermission',  true, data))
									}
								}
							})
						})

						log.info('Total permissions to create>>', data_array.length)

						runSerialPermissions(data_array).then((result) => {
								log.info('Permissions have been created to all the newly created users for the existing teams')
								resolve("Permissions have been created to all the newly created users for the existing teams")
							}).catch((error) => {
								log.error(error)
								reject()
								//TODO: notify 
							})

					}else{
						log.info('No action needed. Newly created projects:', results[0].TotalResultCount, ' Number of Users:',results[1].TotalResultCount)
					}

		}).catch((error) => {
			log.error(error)
			reject()
		})
	});
}


const runSerialPermissions = (data_array,workspace_ref) => {
  var result = Promise.resolve();
  _.each(data_array,function(data){
	    result = result.then(() => rally_utils.createArtifact(workspace_ref, 'ProjectPermission',  true, data).then((permission) => { 
	        log.info('Permissions Updated: ',permission && permission.Object && permission.Object.Name, permission && permission.Object && permission.Object.User && permission.Object.User._refObjectName, permission && permission.Object && permission.Object.Project && permission.Object.Project._refObjectName );
	    })).then(wait);
  })
  return result;
}

function wait() {
    return new Promise(r => setTimeout(r, 1200))
}
