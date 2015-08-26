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

      // --[ fetch speeltijden. We kunnen ze maar vast hebben ]--------------------------
      $http
      .get(config.api.url + 'speeltijden?' + jQuery.param({ 'page[size]': 1000, 'sort': 'title' }), { cache: true })
      .then(function(result){
        itgwoServiceLocalstorage.addLog('HTTP pre-Get speeltijden');
        itgwoServiceLocalstorage.storeData('speeltijden', result.data.data);
      });


      // --[ extend base controller ]-------------------------------------------
      angular.extend(this, $controller('itgwo.controller.base', { $scope: $scope }));

      $scope.berichten = itgwoServiceLocalstorage.getData('berichten');


    }
  ]);

})();
