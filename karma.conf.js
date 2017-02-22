//jshint strict: false
module.exports = function(config) {
    config.set({

        basePath: './app',

        files: [
            'bower_components/angular/angular.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'app.js',
            'Google-Maps/*.js',
            'mapView/*.html',
            'mapView/*.js',
            'mainView/*.html',
            'mainView/*.js',
            'mapTest.js',
            'https://maps.googleapis.com/maps/api/js?key=AIzaSyDfWHJKH0z5ktBQ3U59gjNGj2S6adb-Zl0'
        ],
        autoWatch: true,

        frameworks: ['jasmine'],

        // reporters: ['progress', 'coverage'],
        //
        // preprocessors: {
        //     '**/*.js': ['coverage']
        // },
        reporters: ["coverage"],
        preprocessors: {
            "**/*.js": "coverage"
        },
        browsers: ['Chrome'],

        plugins: [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter',
            'karma-coverage'
        ],

        junitReporter: {
          outputFile: 'test_out/unit.xml',
          suite: 'unit'
        }

  });
};
