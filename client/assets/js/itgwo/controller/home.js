(function() {
  'use strict';

  var itgwo = angular.module('itgwo');

  itgwo.controller('itgwo.controller.home', [
    '$scope', '$controller', '$state','$http', 'config', 'itgwo.service.notification', 'itgwo.service.localstorage',
    function ($scope, $controller, $state, $http, config, itgwoServiceNotification, itgwoServiceLocalstorage) {


      // --[ fetch berichten ]-----------------------------------------------------
      $http
      .get(config.api.url + 'berichten?' + jQuery.param({ 'page[size]': 10 }), { cache: true })
      .then(function(result){
        itgwoServiceLocalstorage.addLog('HTTP Get berichten');
        $scope.berichten = result.data.data;
        itgwoServiceLocalstorage.storeData('berichten', $scope.berichten);
      })
      .catch(function(e) {
        itgwoServiceNotification.notification(e.data);
      });

      // --[ extend base controller ]-------------------------------------------
      angular.extend(this, $controller('itgwo.controller.base', { $scope: $scope }));

      $scope.berichten = itgwoServiceLocalstorage.getData('berichten');


    }
  ]);

})();
