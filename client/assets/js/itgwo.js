(function() {
  'use strict';

  var itgwo = angular.module('itgwo', []);

  // --[ Config ]---------------------------------------------------------------

  itgwo.constant('config', {

    site: {
      title: 'ITGWO',
      payoff: 'Into the Great Wide Open 2015'
    },

    app: {
      version: '0.1'
    },

    api: {
      url: 'http://programma.greatwideopen.nl/json/'
    }

  });

  // --[ Filters ]--------------------------------------------------------------
  //
  // These are useful helper filters useful when working with contents that come
  // from Bolt's JSON API extension. Perhaps these need to be directives, I'm
  // not sure yet what the best solution is.
  //
  // ---------------------------------------------------------------------------

  // Returns the (first) key of an Object:
  // { key : value } => key
  itgwo.filter('key', function() {
    return function(input) {
      if (input === null || input === undefined) {
        return "";
      }
      return Object.keys(input)[0];
    };
  });

  // Returns the value (of the first key) of an Object:
  // { key : value } => value
  itgwo.filter('value', function() {
    return function(input) {
      return input[ Object.keys(input)[0] ];
    };
  });

  // Returns the last part of a string split by forward slashes.
  // "/foo/bar/baz" => "baz"
  itgwo.filter('slug', function() {
    return function(input) {
      var array = input.split('/');
      return array[array.length - 1];
    };
  });

  // --[ Directives ]-----------------------------------------------------------

  itgwo.directive("getThema",
    ['$http', '$filter', 'config', '$state',
    function($http, $filter, config, $state) {

    return {
      template: '<span class="label">{{ thema }}</span>', // TODO: make these things nice with includes?
      scope: {
        onderwerpSlug: "=getThema"
      },
      link: function(scope, element, attrs) {

        var key = $filter('key');
        var value = $filter('value');
        var slug = $filter('slug');

        $http
        .get(config.api.url + 'onderwerpen/' + scope.onderwerpSlug, { cache: true })
        .then(function(result) {

          var themaName = value(result.data.data.attributes.taxonomy.themas);
          var themaId = slug(key(result.data.data.attributes.taxonomy.themas));
          scope.thema = themaName;
          element[0].href = $state.href('thema', { id : themaId });

        }, function(err) {
          scope.thema = "Unknown";
          scope.url = "#";
        });
      }
    }
  }]);

})();
