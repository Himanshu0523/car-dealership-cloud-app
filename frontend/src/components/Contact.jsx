import { useState } from 'react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
  }

  return (
    <div className="contact-page">
      <div className="content-card">
        <h2>Contact Our Team</h2>
        <p className="lead-text">
          Have questions regarding our dealership network or need assistance with your reviews? We are here to help.
        </p>

        <div className="contact-layout">
          <div className="contact-info">
            <div className="info-item">
              <span className="info-icon">📍</span>
              <div>
                <strong>Headquarters</strong>
                <p>123 Main Street, Austin, TX 78701</p>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon">📞</span>
              <div>
                <strong>Customer Support</strong>
                <p>+1 (512) 555-0100</p>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon">✉️</span>
              <div>
                <strong>Email Inquiries</strong>
                <p>support@bestcars.example</p>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon">🕘</span>
              <div>
                <strong>Operating Hours</strong>
                <p>Monday – Saturday: 9:00 AM – 7:00 PM CST</p>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            {submitted ? (
              <div className="success-box">
                <span className="success-icon">✅</span>
                <h3>Message Sent Successfully!</h3>
                <p>Thank you for reaching out. Our support team will get back to you within 24 hours.</p>
                <button className="btn-primary-sm" onClick={() => setSubmitted(false)}>Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="c-name">Your Name</label>
                  <input
                    id="c-name"
                    required
                    placeholder="Enter full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="c-email">Email Address</label>
                  <input
                    id="c-email"
                    type="email"
                    required
                    placeholder="Enter email address"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="c-msg">Message</label>
                  <textarea
                    id="c-msg"
                    rows="4"
                    required
                    placeholder="How can we assist you?"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  ></textarea>
                </div>

                <button type="submit" className="btn-primary">Send Message</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
