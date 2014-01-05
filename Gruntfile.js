module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';',
      },
      basic_and_extras: {
        files: {
          'public/js/dist/synth.min.js': ['public/js/src/socket.io.min.js', 'public/js/src/ui.js', 'public/js/src/oscillator.js', 'public/js/src/synth.js', 'public/js/src/main.js'],
          'public/js/dist/remote.min.js': ['public/js/src/socket.io.min.js', 'public/js/src/remote.js']
        },
      },
    },
    nodemon: {
      dev: {
        options: {
          file: 'app.js',
          nodeArgs: ['--debug']
        }
      }
    },
    watch: {
      scripts: {
        files: ['public/js/src/*.js'],
        tasks: ['concat']
      },
    },
    concurrent: {
      dev: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-concurrent');

  // Default task(s).
  grunt.registerTask('default', ['concurrent']);

};
