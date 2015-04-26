(function() {
  'use strict';

  angular.module('application').controller('EntriesController', EntriesController);

  EntriesController.$inject = [ '$http', '$scope', '$stateParams', '$controller'];

  function EntriesController($http, $scope, $stateParams, $controller) {

    angular.extend(this, $controller(
        'DefaultController',
        { $http: $http, $scope: $scope, $stateParams: $stateParams}
        ));

    $http
        .get("http://bob.biz.tm/json/entries")
        .success(function(data){
            $scope.entries = data.entries;
        });

}


})();