import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="home">
      <header className="home-nav">
        <div className="home-nav__inner">
          <Link to="/" className="home-brand">
            <span className="brand__mark" aria-hidden="true" />
            <span>SubTrack</span>
          </Link>

          <nav className="home-nav__links" aria-label="Main navigation">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
          </nav>

          <div className="home-nav__actions">
            {user ? (
              <Link to="/dashboard" className="btn btn--primary">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="home-signin">
                  Sign in
                </Link>
                <Link to="/register" className="btn btn--primary">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="home-hero">
          <div className="home-hero__content">
            <span className="home-eyebrow">
              YOUR SUBSCRIPTIONS, ORGANIZED
            </span>

            <h1>
              Take control of your
              <span> subscriptions.</span>
            </h1>

            <p className="home-hero__description">
              Keep your recurring subscriptions organized,
              understand your regular expenses, and stay on
              top of what you pay for — all in one place.
            </p>

            <div className="home-hero__actions">
              <Link
                to={user ? "/dashboard" : "/register"}
                className="btn btn--primary home-cta"
              >
                {user ? "Go to Dashboard" : "Get Started"}
                <span aria-hidden="true"> →</span>
              </Link>

              {!user && (
                <Link to="/login" className="home-secondary">
                  Already have an account?
                </Link>
              )}
            </div>

            <div className="home-trust">
              <span className="home-trust__icon">✓</span>
              No bank login needed
              <span className="home-trust__dot">·</span>
              You control what you share
            </div>
          </div>

          <div className="home-preview">
            <div className="preview-card">
              <div className="preview-top">
                <div>
                  <span className="preview-label">
                    YOUR SUBTRACK SPACE
                  </span>
                  <h2>Subscription overview</h2>
                </div>
                <span className="preview-icon">↗</span>
              </div>

              <div className="preview-highlight">
                <span>Stay organized</span>
                <strong>One place. More clarity.</strong>
                <p>
                  Keep track of your subscriptions and
                  recurring expenses.
                </p>
              </div>

              <div className="preview-list">
                <div className="preview-row">
                  <span className="preview-app preview-app--teal">
                    S
                  </span>
                  <div className="preview-row__text">
                    <strong>Subscriptions</strong>
                    <span>Keep everything together</span>
                  </div>
                  <span className="preview-check">✓</span>
                </div>

                <div className="preview-row">
                  <span className="preview-app preview-app--amber">
                    ↻
                  </span>
                  <div className="preview-row__text">
                    <strong>Recurring expenses</strong>
                    <span>Understand regular costs</span>
                  </div>
                  <span className="preview-check">✓</span>
                </div>

                <div className="preview-row">
                  <span className="preview-app preview-app--navy">
                    ▤
                  </span>
                  <div className="preview-row__text">
                    <strong>Shared receipts</strong>
                    <span>Keep useful information handy</span>
                  </div>
                  <span className="preview-check">✓</span>
                </div>
              </div>

              <div className="preview-footer">
                <span className="preview-status" />
                Your subscriptions, your control
              </div>
            </div>

            <div className="home-decoration home-decoration--one" />
            <div className="home-decoration home-decoration--two" />
          </div>
        </section>

        <section className="home-features" id="features">
          <div className="home-section-heading">
            <span className="home-eyebrow">WHY SUBTRACK?</span>
            <h2>A clearer view of your subscriptions.</h2>
            <p>
              Spend less time keeping track and more time
              understanding your recurring expenses.
            </p>
          </div>

          <div className="feature-grid">
            <article className="feature-card">
              <span className="feature-icon feature-icon--teal">
                ↻
              </span>
              <h3>Track subscriptions</h3>
              <p>
                Keep your subscription information organized
                in one convenient place.
              </p>
            </article>

            <article className="feature-card">
              <span className="feature-icon feature-icon--amber">
                ◷
              </span>
              <h3>Understand recurring costs</h3>
              <p>
                Get a clearer picture of the expenses that
                come back regularly.
              </p>
            </article>

            <article className="feature-card">
              <span className="feature-icon feature-icon--navy">
                ▤
              </span>
              <h3>Keep useful records</h3>
              <p>
                Use the files and receipts you choose to
                share to help organize your information.
              </p>
            </article>
          </div>
        </section>

        <section className="home-how" id="how-it-works">
          <div className="home-section-heading">
            <span className="home-eyebrow">GET STARTED</span>
            <h2>Simple steps. Better visibility.</h2>
          </div>

          <div className="steps-grid">
            <article className="step-card">
              <span className="step-number">01</span>
              <h3>Create your account</h3>
              <p>
                Sign up for SubTrack to get started.
              </p>
            </article>

            <article className="step-card">
              <span className="step-number">02</span>
              <h3>Organize your information</h3>
              <p>
                Add or share subscription information using
                the features available in your account.
              </p>
            </article>

            <article className="step-card">
              <span className="step-number">03</span>
              <h3>View your dashboard</h3>
              <p>
                Review your subscription information in
                one place.
              </p>
            </article>
          </div>

          <div className="home-bottom-cta">
            <div>
              <h2>Ready to get organized?</h2>
              <p>
                Start bringing your subscriptions together
                with SubTrack.
              </p>
            </div>
            <Link
              to={user ? "/dashboard" : "/register"}
              className="btn btn--primary home-cta"
            >
              {user ? "Open Dashboard" : "Create Your Account"} →
            </Link>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <Link to="/" className="home-brand">
          <span className="brand__mark" aria-hidden="true" />
          <span>SubTrack</span>
        </Link>
        <p>
          SubTrack reads only the files and receipts you share.
          It never touches your bank account.
        </p>
        <span>© {new Date().getFullYear()} SubTrack</span>
      </footer>
    </div>
  );
}