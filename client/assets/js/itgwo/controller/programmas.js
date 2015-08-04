(function() {
  'use strict';

  var itgwo = angular.module('itgwo');

  itgwo.controller('itgwo.controller.programma', [
    '$scope', '$controller', '$state','$http', '$rootScope', 'config', 'itgwo.service.notification',
    function ($scope, $controller, $state, $http, $rootScope, config, itgwoServiceNotification) {

      $scope.filter = "vr";

      if ($state.params.id) {

        // --[ fetch single programma ]-----------------------------------------
        $http
        .get(config.api.url + 'programmaonderdelen/' + $state.params.id, { cache: true })
        .then(function(result){
          $scope.onderdeel = result.data.data;
          // Larger image..
          $scope.onderdeel.attributes.image.thumbnail = $scope.onderdeel.attributes.image.thumbnail.replace('240x240', '752x564');
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
          $scope.speeltijden = result.data.data;
          //console.log($scope.speeltijden);
        })
        .catch(function(e) {
          itgwoServiceNotification.notification(e.data);
        });

      }

      // --[ extend base controller ]-------------------------------------------
      angular.extend(this, $controller('itgwo.controller.base', { $scope: $scope }));

    }
  ]);

})();
