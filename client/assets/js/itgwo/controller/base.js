(function() {
  'use strict';

  var itgwo = angular.module('itgwo');

  // Use this controller to set the title and config on every page.
  itgwo.controller('itgwo.controller.base', [
    '$http', '$scope', '$state', '$stateParams', '$controller', '$location', '$rootScope', 'config', 'FoundationApi', 'itgwo.service.notification', 'itgwo.service.httpInterceptor',
    function ($http, $scope, $state, $stateParams, $controller, $location, $rootScope, config, FoundationApi, itgwoServiceNotification, itgwoServiceHttpInterceptor) {

      $rootScope.title = $state.current.data.vars.title;
      $rootScope.config = config;

      // --[ isLoading ]--------------------------------------------------------

      $rootScope.isLoading = function() {
        return itgwoServiceHttpInterceptor.isLoading();
      }

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

      return $scope;
    }
  ]);

})();
