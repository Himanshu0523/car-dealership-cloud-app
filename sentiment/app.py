"""Offline sentiment analyzer using VADER.

Endpoint:
    POST /analyze  {"text": "..."}  ->  {"sentiment": "...", "score": 0.42}
"""
from flask import Flask, jsonify, request
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

app = Flask(__name__)
_analyzer = SentimentIntensityAnalyzer()


@app.get("/health")
def health():
    return jsonify(status="ok")


@app.post("/analyze")
def analyze():
    data = request.get_json(silent=True) or {}
    text = (data.get("text") or "").strip()

    if not text:
        return jsonify(sentiment="neutral", score=0.0)

    score = _analyzer.polarity_scores(text)["compound"]

    if score >= 0.05:
        sentiment = "positive"
    elif score <= -0.05:
        sentiment = "negative"
    else:
        sentiment = "neutral"

    return jsonify(sentiment=sentiment, score=round(score, 4))


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050)
