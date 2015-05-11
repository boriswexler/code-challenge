from django.db import models

class Portfolio(models.Model):
    name = models.CharField(max_length=200)
    balance = models.FloatField(default=100000)
    updated_at = models.DateTimeField(auto_now = True)
    created_at = models.DateTimeField(auto_now_add=True)


class Position(models.Model):
    portfolio = models.ForeignKey(Portfolio, related_name='positions')
    symbol = models.CharField(max_length=10)
    average_cost = models.FloatField(default=0)
    num_shares = models.IntegerField(default=0)


class Transaction(models.Model):
    portfolio = models.ForeignKey(Portfolio, related_name='transactions')
    symbol = models.CharField(max_length=10)
    transaction_type = models.CharField(default = 'B',max_length=1)
    price = models.FloatField(default=0)
    num_shares = models.IntegerField(default=0)
    dates = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ['-dates']
    
    def save(self, *args, **kwargs):
	    balance = self.portfolio.balance
	    if self.transaction_type == 'B':
	    	cost = (self.price * self.num_shares)

	    elif self.transaction_type == 'S':
	    	cost = - (self.price * self.num_shares)

	    setattr(self.portfolio, 'balance', balance - cost)	    
	    self.portfolio.save()

	    positions = self.portfolio.positions.filter(symbol=self.symbol)
	    if not positions:
	    	position = Position(portfolio = self.portfolio, symbol = self.symbol, average_cost = self.price, num_shares = self.num_shares)
	    	position.save()
	    elif self.transaction_type == 'B':
	    	positions[0].average_cost = (positions[0].num_shares*positions[0].average_cost + self.num_shares*self.price) / (self.num_shares + positions[0].num_shares)
	    	positions[0].num_shares = positions[0].num_shares + self.num_shares
	    	positions[0].save()
	    elif self.transaction_type == 'S':
	    	positions[0].num_shares = positions[0].num_shares - self.num_shares
	    	if positions[0].num_shares <= 0:
	    		positions[0].delete()
	    	else:
	     		positions[0].save()

	    super(Transaction, self).save(*args, **kwargs)