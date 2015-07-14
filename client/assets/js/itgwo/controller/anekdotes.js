(function() {
  'use strict';

  var itgwo = angular.module('itgwo');

  itgwo.controller('itgwo.controller.anekdotes', [
    '$scope', '$controller', '$state','$http', '$rootScope', 'config', 'itgwo.service.notification',
    function ($scope, $controller, $state, $http, $rootScope, config, itgwoServiceNotification) {

      // --[ fetch anekdote ]---------------------------------------------------

      $http
      .get(config.api.url + 'anekdotes/' + $state.params.id, { cache: true })
      .then(function(result){
        $scope.anekdote = result.data.data;
        $rootScope.title = result.data.data.attributes.title;
      })
      .catch(function(e) {
        itgwoServiceNotification.notification(e.data);
      })

      // --[ extend base controller ]-------------------------------------------

      angular.extend(this, $controller('itgwo.controller.base', { $scope: $scope }));

    }
  ]);

})();
