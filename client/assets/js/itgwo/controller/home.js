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
        $scope.berichten = result.data.data;
        localforage.setItem('berichten', result.data.data).then(function(value) {
          console.log('localForage set berichten:', value.length);
          localforage.setItem('berichten_timestamp', new Date());
        });
      // })
      // .catch(function(e) {
      //   itgwoServiceNotification.notification(e.data);
      });

      // --[ fetch speeltijden. We kunnen ze maar vast hebben ]--------------------------
      $http
      .get(config.api.url + 'speeltijden?' + jQuery.param({ 'page[size]': 1000, 'sort': 'title' }), { cache: true })
      .then(function(result){
        localforage.setItem('speeltijden', result.data.data).then(function(value) {
          console.log('localForage set speeltijden:', value.length);
          localforage.setItem('speeltijden_timestamp', new Date());
        });
      });

      // --[ fetch programmaonderdelen. We kunnen ze maar vast hebben ]--------------------------
      $http
      .get(config.api.url + 'programmaonderdelen?' + jQuery.param({ 'page[size]': 1000, 'sort': 'name' }), { cache: true })
      .then(function(result){
        localforage.setItem('onderdelen', result.data.data).then(function(value) {
          console.log('localForage set onderdelen:', value.length);
          localforage.setItem('onderdelen_timestamp', new Date());
        });
      });


      // --[ extend base controller ]-------------------------------------------
      angular.extend(this, $controller('itgwo.controller.base', { $scope: $scope }));

      localforage.getItem('berichten').then(function(value) {
        console.log('localForage get berichten:', value.length)
        $scope.berichten = value;
        $scope.$apply();
      });



    }
  ]);

})();
