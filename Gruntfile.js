module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      my_target: {
        options: {
          mangle: true,
          beautify: false
        },
        files: {
          'public/js/dist/synth.min.js': ['public/js/src/socket.io.min.js', 'public/js/src/ui.js', 'public/js/src/oscillator.js', 'public/js/src/synth.js', 'public/js/src/main.js'],
          'public/js/dist/remote.min.js': ['public/js/src/socket.io.min.js', 'public/js/src/remote.js']
        }
      }
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
        tasks: ['uglify']
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

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  // Run nodemon
  grunt.loadNpmTasks('grunt-nodemon');
  // Watch for changes
  grunt.loadNpmTasks('grunt-contrib-watch');
  // Run  concurrent tasks
  grunt.loadNpmTasks('grunt-concurrent');

  // Default task(s).
  grunt.registerTask('default', ['concurrent']);

};
