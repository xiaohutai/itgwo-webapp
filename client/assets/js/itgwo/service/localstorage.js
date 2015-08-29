(function() {
  'use strict';

  var itgwo = angular.module('itgwo');

  itgwo.service('itgwo.service.localstorage', [
    'config', '$filter', '$http', '$rootScope',
    function (config, $filter, $http, $rootScope) {

      // http://html5demos.com/storage#view-source

      this.storeData = function(key, value) {

      }

      this.getData = function(key) {

      }

      this.addLog = function(line) {

      }

  }]);

})();
