export default function Home({ onExploreDealers, onLogin, user }) {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">AI-Powered Dealership Network</span>
          <h1 className="hero-title">Find Your Next Vehicle With Confidence</h1>
          <p className="hero-subtitle">
            Browse verified dealerships across North America, read authentic customer reviews,
            and leverage real-time AI sentiment analysis on every experience.
          </p>
          <div className="hero-actions">
            <button className="btn-hero-primary" onClick={onExploreDealers}>
              🏪 Browse Dealerships
            </button>
            {!user && (
              <button className="btn-hero-secondary" onClick={onLogin}>
                🔐 Sign In to Review
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">🌐</div>
          <h3>50-State Network</h3>
          <p>Access dealership directory data, phone lines, coordinates, and full addresses across all 50 states.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🤖</div>
          <h3>VADER Sentiment AI</h3>
          <p>Every review is processed through our Flask microservice to score polarity from positive to negative in real time.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Microservices Architecture</h3>
          <p>Cloud-native design built with Django, Express, MongoDB, Flask, and React for high availability and low latency.</p>
        </div>
      </section>
    </div>
  );
}
