var globalDebugLog = "";

(function() {
  'use strict';

  angular.module('application', [
    'ui.router',
    'ngAnimate',
    'ngSanitize',
    // 'ngResource',

    //foundation
    'foundation',
    'foundation.dynamicRouting',
    'foundation.dynamicRouting.animations',

    // custom
    'itgwo',
    'piwik'
  ])
    .config(config)
    .run(run)
  ;

  config.$inject = ['$urlRouterProvider', '$locationProvider', '$httpProvider'];

  function config($urlProvider, $locationProvider, $httpProvider) {
    $urlProvider.otherwise('/');

    $locationProvider.html5Mode({
      enabled: false,
      requireBase: false
    });

    $locationProvider.hashPrefix('!');

    $httpProvider.interceptors.push('itgwo.service.httpInterceptor');
  }

  function run() {
    FastClick.attach(document.body);
  }

})();
