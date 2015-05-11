angular.module('portfolioService', [])
  .constant("SERVER", "http://ec2-52-24-241-84.us-west-2.compute.amazonaws.com:8000")


  .factory('Transaction', function($http, SERVER) {
    return {
      get : function(portfolio) {
        return $http.get(SERVER+'/portfolios/'+portfolio+'/transactions/?format=json');
      },
      save : function(portfolio, transactionData) {
        return $http({
          method: 'POST',
          url: SERVER+'/portfolios/'+portfolio+'/transactions/?format=json',
          headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
          data: $.param(transactionData)
        });
      },
      
    }
    })

    .factory('Quote', function($http, SERVER) {
    return {
      get : function(symbol) {
        return $http.get(SERVER+'/quotes/'+symbol);
      },
      
    }
    })

    .factory('Portfolio', function($http, SERVER) {
      return {
        get : function() {
          return $http.get(SERVER+'/portfolios/?format=json');
        },
        show : function(id) {
          return $http.get(SERVER+'/portfolios/' + id + '/?format=json');
        },
        save : function(portfolioData) {
        return $http({
          method: 'POST',
          url: SERVER+'/portfolios/?format=json',
          headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
          data: $.param(portfolioData)
        });
      },
      
      }
    })

    .factory('Position', function($http, SERVER) {
    return {
      get : function(portfolio) {
        return $http.get(SERVER+'/portfolios/'+portfolio+'/positions/?format=json');
      },
    }
    });


