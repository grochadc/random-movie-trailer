module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
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

  grunt.registerTask('default', ['uglify','copy']);

};
