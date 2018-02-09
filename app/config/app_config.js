module.exports.config = {
	"runOnce":true, // Set true if you would like to run it once. false to set the cron timer
	"cronTimer": "30 7 * * *", // set the timer see examples at https://crontab.guru/#30_7_*_*_*
	"days":10, // number of days to look back. 
	"newUsers":true, // Set true to create permissions to all the New Users (with proper role set) to existing teams. 
	"newTeams":true, // Set true to create permissions to all the existing users (with proper role set) to New teams.
	"roles": {  // Roles and their access. The role names should be exactly similar the value in (c_IntegrationRole) User integration role.
		"VP" : {
			"access" : "Viewer", // Access to be given. Possible values are Admin, Editor, Viewer
			"excludeRestricted" : false // set true to exclude the project folders (name) that has "restricted" on it.
		},
		"Director" : {
			"access" : "Viewer",
			"excludeRestricted" : false
		},
		"AgileCoach" : {
			"access" : "Admin",
			"excludeRestricted" : true
		}
	}
}