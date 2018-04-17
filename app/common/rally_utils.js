// const app = require('./config/app_config')
// const app_config = app.config

const log = require('log4js').getLogger("rally_utils");

const rally = require('rally'),
    restApi = rally(),
    refUtils = rally.util.ref,
    queryUtils = rally.util.query;

const _ = require('lodash/core');

const request = require('request');


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
            limit: Infinity,
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
            limit: Infinity,
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
		        log.error(error,data);
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
            limit: Infinity,
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
            limit: Infinity,
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

module.exports.createBulkItems = (objectData) => {
    return new Promise((resolve, reject) => {
        //log.info('Batch payload',JSON.stringify(objectData) );

        var baseUrl = "https://rally1.rallydev.com/slm/webservice/v2.0/";
        var requestURL = baseUrl + "batch";
        var cookie_str =  "ZSESSIONID=" + process.env.RALLY_API_KEY + ';'    

        var headers = {
            cookie: cookie_str,
            ZSESSIONID: process.env.RALLY_API_KEY
        }

        var queryParameters = {
            "shared":true,
            "workspace": process.env.RALLY_WORKSPACE
        }

        var options = {
            method: 'POST',
            qs: queryParameters,
            uri: requestURL,
            headers:  headers,
            body: { "Batch" : objectData },
            json: true,
            jar: true
        };

        request.post(options, function(error, response, body){
            if(error){
                log.debug("Error>>>>>", JSON.stringify(error));
                reject(error);
            }else{
                log.debug("HTTP Response code:", response.statusCode, "Errors:", body.BatchResult.Errors, "Warnings:", body.BatchResult.Warnings, "Total Updated: ", body.BatchResult.Results.length );
                resolve(response)
            }

        });

    });
}