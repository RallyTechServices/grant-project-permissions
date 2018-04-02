# grant-project-permissions

## Deployment

### Prerequisites
* Node.js 6.x+
* A terminal

### Setup
Download zip file of the following application and extract at a desired location
https://github.com/RallyTechServices/grant-project-permissions

Set the following envirionment variables.
```
export RALLY_API_KEY=<APIKEY>
export RALLY_WORKSPACE=<WorkspaceURL>
```
Instructions to get API Key for your environment - https://help.rallydev.com/rally-application-manager

To get the workspace URL type in the following after logging into your workspace. Copy the "_ref" value.
https://rally1.rallydev.com/slm/webservice/v2.0/workspace

### Execution

Change to the folder where the application is installed. On command line enter
node app/index.js

You can verify if the app is running using the log files located at app-folder/logs

### Configuration

The application can be configured to using app-folder/app/config/app-config.js

The configuration file looks like below.
```javascript
module.exports.config = {
	"runOnce":true, // Set true if you would like to run it once. false to set the cron timer
	"cronTimer": "30 7 * * *", // set the timer see examples at https://crontab.guru/#30_7_*_*_*
	"days":1, // number of days to look back. 
	"newUsers":true, // Set true to create permissions to all the New Users (with proper role set) to existing teams. 
	"newTeams":true, // Set true to create permissions to all the existing users (with proper role set) to New teams.
	"roles": {  // Roles and their access. The role names should be exactly similar the value in (c_IntegrationRole) User integration role.
		"VP" : {
			"access" : "Viewer", // Access to be given. Possible values are Admin, Editor, Viewer
			"excludeRestricted" : false // set true to exclude the project folders (name) that has "restricted" on it.
		}
	}
}
```
