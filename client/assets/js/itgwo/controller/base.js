(function() {
  'use strict';

  var itgwo = angular.module('itgwo');

  // Use this controller to set the title and config on every page.
  itgwo.controller('itgwo.controller.base', [
    '$http', '$scope', '$state', '$stateParams', '$controller', '$location', '$rootScope', 'config', 'FoundationApi', 'itgwo.service.notification', 'itgwo.service.httpInterceptor', 'Piwik',
    function ($http, $scope, $state, $stateParams, $controller, $location, $rootScope, config, FoundationApi, itgwoServiceNotification, itgwoServiceHttpInterceptor, Piwik) {

      // Set the title based on the route, otherwise overridde this in the
      // extending controller.
      $rootScope.title = $state.current.data.vars.title;
      $rootScope.config = config;
      $rootScope.isHomepage = false;

      // Piwik tracking..
      var DocumentTitle = $state.current.data.vars.title;
      var CustomUrl = $location.path();
      Piwik.trackPageView([DocumentTitle]);
      // --[ isLoading ]--------------------------------------------------------

      // $rootScope.isLoading = function() {
      //   return itgwoServiceHttpInterceptor.isLoading();
      // }

      // --[ contenttype to route ]---------------------------------------------

      $scope.contenttypeToRoute = function(contenttypeSlug) {
        var lookup = {
          'onderwerpen': 'onderwerp',
          'programmas' : 'programmaItem',
          'anekdotes' : 'anekdote',
          'themas' : 'thema'
        };

        return lookup[contenttypeSlug];
      }

      // --[ contenttype to singular ]------------------------------------------

      $scope.contenttypeToSingular = function(contenttypeSlug) {
        var lookup = {
          'onderwerpen': 'onderwerp',
          'programmas' : 'programma',
          'anekdotes' : 'anekdote',
          'themas' : 'thema'
        };

        return lookup[contenttypeSlug];
      }

      // --[ function range ]---------------------------------------------------

      $scope.range = function(min, max, step){
        step = step || 1;
        var input = [];
        for (var i = min; i <= max; i += step) input.push(i);
        return input;
      };

      // http://html5demos.com/storage#view-source

      $scope.storeData = function(key, value) {

        // Stringify the data..
        value = JSON.stringify(value);

        $scope.addLog("LocalStorage Store " + key);

        localStorage.setItem(key, value);

      }

      $scope.getData = function(key) {

        if (localStorage.getItem(key)) {
          var value = JSON.parse(localStorage.getItem(key));
          $scope.addLog("LocalStorage Get HIT " + key);
          return value;
        } else {
          $scope.addLog("LocalStorage Get MISS " + key);
          return false;
        }

      }


      $scope.addLog = function(line) {

        var time = Date.create().format('{yy}-{MM}-{dd} {HH}:{mm}:{ss}');
        var line = "[" + time + "] " + line + "\n";

        globalDebugLog += line;

        $scope.debuglog = globalDebugLog;
        console.log(line);

      }



      return $scope;
    }
  ]);

})();
