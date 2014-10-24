module.exports = function(grunt) {
  var pkg = grunt.file.readJSON('package.json');

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: pkg,
    traceur: {
      options: {
        modules: 'commonjs',
        sourceMaps: true,
        includeRuntime: true,
        generators: 'parse'
      },
      src: {
        files: [{
          expand: true,
          cwd: 'src',
          src: ['**/*.js'],
          dest: 'dist'
        }]
      }
    },
    execute: {
      launch: {
        options: {
          nodeargs: ['--harmony']
        },
        src: ['dist/index.js']
      },
      test: {
        options: {
          nodeargs: ['--harmony']
        },
        src: ['dist/test/index.js']
      }
    }
  });

  grunt.registerTask('build', function() {
    grunt.task.run('traceur:src');
  });

  grunt.registerTask('default' , '', function() {
    grunt.task.run('traceur:src', 'execute:launch');
  });

  grunt.registerTask('test', function() {
    grunt.task.run('traceur:src', 'execute:test');
  });
};