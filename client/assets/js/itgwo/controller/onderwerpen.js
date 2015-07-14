(function() {
  'use strict';

  var itgwo = angular.module('itgwo');

  itgwo.controller('itgwo.controller.onderwerpen', [
    '$scope', '$controller', '$state','$http', '$rootScope', 'config', 'itgwo.service.notification',
    function ($scope, $controller, $state, $http, $rootScope, config, itgwoServiceNotification) {

      // --[ fetch anekdotes ]--------------------------------------------------
      $http
      .get(config.api.url + 'anekdotes?' + jQuery.param({ 'filter[onderwerpen]': $state.params.id }), { cache: true })
      .then(function(result){
        $scope.anekdotes = result.data.data;
      })
      .catch(function(e) {
        itgwoServiceNotification.notification(e.data);
      });

      // --[ fetch onderwerp ]--------------------------------------------------
      $http
      .get(config.api.url + 'onderwerpen/' + $state.params.id, { cache: true })
      .then(function(result){
        $scope.onderwerp = result.data.data;
        $rootScope.title = result.data.data.attributes.title;
      })
      .catch(function(e) {
        itgwoServiceNotification.notification(e.data);
      });

      // --[ extend base controller ]-------------------------------------------
      angular.extend(this, $controller('itgwo.controller.base', { $scope: $scope }));

    }
  ]);

})();
