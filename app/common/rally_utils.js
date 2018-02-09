// const app = require('./config/app_config')
// const app_config = app.config

const log = require('log4js').getLogger("rally_utils");

const rally = require('rally'),
    restApi = rally(),
    refUtils = rally.util.ref,
    queryUtils = rally.util.query;

const _ = require('lodash/core');

//const rp = require('request-promise');

module.exports.getArtifactByRef = (ref,fetch) => {
	return new Promise((resolve, reject) => {
		restApi.query({
	        ref: refUtils.getRelative(ref),
	        fetch: fetch
	    }, function(error, result) {
	        if(error) {
	        	log.error(error)
	        } else {
	        	resolve(result)
	        }
	    });
	})
}

module.exports.getArtifactByName = (type, name, fetch, typeDefRef) => {
	return new Promise((resolve, reject) => {
		restApi.query({
	        type: type,
	        fetch: fetch,
	        query: queryUtils.where('Name', '=', name).and('TypeDef', '=', typeDefRef)
	    }, function(error, result) {
	        if(error) {
	        	log.error(error)
	        } else {
	        	resolve(result)
	        }
	    });
	})
}

module.exports.updateArtifact = (workspace_ref, ref,  fetch, data) => {

	return new Promise((resolve,reject) => {
		restApi.update({
		    ref: refUtils.getRelative(ref), 
		    data: data,
		    fetch: fetch,
		    scope: {
		        workspace: refUtils.getRelative(workspace_ref)
		    }
		}, function(error, result) {
		    if(error) {
		        log.error(error);
		    } else {
		        resolve(result)
		    }
		});
	})
}

module.exports.getIntegrationUsers = (workspace_ref, fetch, user_types) => {
    return new Promise((resolve, reject) => {
        let query
        for(i in user_types){

                let type = user_types[i]
                if(i == 0){
                        query = queryUtils.where('c_IntegrationRole', '=', type)
                }else{
                        query = query.or('c_IntegrationRole', '=', type)
                }
        }


        restApi.query({
            type: 'User',
            fetch: fetch,
            query: query.and('Disabled','=',false),
                scope: {
                   workspace: refUtils.getRelative(workspace_ref)
                }
        }, function(error, result) {
            if(error) {
                log.error(error)
            } else {
                resolve(result)
            }
        });
    })
}


module.exports.getIntegrationUsersByCreationDate = (workspace_ref, fetch,date, user_types) => {
    return new Promise((resolve, reject) => {
        let query
        for(i in user_types){

                let type = user_types[i]
                if(i == 0){
                        query = queryUtils.where('c_IntegrationRole', '=', type)
                }else{
                        query = query.or('c_IntegrationRole', '=', type)
                }
        }        
        restApi.query({
            type: 'User',
            fetch: fetch,
            query: query.and('Disabled','=',false).and('CreationDate', '>', date),
            scope: {
               workspace: refUtils.getRelative(workspace_ref)
            }
        }, function(error, result) {
            if(error) {
                log.error(error)
            } else {
                resolve(result)
            }
        });
    })
}

module.exports.createArtifact = (workspace_ref, artifact,  fetch, data) => {
	return new Promise((resolve,reject) => {
		restApi.create({
			type: artifact,
		    data: data,
		    fetch: fetch,
		    scope: {
		        workspace: refUtils.getRelative(workspace_ref)
		    }
		}, function(error, permission) {
		    if(error) {
		        log.error(error);
		        resolve(error);
		    } else {
		        resolve(permission)
		    }
		});
	});
}

module.exports.getProjectsByCreationDate = (workspace_ref, fetch,  date) => {
    return new Promise((resolve, reject) => {
        restApi.query({
            type: 'Project',
            fetch: fetch,
            query: queryUtils.where('CreationDate', '>', date).and('State','=','Open'),
            order: 'CreationDate',
            scope: {
               workspace: refUtils.getRelative(workspace_ref)
            }
        }, function(error, result) {
            if(error) {
                log.error(error)
            } else {
                resolve(result)
            }
        });
    })
}


module.exports.getAllProjects = (workspace_ref, fetch) => {
    return new Promise((resolve, reject) => {
        restApi.query({
            type: 'Project',
            fetch: fetch,
            query: queryUtils.where('State','=','Open'),
            order: 'CreationDate',
            scope: {
               workspace: refUtils.getRelative(workspace_ref)
            }
        }, function(error, result) {
            if(error) {
                log.error(error)
            } else {
                resolve(result)
            }
        });
    })
}


// module.exports.createObject = (objectType, objectData) => {
//     return new Promise((resolve, reject) => {

//         var baseUrl = "https://rally1.rallydev.com/slm/webservice/v2.0/";
//         var requestURL = baseUrl + objectType + "/create";
//         var cookie_str =  "ZSESSIONID=" + process.env.RALLY_API_KEY + ';'    

//         var headers = {
//             cookie: cookie_str,
//             ZSESSIONID: process.env.RALLY_API_KEY
//         }

//         var options = {
//             method: 'POST',
//             uri: requestURL,
//             headers:  headers,
//             body: objectData,
//             json: true 
//         };

//         rp(options)
//             .then(function (result) {
//                 if(result.CreateResult.Errors.length == 0){
//                     log.info('Done: ', result.CreateResult.Object & result.CreateResult.Object._refObjectName);
//                 }else{
//                     log.error("Error found",result.CreateResult.Errors);
//                 }
                
//                 resolve(result)
//             })
//             .catch(function (err) {
//                 console.log(error)
//                 // API call failed...
//             });
//     });
// }