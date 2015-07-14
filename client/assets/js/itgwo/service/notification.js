(function() {
  'use strict';

  var itgwo = angular.module('itgwo');

  itgwo.service('itgwo.service.notification', [
    'config', '$filter', '$http', 'FoundationApi',
    function (config, $filter, $http, FoundationApi) {

      this.notification = function(e) {
          FoundationApi.publish('notifications', {
            title: 'Error: ' + e.errors.title,
            content: e.errors.detail,
            color: 'alert'
          });
      }

  }]);

})();
