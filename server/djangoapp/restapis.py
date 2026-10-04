"""Thin proxy layer: Django -> Node/Express -> MongoDB, and Django -> Sentiment."""
import logging

import requests
from django.conf import settings

logger = logging.getLogger(__name__)

TIMEOUT = 10


def _get(path):
    url = f"{settings.BACKEND_URL}{path}"
    resp = requests.get(url, timeout=TIMEOUT)
    resp.raise_for_status()
    return resp.json()


def get_dealers():
    return _get("/fetchDealers")


def get_dealers_by_state(state):
    return _get(f"/fetchDealers/{state}")


def get_dealer_details(dealer_id):
    return _get(f"/fetchDealer/{dealer_id}")


def get_dealer_reviews(dealer_id):
    return _get(f"/fetchReviews/dealer/{dealer_id}")


def analyze_review_sentiment(text):
    """Call the sentiment microservice. Degrade gracefully to 'neutral'."""
    try:
        resp = requests.post(
            f"{settings.SENTIMENT_URL}/analyze",
            json={"text": text},
            timeout=TIMEOUT,
        )
        resp.raise_for_status()
        return resp.json().get("sentiment", "neutral")
    except Exception as exc:  # noqa: BLE001
        logger.warning("Sentiment service unavailable: %s", exc)
        return "neutral"


def add_review(review: dict):
    resp = requests.post(
        f"{settings.BACKEND_URL}/insertReview", json=review, timeout=TIMEOUT
    )
    resp.raise_for_status()
    return resp.json()
