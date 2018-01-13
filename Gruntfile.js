module.exports = function(grunt) {
    require('grunt');
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        watch: {
            files: ['./app/**/*.js','./spec/**/*spec.js'],
            tasks: ['test-fast']
        },
        
        exec: {
          test: 'npm test'
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-exec');
      
    grunt.registerTask('default', ['exec']);
    grunt.registerTask('test-fast', ['exec']);

};