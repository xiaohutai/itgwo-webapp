(function() {
  'use strict';

  var itgwo = angular.module('itgwo');

  // Source: http://stackoverflow.com/questions/23804981/alternative-of-httpprovider-responseinterceptors
  // See also: https://docs.angularjs.org/api/ng/service/$http#interceptors
  // Not entirely sure if this is the best solution!

  itgwo.factory('itgwo.service.httpInterceptor',
    ['$q', '$window',
    function ($q, $window) {

      var count = 0;

      return {
        'request': function(config) {
          count++;
          // console.log('start', count);
          return config;
        },
        // 'requestError': function(rejection) {
        //   return $q.reject(rejection);
        // },
       'response': function(response) {
          count--;
          // console.log('stop', count);
          return response;
        },
       'responseError': function(rejection) {
          count--;
          // console.log('stop', count);
          return $q.reject(rejection);
        },
        'isLoading': function() {
          return count != 0;
        }
      };
      // end: return

    }
  ]);
})();
