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
// http://stackoverflow.com/questions/5063489/how-can-you-get-the-css-pixel-device-pixel-ratio
navigator.standalone = navigator.standalone || (screen.height-document.documentElement.clientHeight< (40 * window.devicePixelRatio));

// http://stackoverflow.com/questions/9926504/how-do-i-check-windows-phone-useragent-with-javascript
// if (navigator.userAgent.match(/Windows Phone/i)) {
//   if (window.external.msIsSiteMode()) {
//     alert("voor derk ja!");
//   } else {
//     alert("voor derk nee:");
//   }
// }


// alert("Standalone: " + navigator.standalone
//     + "\n - DPR: " + window.devicePixelRatio
//     + "\n - scr.hei: " + screen.height
//     + "\n - clientHeight: " + document.documentElement.clientHeight );



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
