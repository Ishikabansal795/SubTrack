// Shared two-panel frame for the login and register pages.
export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="auth">
      <aside className="auth__aside">
        <div className="brand brand--light">
          <span className="brand__mark brand__mark--light" aria-hidden="true" />
          SubTrack
        </div>
        <div>
          <h2 className="auth__pitch">Know what renews before it charges.</h2>
          <ul className="auth__points">
            <li>Finds hidden subscriptions in your bank statement CSV</li>
            <li>Warns you before a free trial turns into a payment</li>
            <li>Never asks for your bank login or Gmail password</li>
          </ul>
        </div>
        <div className="trial-chip" role="img" aria-label="Example: Streaming trial ends in 3 days">
          <span className="trial-chip__dot" />
          <span>Streaming trial</span>
          <strong>3 days left</strong>
        </div>
      </aside>

      <section className="auth__panel">
        <div className="auth__card">
          <h1 className="auth__title">{title}</h1>
          <p className="auth__subtitle">{subtitle}</p>
          {children}
          <p className="auth__footer">{footer}</p>
        </div>
      </section>
    </div>
  );
}
