export default function About() {
  return (
    <div className="about-page">
      <div className="content-card">
        <h2>About Best Cars Portal</h2>
        <p className="lead-text">
          Best Cars Dealership has been connecting drivers with their perfect vehicle since 1995.
          This portal demonstrates a full-stack cloud-native microservices architecture.
        </p>

        <div className="arch-diagram-box">
          <h3>System Architecture</h3>
          <div className="arch-visual">
            <div className="arch-node frontend-node">
              <strong>React + Vite SPA</strong>
              <small>Port 5173 / Client UI</small>
            </div>
            <div className="arch-arrow">⇅</div>
            <div className="arch-node django-node">
              <strong>Django Core & Proxy</strong>
              <small>Port 8000 / Auth & SQLite</small>
            </div>
            <div className="arch-split">
              <div className="arch-branch">
                <div className="arch-arrow">➔</div>
                <div className="arch-node node-node">
                  <strong>Express API</strong>
                  <small>Port 3030</small>
                </div>
                <div className="arch-arrow">➔</div>
                <div className="arch-node mongo-node">
                  <strong>MongoDB</strong>
                  <small>Port 27017</small>
                </div>
              </div>
              <div className="arch-branch">
                <div className="arch-arrow">➔</div>
                <div className="arch-node flask-node">
                  <strong>Flask Sentiment AI</strong>
                  <small>Port 5050 / VADER</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="tech-stack-section">
          <h3>Technology Stack Highlights</h3>
          <ul className="tech-list">
            <li><strong>Frontend:</strong> React 18, Vite, Modern Responsive Vanilla CSS</li>
            <li><strong>Core Server:</strong> Django 5, WhiteNoise static files, Django Session & CSRF Auth</li>
            <li><strong>Database Service:</strong> Node.js, Express, Mongoose ODM, MongoDB 7</li>
            <li><strong>Sentiment Engine:</strong> Python Flask, VADER Sentiment Analysis</li>
            <li><strong>DevOps & Deployment:</strong> Docker Compose, Kubernetes manifests, GitHub Actions CI/CD</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
