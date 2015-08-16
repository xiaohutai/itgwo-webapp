(function() {
  'use strict';

  var itgwo = angular.module('itgwo', []);

  // --[ Config ]---------------------------------------------------------------

  itgwo.constant('config', {

    site: {
      title: 'ITGWO 2015',
      payoff: 'Into the Great Wide Open 2015'
    },

    app: {
      version: '0.2'
    },

    api: {
      url: 'http://programma.greatwideopen.nl/json/'
    },

    dates: [
      {
          "day": 1,
          "date": "2015-09-03",
          "name": "Donderdag",
          "shortname": "Don",
          "starttime": "2015-09-03T17:00:00+02:00",
          "endtime": "2015-09-04T04:00:00+02:00"
      },
      {
          "day": 2,
          "date": "2015-09-04",
          "name": "Vrijdag",
          "shortname": "Vrij",
          "starttime": "2015-09-04T12:00:00+02:00",
          "endtime": "2015-09-05T03:00:00+02:00"
      },
      {
          "day": 3,
          "date": "2015-09-05",
          "name": "Zaterdag",
          "shortname": "Zat",
          "starttime": "2015-09-05T09:00:00+02:00",
          "endtime": "2015-09-06T01:00:00+02:00"
      },
      {
          "day": 4,
          "date": "2015-09-06",
          "name": "Zondag",
          "shortname": "Zon",
          "starttime": "2015-09-06T10:00:00+02:00",
          "endtime": "2015-09-07T03:00:00+02:00"
      }
    ],

    locations: [
      {
          "locationId": "sportveld",
          "title": "Sportveld",
          "abbr": "SpVe",
          "icon": ""
      },
      {
          "locationId": "bospodium",
          "title": "Bospodium",
          "abbr": "BosP",
          "icon": ""
      },
      {
          "locationId": "fortweg",
          "title": "Fortweg",
          "abbr": "FortW",
          "icon": ""
      },
      {
          "locationId": "bolder-zaal",
          "title": "Bolder Zaal",
          "abbr": "BolZ",
          "icon": ""
      },
      {
          "locationId": "bolder-cafe",
          "title": "Bolder Cafe",
          "abbr": "BolC",
          "icon": ""
      },
      {
          "locationId": "podium-vlieland",
          "title": "Podium Vlieland",
          "abbr": "PoVl",
          "icon": ""
      },
      {
          "locationId": "strandtuin",
          "title": "Strandtuin Weltevree",
          "abbr": "StWe",
          "icon": ""
      },
      {
          "locationId": "voetbalkooi",
          "title": "Voetbalkooi",
          "abbr": "VoKo",
          "icon": ""
      },
      {
          "locationId": "dorpsstraat",
          "title": "Dorpsstraat",
          "abbr": "DoSt",
          "icon": ""
      }
    ]

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


  // Generic back button.
  itgwo.directive('backButton', ['$window', function ($window) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.on('click', function() {
          $window.history.back();
        });
      }
    };
  }]);


})();
