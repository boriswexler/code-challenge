"""benzinga URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin
from rest_framework import routers
from portfolio import views
from rest_framework_extensions.routers import ExtendedSimpleRouter

#router = routers.DefaultRouter()
#router.register(r'users', views.UserViewSet)
#router.register(r'groups', views.GroupViewSet)
#router.register(r'portfolios', views.PortfolioViewSet)
#router.register(r'positions', views.PositionViewSet)
#router.register(r'transactions', views.TransactionViewSet)

router = ExtendedSimpleRouter()
(
    router.register(r'portfolios', views.PortfolioViewSet)
          .register(r'positions', views.PositionViewSet, base_name='positions-portfolios', parents_query_lookups=['portfolio_id'])
#.register(r'transactions', views.PositionViewSet, base_name='transactions-portfolios', parents_query_lookups=['portfolio_id'])
    
)
router2 = ExtendedSimpleRouter()
(
    router.register(r'portfolios', views.PortfolioViewSet)
       #   .register(r'positions', views.PositionViewSet, base_name='positions-portfolios', parents_query_lookups=['portfolio_id'])
          .register(r'transactions', views.TransactionViewSet, base_name='transactions-portfolios', parents_query_lookups=['portfolio_id'])
    
)
#router.register(r'users', views.UserViewSet)
#router.register(r'groups', views.GroupViewSet)
urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^', include(router.urls)),
    url(r'^', include(router2.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
   	url(r'^quotes/(?P<symbol>.+)/', views.getQuote),
]
