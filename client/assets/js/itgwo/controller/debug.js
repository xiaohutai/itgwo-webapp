(function() {
  'use strict';

  var itgwo = angular.module('itgwo');

  itgwo.controller('itgwo.controller.debug', [
    '$scope', '$controller', '$state','$http', '$rootScope', 'config', 'itgwo.service.notification', 'itgwo.service.localstorage',
    function ($scope, $controller, $state, $http, $rootScope, config, itgwoServiceNotification, itgwoServiceLocalstorage) {

      // --[ extend base controller ]-------------------------------------------
      angular.extend(this, $controller('itgwo.controller.base', { $scope: $scope }));


      localforage.getItem('berichten').then(function(value) {
        console.log('localForage get berichten:', value.length)
        $scope.berichten = value;
        localforage.getItem('berichten_timestamp').then(function(value) {
          $scope.berichten_timestamp = value;
          $scope.$apply();
        });
      });


      localforage.getItem('onderdelen').then(function(value) {
        console.log('localForage get onderdelen:', value.length)
        $scope.onderdelen = value;
        localforage.getItem('onderdelen_timestamp').then(function(value) {
          $scope.onderdelen_timestamp = value;
          $scope.$apply();
        });
      });


      localforage.getItem('speeltijden').then(function(value) {
        console.log('localForage get speeltijden:', value.length)
        $scope.speeltijden = value;
        localforage.getItem('speeltijden_timestamp').then(function(value) {
          $scope.speeltijden_timestamp = value;
          $scope.$apply();
        });
      });



    }
  ]);

})();
