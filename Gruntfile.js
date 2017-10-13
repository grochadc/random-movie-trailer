module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          captureFile: 'results.txt', // Optionally capture the reporter output to a file
          quiet: false, // Optionally suppress output to standard out (defaults to false)
          clearRequireCache: false, // Optionally clear the require cache before running tests (defaults to false)
          clearCacheFilter: (key) => true, // Optionally defines which files should keep in cache
          noFail: false // Optionally set to not fail on failed tests (will still fail on other errors)
        },
        src: ['test/**/*.js']
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
      },
      build: {
          files: grunt.file.expandMapping(['**/*.js', '*.js'],'dist/', {
            cwd: 'src/'
          })
      }
    },
    copy: {
      files: {expand: true, cwd: 'src/', src: ['models/*','public/*', 'views/**/*', 'vies/*'], dest: 'dist/'}
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('default', ['mochaTest','uglify','copy']);

};
