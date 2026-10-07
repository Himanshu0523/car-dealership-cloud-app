from django.urls import path
from . import views

app_name = "djangoapp"

urlpatterns = [
    # Static pages
    path("", views.index, name="index"),
    path("about/", views.about, name="about"),
    path("contact/", views.contact, name="contact"),

    # Auth
    path("login", views.login_view, name="login_no_slash"),
    path("login/", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout_no_slash"),
    path("logout/", views.logout_view, name="logout"),
    path("register", views.register, name="register_no_slash"),
    path("register/", views.register, name="register"),

    # Dealers & Reviews HTML views
    path("dealers/", views.dealers, name="dealers"),
    path("dealers/<int:dealer_id>/", views.dealer_details, name="dealer_details"),
    path("dealers/<int:dealer_id>/review/", views.post_review, name="post_review"),

    # Capstone API endpoints
    path("get_cars", views.get_cars, name="get_cars_no_slash"),
    path("get_cars/", views.get_cars, name="get_cars"),
    path("get_dealers", views.get_dealers_api, name="get_dealers_api"),
    path("get_dealers/", views.get_dealers_api, name="get_dealers_api_slash"),
    path("get_dealers/<str:state>", views.get_dealers_api, name="get_dealers_by_state_api"),
    path("get_dealers/<str:state>/", views.get_dealers_api, name="get_dealers_by_state_api_slash"),
    path("dealer/<int:dealer_id>", views.get_dealer_by_id_api, name="get_dealer_by_id_api"),
    path("dealer/<int:dealer_id>/", views.get_dealer_by_id_api, name="get_dealer_by_id_api_slash"),
    path("reviews/dealer/<int:dealer_id>", views.get_dealer_reviews_api, name="get_dealer_reviews_api"),
    path("reviews/dealer/<int:dealer_id>/", views.get_dealer_reviews_api, name="get_dealer_reviews_api_slash"),
    path("analyze/<path:text>", views.analyze_review_api, name="analyze_review_api"),
]
