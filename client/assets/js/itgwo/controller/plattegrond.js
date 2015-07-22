(function() {
  'use strict';

  var itgwo = angular.module('itgwo');

  itgwo.controller('itgwo.controller.plattegrond', [
    '$scope', '$controller', '$state','$http', '$rootScope', 'config', 'itgwo.service.notification',
    function ($scope, $controller, $state, $http, $rootScope, config, itgwoServiceNotification) {



      // --[ extend base controller ]-------------------------------------------
      angular.extend(this, $controller('itgwo.controller.base', { $scope: $scope }));
    }
  ]);

})();
