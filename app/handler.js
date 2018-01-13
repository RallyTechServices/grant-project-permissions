const rally_utils = require('./common/rally_utils')
var _ = require('lodash');
const app_config = require('./config/app.json')

var log = require('log4js').getLogger("handler");

module.exports.processPermissions = (date) => {

	date = "2018-01-11T21:34:22.830Z"
	let workspace_ref = "https://rally1.rallydev.com/slm/webservice/v2.0/workspace/62127578008"
	let data = {}
	let create_permissions = []
	//Get newly created teams
	//get Users
	    Promise.all([rally_utils.getProjectsByCreationDate(workspace_ref,true,date),rally_utils.getIntegrationUsers(workspace_ref,['c_IntegrationRole'])])
			.then((results) => {
				log.info('results>>',results);
				if(results[0].TotalResultCount > 0 && results[1].TotalResultCount > 0){
					log.info(results[0].Results,results[1].Results)
					_.each(results[0].Results, function(project){
						_.each(results[1].Results, function(user){
							data = {'User':user._ref, 'Project':project._ref, 'Workspace': workspace_ref, 'Role':'Editor'}
							log.info('data>>',data);
							create_permissions.push(rally_utils.createArtifact(workspace_ref, 'ProjectPermission',  true, data))
						})
					})
					//create permissions for all the projects for all the users

						Promise.all(create_permissions)
							.then((results) => {
								log.info('Total permissions created',results.TotalResultCount,results)
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