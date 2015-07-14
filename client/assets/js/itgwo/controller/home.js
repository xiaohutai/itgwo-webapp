(function() {
  'use strict';

  var itgwo = angular.module('itgwo');

  itgwo.controller('itgwo.controller.home', [
    '$scope', '$controller', '$state','$http', 'config', 'itgwo.service.notification',
    function ($scope, $controller, $state, $http, config, itgwoServiceNotification) {

      // --[ fetch berichten ]-----------------------------------------------------
      $http
      .get(config.api.url + 'berichten?' + jQuery.param({ 'page[size]': 10 }), { cache: true })
      .then(function(result){
        $scope.berichten = result.data.data;
        // console.log(result.data.data);
      })
      .catch(function(e) {
        itgwoServiceNotification.notification(e.data);
      });

      // --[ extend base controller ]-------------------------------------------
      angular.extend(this, $controller('itgwo.controller.base', { $scope: $scope }));

    }
  ]);

})();
