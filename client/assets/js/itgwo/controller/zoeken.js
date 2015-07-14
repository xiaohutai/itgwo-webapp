(function() {
  'use strict';

  var itgwo = angular.module('itgwo');

  itgwo.controller('itgwo.controller.zoeken', [
    '$scope', '$controller', '$state','$http', '$rootScope', '$location', 'config', 'itgwo.service.notification',
    function ($scope, $controller, $state, $http, $rootScope, $location, config, itgwoServiceNotification) {

      var q = ($state.params.q || '');
      var p = ($state.params.p || 1);
      var limit = 10;

      $scope.q = q;
      $scope.query = q; // duplicate
      $scope.p = p;
      $scope.zoekresultaten = [];
      $scope.title = "Zoeken"
      $scope.numPages = 0;

      if (q) {

        var params = {
          q: q,
          page: {
            number: p,
            size: limit
          }
        };

        $http
        .get(config.api.url + 'search?' + jQuery.param(params), { cache: true })
        .then(function(result){

          $scope.numPages = Math.ceil( result.data.meta.total / limit );
          $scope.zoekresultaten = result.data.data;
          $rootScope.title = 'Zoekresultaten';

        });

      }

      $scope.onFormSubmit = function(form) {
        $state.go('zoeken', { q: $scope.query, p: 1 });
      }

      // --[ extend base controller ]-------------------------------------------
      angular.extend(this, $controller('itgwo.controller.base', { $scope: $scope }));

    }
  ]);

})();
