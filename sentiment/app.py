"""Offline sentiment analyzer using VADER.

Endpoints:
    POST /analyze  {"text": "..."}  ->  {"sentiment": "positive", "score": 0.5574}
    GET  /analyze/<text>            ->  {"sentiment": "positive", "score": 0.5574}
"""
from flask import Flask, jsonify, request
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

app = Flask(__name__)
_analyzer = SentimentIntensityAnalyzer()


@app.get("/health")
def health():
    return jsonify(status="ok")


def _get_sentiment(text: str):
    if not text:
        return {"sentiment": "neutral", "score": 0.0}
    score = _analyzer.polarity_scores(text)["compound"]
    if score >= 0.05:
        sentiment = "positive"
    elif score <= -0.05:
        sentiment = "negative"
    else:
        sentiment = "neutral"
    return {"sentiment": sentiment, "score": round(score, 4)}


@app.post("/analyze")
def analyze_post():
    data = request.get_json(silent=True) or {}
    text = (data.get("text") or "").strip()
    res = _get_sentiment(text)
    return jsonify(res)


@app.get("/analyze/<path:text>")
def analyze_get(text: str):
    res = _get_sentiment(text.strip())
    return jsonify(res)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050)
