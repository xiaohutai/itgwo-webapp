(function() {
  'use strict';

  var itgwo = angular.module('itgwo');

  itgwo.controller('itgwo.controller.programma', [
    '$scope', '$sce', '$controller', '$state','$http', '$rootScope', 'config', 'itgwo.service.notification', 'itgwo.service.localstorage',
    function ($scope, $sce, $controller, $state, $http, $rootScope, config, itgwoServiceNotification, itgwoServiceLocalstorage) {

      var date = new Date();
      var today = date.getDay() - 3;
      var days = {1: 'do', 2: 'vr', 3: 'za', 4: 'zo' }

      // Zondag..
      if (today == -3) {
        today = 4;
      }

      console.log('today: ', today);

      if (today >= 1 && today <= 4) {
        $scope.filter = days[today];
      } else {
        $scope.filter = "alle";
      }

      if ($state.params.id) {

        // --[ fetch single programma ]-----------------------------------------
        $http
        .get(config.api.url + 'programmaonderdelen?' + jQuery.param({ 'page[size]': 1000, 'sort': 'name' }), { cache: true })
        .then(function(result){
          localforage.setItem('onderdelen', result.data.data).then(function(value) {
            console.log('localForage set onderdelen:', value.length);
            localforage.setItem('onderdelen_timestamp', new Date());
          });
          $scope.onderdeel = findOnderdeel($state.params.id, result.data.data);
          $rootScope.title = $scope.onderdeel.name;
        });

      } else {

        // --[ fetch speeltijden ]-----------------------------------------------

        // update bolt_speeltijden AS s SET s.image = (select p.image from bolt_programmaonderdelen as p where p.id = s.programmaonderdelen)

        $http
        .get(config.api.url + 'speeltijden?' + jQuery.param({ 'page[size]': 1000, 'sort': 'title' }), { cache: true })
        .then(function(result){
          $scope.speeltijden = result.data.data;
          localforage.setItem('speeltijden', result.data.data).then(function(value) {
            console.log('localForage set speeltijden:', value.length);
            localforage.setItem('speeltijden_timestamp', new Date());
          });
        });


      }

      // --[ extend base controller ]-------------------------------------------
      angular.extend(this, $controller('itgwo.controller.base', { $scope: $scope }));

      // Haal de versie uit localstorage op.
      localforage.getItem('speeltijden').then(function(value) {
        console.log('localForage get speeltijden:', value.length)
        $scope.speeltijden = value;
        $scope.$apply();
      });

      localforage.getItem('favs').then(function(value) {
        console.log('localForage get favs:', value.length)
        $scope.favs = value;
        $scope.$apply();
      });


      if ($state.params.id) {
        localforage.getItem('onderdelen').then(function(value) {
          console.log('localForage get onderdelen:', value.length)
          $scope.onderdeel = findOnderdeel($state.params.id, value);
          $rootScope.title = $scope.onderdeel.name;
          $scope.$apply();
        });
      }




      function findOnderdeel(id, onderdelen) {

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





    }
  ]);
})();
