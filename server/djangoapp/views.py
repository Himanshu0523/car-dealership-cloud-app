import json

from django.contrib.auth import authenticate
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.shortcuts import redirect, render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from . import restapis

STATES = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
    "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
    "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine",
    "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
    "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
    "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
    "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
    "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia",
    "Washington", "West Virginia", "Wisconsin", "Wyoming",
]


# --------------------------------------------------------------------------
# Static pages
# --------------------------------------------------------------------------
def index(request):
    return render(request, "index.html")


def about(request):
    return render(request, "About.html")


def contact(request):
    return render(request, "Contact.html")


# --------------------------------------------------------------------------
# Helpers
# --------------------------------------------------------------------------
def _wants_json(request) -> bool:
    return (
        request.content_type == "application/json"
        or "application/json" in request.headers.get("Accept", "")
        or request.headers.get("X-Requested-With") == "XMLHttpRequest"
    )


def _payload(request) -> dict:
    if request.content_type == "application/json":
        try:
            return json.loads(request.body or "{}")
        except json.JSONDecodeError:
            return {}
    return request.POST.dict()


# --------------------------------------------------------------------------
# Auth
# --------------------------------------------------------------------------
@csrf_exempt
@require_http_methods(["GET", "POST"])
def login_view(request):
    if request.method == "GET":
        return render(request, "Login.html")

    data = _payload(request)
    user = authenticate(
        request, username=data.get("username"), password=data.get("password")
    )

    if user is not None:
        auth_login(request, user)
        if _wants_json(request):
            return JsonResponse(
                {
                    "status": "Authenticated",
                    "userName": user.username,
                    "firstName": user.first_name,
                    "lastName": user.last_name,
                }
            )
        return redirect("djangoapp:index")

    if _wants_json(request):
        return JsonResponse(
            {"status": "Failed", "message": "Invalid username or password"}, status=401
        )
    return render(request, "Login.html", {"error": "Invalid username or password"})


@csrf_exempt
@require_http_methods(["GET", "POST"])
def register(request):
    if request.method == "GET":
        return render(request, "Register.html")

    data = _payload(request)
    username = data.get("username", "").strip()
    password = data.get("password", "")
    first_name = data.get("firstName", "")
    last_name = data.get("lastName", "")
    email = data.get("email", "")

    if not username or not password:
        return JsonResponse(
            {"status": "Failed", "message": "Username and password are required"},
            status=400,
        )

    if User.objects.filter(username=username).exists():
        return JsonResponse(
            {"status": "Failed", "message": "Username already exists"}, status=409
        )

    user = User.objects.create_user(
        username=username,
        password=password,
        first_name=first_name,
        last_name=last_name,
        email=email,
    )
    auth_login(request, user)

    if _wants_json(request):
        return JsonResponse(
            {
                "status": "Authenticated",
                "userName": user.username,
                "firstName": user.first_name,
                "lastName": user.last_name,
            }
        )
    return redirect("djangoapp:index")


def logout_view(request):
    auth_logout(request)
    if _wants_json(request):
        return JsonResponse({"status": "Logged out"})
    return redirect("djangoapp:index")


# --------------------------------------------------------------------------
# Dealers
# --------------------------------------------------------------------------
def dealers(request):
    state = request.GET.get("state", "").strip()
    error = None
    data = []
    try:
        data = restapis.get_dealers_by_state(state) if state else restapis.get_dealers()
    except Exception as exc:  # noqa: BLE001
        error = f"Could not reach dealership service: {exc}"

    return render(
        request,
        "Dealers.html",
        {"dealers": data, "states": STATES, "selected_state": state, "error": error},
    )


def dealer_details(request, dealer_id):
    error = None
    dealer, reviews = None, []
    try:
        dealer = restapis.get_dealer_details(dealer_id)
        reviews = restapis.get_dealer_reviews(dealer_id)
    except Exception as exc:  # noqa: BLE001
        error = f"Could not load dealer: {exc}"

    # newest first
    reviews = sorted(reviews, key=lambda r: r.get("purchase_date", ""), reverse=True)

    return render(
        request,
        "dealer_details.html",
        {"dealer": dealer, "reviews": reviews, "error": error},
    )


@csrf_exempt
@require_http_methods(["POST"])
def post_review(request, dealer_id):
    if not request.user.is_authenticated:
        return JsonResponse({"status": "Failed", "message": "Login required"}, status=403)

    data = _payload(request)
    review_text = data.get("review", "").strip()
    if not review_text:
        return JsonResponse({"status": "Failed", "message": "Review text required"}, status=400)

    sentiment = restapis.analyze_review_sentiment(review_text)

    payload = {
        "name": request.user.get_full_name() or request.user.username,
        "dealership": int(dealer_id),
        "review": review_text,
        "purchase": str(data.get("purchase", "false")).lower() == "true",
        "purchase_date": data.get("purchase_date", ""),
        "car_make": data.get("car_make", ""),
        "car_model": data.get("car_model", ""),
        "car_year": int(data.get("car_year") or 0),
        "sentiment": sentiment,
    }

    try:
        restapis.add_review(payload)
    except Exception as exc:  # noqa: BLE001
        return JsonResponse({"status": "Failed", "message": str(exc)}, status=502)

    return JsonResponse({"status": "Success", "sentiment": sentiment})
