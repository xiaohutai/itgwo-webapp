(function() {
  'use strict';

  var itgwo = angular.module('itgwo');

  itgwo.controller('itgwo.controller.berichten', [
    '$scope', '$controller', '$state','$http', '$rootScope', 'config', 'itgwo.service.notification',
    function ($scope, $controller, $state, $http, $rootScope, config, itgwoServiceNotification) {

      // --[ fetch onderwerpen ]------------------------------------------------
      // $http
      // .get(config.api.url + 'onderwerpen?' + jQuery.param({ 'filter[themas]': $state.params.id }), { cache: true })
      // .then(function(result){
      //   $scope.onderwerpen = result.data.data;
      // })
      // .catch(function(e) {
      //   itgwoServiceNotification.notification(e.data);
      // });

      // --[ fetch thema ]------------------------------------------------------
      $http
      .get(config.api.url + 'berichten/' + $state.params.id, { cache: true })
      .then(function(result){
        $scope.thema = result.data.data;
        // $rootScope.title = result.data.data.attributes.title;
      })
      .catch(function(e) {
        itgwoServiceNotification.notification(e.data);
      });

      // --[ extend base controller ]-------------------------------------------
      angular.extend(this, $controller('itgwo.controller.base', { $scope: $scope }));
    }
  ]);

})();
