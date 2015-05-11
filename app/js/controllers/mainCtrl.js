angular.module('mainCtrl', [])

  .controller('mainController', function($scope, $http, Transaction, Portfolio, Quote, Position) {
    $scope.transactionData = {};
    $scope.positionData = {};
    $scope.portfolios = {};
    
    $scope.loading = true;

    Quote.get('F')
     .success(function(data) {
        $scope.quote = data['F'];
        $scope.loading = false;
      });

     

    getAllPortfolios ($scope, Portfolio);
    getPortfolio ($scope, 1, Portfolio);
    getTransactions ($scope, 1, Transaction);
    getPositions ($scope, 1, Position);

    
    $scope.getQuote = function() {
      Quote.get(angular.uppercase($scope.quoteRequest.symbol))
        .success(function(data) {
            if(data[angular.uppercase($scope.quoteRequest.symbol)]['symbol']) {
                $scope.quote = data[angular.uppercase($scope.quoteRequest.symbol)];
                $scope.quoteRequest = {};
            }
            else {
              alert ('Symbol not found')
            }
            $scope.transactionData = {};
          })
      }

    $scope.loadPortfolio = function(id) {
  
      Portfolio.show(id)
      .success(function(data) {
              $scope.portfolio = data;
              getTransactions ($scope, $scope.portfolio.id, Transaction);
              getPositions ($scope, $scope.portfolio.id, Position);
              $scope.transactionData = {};
            })   
      }

    $scope.createPortfolio = function() {
      $scope.loading = true;
      Portfolio.save($scope.portfolioData)
        .success(function(data) {
              $scope.portfolioData = {};
              $scope.portfolio = data;
              getTransactions ($scope, $scope.portfolio.id, Transaction);
              getPositions ($scope, $scope.portfolio.id, Position);
              getPortfolio($scope, $scope.portfolio.id, Portfolio);
              getAllPortfolios($scope, Portfolio);
                    $scope.transactionData = {};
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
      else if(positionsym[0] && $scope.transactionData.transaction_type == 'S' &&
                (positionsym[0].num_shares < $scope.transactionData.num_shares))   {
          alert('You can not sell more shares than you currently own')
      } 
      else if(!positionsym[0] && $scope.transactionData.transaction_type == 'S') {
          alert('This portfolio does not allow for short sales')
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
              getTransactions ($scope, $scope.portfolio.id, Transaction);
              getPositions ($scope, $scope.portfolio.id, Position);
            })
            .error(function(data) {
              console.log(data);
            });
        }
        $scope.transactionData = {};
    };


  });



 function getPositions($scope, portfolioId, Position) {
    Position.get(portfolioId)
          .success(function(getData) {
            $scope.positions = getData;
            $scope.loading = false;
    });
 }

 function getTransactions($scope, portfolioId, Transaction) {
    Transaction.get(portfolioId)
          .success(function(getData) {
            $scope.transactions = getData;
            $scope.loading = false;
    });
 }

 function getPortfolio($scope, portfolioId, Portfolio) {
    Portfolio.show(portfolioId)
          .success(function(data) {
            $scope.portfolio = data;
            $scope.loading = false;
    });
 }

 function getAllPortfolios($scope, Portfolio) {
      Portfolio.get()
           .success(function(data) {
              $scope.portfolios = data;
              $scope.loading = false;
      });
}