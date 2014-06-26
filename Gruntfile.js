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
          'public/js/dist/synth.min.js': ['public/js/src/react.js', 'public/js/src/oscillator.js', 'public/js/src/engine.js', 'public/js/src/data.js', 'public/js/tmp/main.js'],
          'public/js/dist/remote.min.js': ['public/js/src/remote.js']
        },
      },
    },
    react: {
      dynamic_mappings: {
        files: [
          {
            expand: true,
            cwd: 'public/js/src/',
            src: ['*.jsx'],
            dest: 'public/js/tmp/',
            ext: '.js'
          }
        ]
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
        files: ['public/js/src/*.jsx', 'public/js/src/*.js'],
        tasks: ['react', 'concat']
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
  grunt.loadNpmTasks('grunt-react');

  // Build source files
  grunt.registerTask('build', ['react', 'concat']);

  // Build source files, start server and watch for changes
  grunt.registerTask('default', ['react', 'concat', 'concurrent']);

};
