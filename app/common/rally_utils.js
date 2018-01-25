//const app_config = require('../config/app.json')

const log = require('log4js').getLogger("rally_utils");

const rally = require('rally'),
    restApi = rally(),
    refUtils = rally.util.ref,
    queryUtils = rally.util.query;

const _ = require('lodash/core');

module.exports.projectIncluded = (rule_name, top_project_names, project_uuid) => {

	return new Promise((resolve, reject) => {
	    let x = {}
		
		if(top_project_names.length < 1){
			// No projects specified, no restrictions for this rule. 
			x[rule_name] = true
			resolve(x)
		}

		let query 
		
		for(i in top_project_names){
			
			let top_project_name = top_project_names[i]
			if(i == 0){
				query = queryUtils.where('Name', '=', top_project_name)
			}else{
				query = query.or('Name', '=', top_project_name)
			}
			query = query.or('Parent.Name', '=',top_project_name) 
			query = query.or('Parent.Parent.Name', '=',top_project_name) 
			query = query.or('Parent.Parent.Parent.Name', '=',top_project_name) 
			query = query.or('Parent.Parent.Parent.Parent.Name', '=',top_project_name) 
			query = query.or('Parent.Parent.Parent.Parent.Parent.Name', '=',top_project_name) 
			query = query.or('Parent.Parent.Parent.Parent.Parent.Parent.Name', '=',top_project_name) 
			query = query.or('Parent.Parent.Parent.Parent.Parent.Parent.Parent.Name', '=',top_project_name) 
			query = query.or('Parent.Parent.Parent.Parent.Parent.Parent.Parent.Parent.Name', '=',top_project_name)
		}

		query = query.and('ObjectUUID','=',project_uuid)

		log.info('Query String', query.toQueryString());

		restApi.query({
	        type: 'project',
	        fetch: ['FormattedID'],
	        query: query
	    }, function(error, result) {
	        if(error) {
	        	log.error(error)
	        } else {
	        	log.info('result')
	        	x[rule_name] = result.TotalResultCount > 0
	        	resolve(x)
	        }
	    });

	})
}


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

module.exports.getIntegrationUsers = (workspace_ref, fetch) => {
    return new Promise((resolve, reject) => {
        restApi.query({
            type: 'User',
            fetch: fetch,
            query: queryUtils.where('c_IntegrationRole', '!=', null),
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
		}, function(error, result) {
		    if(error) {
		        log.error(error);
		    } else {
		        resolve(result)
		    }
		});
	})
}

module.exports.getProjectsByCreationDate = (workspace_ref, fetch,  date) => {
    return new Promise((resolve, reject) => {
        restApi.query({
            type: 'Project',
            fetch: fetch,
            query: queryUtils.where('CreationDate', '>', date),
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
