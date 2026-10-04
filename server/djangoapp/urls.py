from django.urls import path

from . import views

app_name = "djangoapp"

urlpatterns = [
    path("", views.index, name="index"),
    path("about/", views.about, name="about"),
    path("contact/", views.contact, name="contact"),
    path("login/", views.login_view, name="login"),
    path("logout/", views.logout_view, name="logout"),
    path("register/", views.register, name="register"),
    path("dealers/", views.dealers, name="dealers"),
    path("dealers/<int:dealer_id>/", views.dealer_details, name="dealer_details"),
    path("dealers/<int:dealer_id>/review/", views.post_review, name="post_review"),
]
