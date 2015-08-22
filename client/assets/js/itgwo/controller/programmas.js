(function() {
  'use strict';

  var itgwo = angular.module('itgwo');

  itgwo.controller('itgwo.controller.programma', [
    '$scope', '$sce', '$controller', '$state','$http', '$rootScope', 'config', 'itgwo.service.notification', 'itgwo.service.localstorage',
    function ($scope, $sce, $controller, $state, $http, $rootScope, config, itgwoServiceNotification, itgwoServiceLocalstorage) {

      var today = new Date().getDay() - 3;
      var days = {1: 'do', 2: 'vr', 3: 'za', 4: 'zo' }

      if (today >= 1 && today <= 4) {
        $scope.filter = days[today];
      } else {
        $scope.filter = "alle";
      }

      if ($state.params.id) {

        // --[ fetch single programma ]-----------------------------------------
        $http
        .get(config.api.url + 'programmaonderdelen/' + $state.params.id, { cache: true })
        .then(function(result){
          $scope.onderdeel = result.data.data.attributes;
          // Larger image..
          $scope.onderdeel.image.thumbnail = $scope.onderdeel.image.thumbnail.replace('240x240', '752x564');
          $scope.onderdeel.id = result.data.data.id;
          $rootScope.title = result.data.data.attributes.name;
        })
        .catch(function(e) {
          itgwoServiceNotification.notification(e.data);
        });

      } else {

        // --[ fetch programmas ]-----------------------------------------------

        // update bolt_speeltijden AS s SET s.image = (select p.image from bolt_programmaonderdelen as p where p.id = s.programmaonderdelen)

        $http
        .get(config.api.url + 'speeltijden?' + jQuery.param({ 'page[size]': 1000, 'sort': 'title' }), { cache: true })
        .then(function(result){
          itgwoServiceLocalstorage.addLog('HTTP Get speeltijden');
          $scope.speeltijden = result.data.data;
          itgwoServiceLocalstorage.storeData('speeltijden', $scope.speeltijden);
        })
        .catch(function(e) {
          itgwoServiceNotification.notification(e.data);
        });

      }

      // --[ extend base controller ]-------------------------------------------
      angular.extend(this, $controller('itgwo.controller.base', { $scope: $scope }));

      // Haal de versie uit localstorage op.
      $scope.speeltijden = itgwoServiceLocalstorage.getData('speeltijden');

    }

  ]);

})();
