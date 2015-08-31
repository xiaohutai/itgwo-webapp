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

// https://dzone.com/articles/home-screen-web-apps-android
navigator.standalone = navigator.standalone || (screen.height-document.documentElement.clientHeight<80);

// http://www.html5rocks.com/en/tutorials/appcache/beginner/#toc-updating-cache
// Check if a new cache is available on page load.
window.addEventListener('load', function(e) {

  window.applicationCache.addEventListener('updateready', function(e) {
    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
      // Browser downloaded a new app cache.
      if (confirm('Een nieuwe versie van deze webapp is beschikbaar. Wil je updaten?')) {
        // window.location.reload();
        window.location.href = '/';
      }
    } else {
      // Manifest didn't changed. Nothing new to server.
    }
  }, false);

}, false);
