(function() {
  'use strict';

  var itgwo = angular.module('itgwo');

  // Use this controller to set the title and config on every page.
  itgwo.controller('itgwo.controller.base', [
    '$http', '$scope', '$state', '$stateParams', '$controller', '$location', '$rootScope', 'config', 'FoundationApi', 'itgwo.service.notification', 'itgwo.service.httpInterceptor', 'itgwo.service.localstorage', 'Piwik',
    function ($http, $scope, $state, $stateParams, $controller, $location, $rootScope, config, FoundationApi, itgwoServiceNotification, itgwoServiceHttpInterceptor, itgwoServiceLocalstorage, Piwik) {

      // Set the title based on the route, otherwise overridde this in the
      // extending controller.
      $rootScope.title = $state.current.data.vars.title;
      $rootScope.config = config;
      $rootScope.isHomepage = false;

      // Piwik tracking..
      var DocumentTitle = $state.current.data.vars.title;
      var CustomUrl = $location.path();
      Piwik.trackPageView([DocumentTitle]);

      var routeName = $state.current.name;
      console.log("routename " , routeName);
      if (routeName == 'bericht' || routeName == 'onderdeel') {
        $rootScope.showBackButton = true;
      } else {
        $rootScope.showBackButton = false;
      }

      // --[ isLoading ]--------------------------------------------------------

      // $rootScope.isLoading = function() {
      //   return itgwoServiceHttpInterceptor.isLoading();
      // }


      // --[ function range ]---------------------------------------------------

      $scope.range = function(min, max, step){
        step = step || 1;
        var input = [];
        for (var i = min; i <= max; i += step) input.push(i);
        return input;
      };


      $scope.findOnderdeel = function(id, onderdelen) {

        console.log('findOnderdeel');

        for (var i = 0; i <= onderdelen.length; i += 1) {
          // console.log(onderdelen[i]);
          if (onderdelen[i]['id'] == id) {
            var onderdeel = onderdelen[i].attributes;

            // Larger image..
            onderdeel.image.thumbnail = onderdeel.image.thumbnail.replace('240x240', '752x564');
            onderdeel['uid'] = onderdelen[i]['id'];

            return onderdeel;
          }
        }

      };


      $scope.addFavorite = function(id, name) {

        localforage.getItem('favs').then(function(favs) {
          if (favs == null) {
            favs = [];
          }
          favs[id] = name;
          localforage.setItem('favs', favs).then(function(value) {
            console.log('favorite added:', id, name);
            $scope.favs = value;
            $scope.$apply();
          });
        });

      };

      $scope.removeFavorite = function(id) {
        localforage.getItem('favs').then(function(favs) {
          if (favs == null) {
            favs = [];
          }
          delete favs[id];
          localforage.setItem('favs', favs).then(function(value) {
            console.log('favorite removed:', id);
            $scope.favs = value;
            $scope.$apply();
          });
        });
      };

      $scope.randomRotate = function(seed) {
        var x = Math.sin(seed) * 10000;
        x = x - Math.floor(x);

        // console.log(x-0.5, Math.pow((9 * x - 4.5), 2));
        return Math.pow((9 * x - 4.5), 2);

      };

      return $scope;

    }
  ]);

})();
