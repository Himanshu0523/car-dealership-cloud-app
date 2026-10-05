import { useState, useEffect } from 'react';
import { fetchDealers, fetchDealer, fetchReviews, submitReview } from '../api.js';

const STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine",
  "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia",
  "Washington", "West Virginia", "Wisconsin", "Wyoming",
];

export default function Dealerships({ user, onRequireLogin }) {
  const [dealers, setDealers] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeDealer, setActiveDealer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  
  // Review form state
  const [reviewForm, setReviewForm] = useState({
    review: '',
    purchase: true,
    purchase_date: new Date().toISOString().slice(0, 10),
    car_make: '',
    car_model: '',
    car_year: 2024,
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    loadDealers(selectedState);
  }, [selectedState]);

  async function loadDealers(state) {
    setLoading(true);
    const data = await fetchDealers(state);
    setDealers(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  async function handleSelectDealer(dealer) {
    setActiveDealer(dealer);
    setReviewsLoading(true);
    setReviewMsg({ text: '', type: '' });
    const revs = await fetchReviews(dealer.id);
    setReviews(Array.isArray(revs) ? revs : []);
    setReviewsLoading(false);
  }

  async function handleReviewSubmit(e) {
    e.preventDefault();
    if (!user) {
      onRequireLogin();
      return;
    }

    setSubmittingReview(true);
    setReviewMsg({ text: 'Submitting review to AI sentiment engine…', type: 'info' });

    try {
      const resp = await submitReview(activeDealer.id, {
        ...reviewForm,
        purchase: reviewForm.purchase === true || reviewForm.purchase === 'true',
        car_year: Number(reviewForm.car_year) || 0,
      });

      if (resp.status === 'Success') {
        setReviewMsg({ text: `Review saved! Sentiment detected: ${resp.sentiment}`, type: 'success' });
        // Refresh reviews list
        const updatedReviews = await fetchReviews(activeDealer.id);
        setReviews(updatedReviews);
        setReviewForm({
          review: '',
          purchase: true,
          purchase_date: new Date().toISOString().slice(0, 10),
          car_make: '',
          car_model: '',
          car_year: 2024,
        });
      } else {
        setReviewMsg({ text: resp.message || 'Failed to submit review', type: 'error' });
      }
    } catch (err) {
      setReviewMsg({ text: err.message || 'Error communicating with server', type: 'error' });
    } finally {
      setSubmittingReview(false);
    }
  }

  return (
    <div className="dealers-page">
      <div className="section-header">
        <div>
          <h2>Dealership Directory</h2>
          <p className="subtitle">Explore verified dealerships and customer experiences across North America</p>
        </div>

        <div className="filter-box">
          <label htmlFor="state-filter" className="filter-label">Filter by State:</label>
          <select
            id="state-filter"
            className="select-input"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            <option value="">All States ({dealers.length})</option>
            {STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {selectedState && (
            <button className="btn-reset" onClick={() => setSelectedState('')}>
              Reset
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading dealerships...</p>
        </div>
      ) : dealers.length === 0 ? (
        <div className="empty-state">
          <p>No dealerships found in {selectedState || 'the network'}.</p>
          <button className="btn-primary-sm" onClick={() => setSelectedState('')}>View All Dealerships</button>
        </div>
      ) : (
        <div className="dealers-grid">
          {dealers.map((d) => (
            <div
              key={d.id}
              className={`dealer-card ${activeDealer?.id === d.id ? 'active' : ''}`}
              onClick={() => handleSelectDealer(d)}
            >
              <div className="dealer-card-header">
                <span className="dealer-badge">#{d.id}</span>
                <span className="dealer-state">{d.state} ({d.st})</span>
              </div>
              <h3 className="dealer-name">{d.full_name || d.short_name}</h3>
              <p className="dealer-address">📍 {d.address}, {d.city}, {d.zip}</p>
              <p className="dealer-phone">📞 {d.phone || '+1 (555) 019-2831'}</p>
              <div className="dealer-card-footer">
                <button className="btn-details">
                  {activeDealer?.id === d.id ? 'Viewing Details ▼' : 'View Reviews & Details →'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dealer Details & Reviews Modal / Drawer */}
      {activeDealer && (
        <div className="dealer-details-panel">
          <div className="panel-header">
            <div>
              <h3>{activeDealer.full_name}</h3>
              <p className="text-muted">
                📍 {activeDealer.address}, {activeDealer.city}, {activeDealer.state} {activeDealer.zip} | 📞 {activeDealer.phone}
              </p>
            </div>
            <button className="btn-close" onClick={() => setActiveDealer(null)}>✕</button>
          </div>

          <div className="panel-content">
            <div className="reviews-section">
              <h4>Customer Reviews ({reviews.length})</h4>
              
              {reviewsLoading ? (
                <p className="text-muted">Loading reviews...</p>
              ) : reviews.length === 0 ? (
                <div className="no-reviews">
                  <p>No reviews posted yet for this location. Be the first to share your experience!</p>
                </div>
              ) : (
                <div className="reviews-list">
                  {reviews.map((r, i) => (
                    <div
                      key={r._id || i}
                      className={`review-item ${
                        r.sentiment === 'positive'
                          ? 'positive'
                          : r.sentiment === 'negative'
                          ? 'negative'
                          : 'neutral'
                      }`}
                    >
                      <div className="review-top">
                        <strong className="reviewer-name">{r.name || 'Anonymous'}</strong>
                        <span className="review-date">{r.purchase_date || 'Recent'}</span>
                      </div>
                      <p className="review-text">{r.review}</p>
                      <div className="review-footer">
                        <span className="car-tag">
                          {r.purchase ? '✅ Verified Purchase: ' : '🚗 Inquired: '}
                          {r.car_make} {r.car_model} {r.car_year > 0 ? `(${r.car_year})` : ''}
                        </span>
                        <span className={`sentiment-badge ${r.sentiment || 'neutral'}`}>
                          {r.sentiment === 'positive' && '😊 Positive'}
                          {r.sentiment === 'negative' && '😞 Negative'}
                          {r.sentiment === 'neutral' && '😐 Neutral'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Write Review Form */}
            <div className="write-review-box">
              <h4>Write a Review</h4>
              {user ? (
                <form onSubmit={handleReviewSubmit} className="review-form">
                  {reviewMsg.text && (
                    <div className={`alert-banner ${reviewMsg.type}`}>
                      {reviewMsg.text}
                    </div>
                  )}

                  <div className="form-group">
                    <label htmlFor="rev-text">Your Experience</label>
                    <textarea
                      id="rev-text"
                      rows="3"
                      maxLength="2000"
                      placeholder="Share your experience with this dealership..."
                      value={reviewForm.review}
                      onChange={(e) => setReviewForm({ ...reviewForm, review: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="rev-purchase">Vehicle Purchased?</label>
                      <select
                        id="rev-purchase"
                        value={reviewForm.purchase}
                        onChange={(e) => setReviewForm({ ...reviewForm, purchase: e.target.value === 'true' })}
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="rev-date">Purchase Date</label>
                      <input
                        id="rev-date"
                        type="date"
                        value={reviewForm.purchase_date}
                        onChange={(e) => setReviewForm({ ...reviewForm, purchase_date: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-row three-col">
                    <div className="form-group">
                      <label htmlFor="rev-make">Car Make</label>
                      <input
                        id="rev-make"
                        placeholder="e.g. Toyota"
                        value={reviewForm.car_make}
                        onChange={(e) => setReviewForm({ ...reviewForm, car_make: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="rev-model">Model</label>
                      <input
                        id="rev-model"
                        placeholder="e.g. Camry"
                        value={reviewForm.car_model}
                        onChange={(e) => setReviewForm({ ...reviewForm, car_model: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="rev-year">Year</label>
                      <input
                        id="rev-year"
                        type="number"
                        min="1980"
                        max="2026"
                        value={reviewForm.car_year}
                        onChange={(e) => setReviewForm({ ...reviewForm, car_year: e.target.value })}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-submit-review"
                    disabled={submittingReview || !reviewForm.review.trim()}
                  >
                    {submittingReview ? 'Analyzing & Saving…' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <div className="login-prompt">
                  <p>You must be signed in to submit a dealer review.</p>
                  <button className="btn-auth-primary" onClick={onRequireLogin}>
                    Sign In to Post Review
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
