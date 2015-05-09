angular.module('mainCtrl', [])

  .controller('mainController', function($scope, $http, Transaction, Portfolio, Quote, Position) {
    $scope.transactionData = {};
    $scope.positionData = {};
    $scope.portfolios = {};
    

    // loading variable to show the spinning loading icon
    $scope.loading = true;

    Quote.get('F')
     .success(function(data) {
        $scope.quote = data['F'];
        $scope.loading = false;
      });

     Portfolio.get()
     .success(function(data) {
        $scope.portfolios = data;
        $scope.loading = false;
      });

    Portfolio.show(1)
      .success(function(data) {
        $scope.portfolio = data;
        $scope.loading = false;
      });


    
    // get all the transactions
    Transaction.get(1)
      .success(function(data) {
        $scope.transactions = data;
        $scope.loading = false;
      });

    Position.get(1)
      .success(function(data) {
        $scope.positions = data;
        $scope.loading = false;
      });

    
    $scope.getQuote = function() {
      Quote.get(angular.uppercase($scope.quoteRequest.symbol))
        .success(function(data) {
            if(data[angular.uppercase($scope.quoteRequest.symbol)]['symbol']) {
              $scope.quote = data[angular.uppercase($scope.quoteRequest.symbol)];
              $scope.quoteRequest = {};
            }
            else {alert ('Symbol not found')}

            })
      }

    $scope.loadPortfolio = function(id) {
  
      Portfolio.show(id)
      .success(function(data) {
              $scope.portfolio = data;
              Transaction.get($scope.portfolio.id)
                .success(function(getData) {
                  $scope.transactions = getData;
                  $scope.loading = false;
                });
               Position.get($scope.portfolio.id)
                .success(function(getData) {
                  $scope.positions = getData;
                  $scope.loading = false;
                });
            })
      }

    $scope.createPortfolio = function() {
      $scope.loading = true;
      Portfolio.save($scope.portfolioData)
        .success(function(data) {
              $scope.portfolioData = {};
              $scope.portfolio = data;
              // if successful, refresh positions and transactions
              Transaction.get($scope.portfolio.id)
                .success(function(getData) {
                  $scope.transactions = getData;
                  $scope.loading = false;
                });
               Position.get($scope.portfolio.id)
                .success(function(getData) {
                  $scope.positions = getData;
                  $scope.loading = false;
                });
                Portfolio.get()
               .success(function(data) {
                  $scope.portfolios = data;
                  $scope.loading = false;
                });

            })
          
      }

    // submit transactions
    $scope.submitTransaction = function() {
      $scope.transactionData.portfolio = $scope.portfolio.id;
      $scope.transactionData.symbol = $scope.quote.symbol;
      positionsym = $scope.positions.filter(function (position) { return position.symbol == $scope.transactionData.symbol });
      if($scope.transactionData.num_shares <= 0 || !$scope.transactionData.num_shares) {
        alert('Number of shares needs to be greater than zero.')
      }
      else if($scope.transactionData.transaction_type == 'S' &&
                (positionsym[0].num_shares < $scope.transactionData.num_shares))   {
          alert('You can not sell more shares than you currently own')
      } 
      else if ($scope.transactionData.num_shares * $scope.transactionData.price > $scope.portfolio.balance) {
        alert('Your cash balance does not allow for this transaction')
      }
      else {
          $scope.loading = true;
          Transaction.save($scope.portfolio.id, $scope.transactionData)
            .success(function(data) {
              $scope.transactionData = {};
              // if successful, refresh positions and transactions
              Transaction.get($scope.portfolio.id)
                .success(function(getData) {
                  $scope.transactions = getData;
                  $scope.loading = false;
                });
               Position.get($scope.portfolio.id)
                .success(function(getData) {
                  $scope.positions = getData;
                  $scope.loading = false;
                });
                Portfolio.show($scope.portfolio.id)
                .success(function(data) {
                  $scope.portfolio = data;
                  $scope.loading = false;
                });


            })
            .error(function(data) {
              console.log(data);
            });
        }
    };


  });