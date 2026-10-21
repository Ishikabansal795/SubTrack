import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell.jsx";
import FormField from "../components/FormField.jsx";
import { loginUser, readableError } from "../api/auth.js";
import { useAuth } from "../context/AuthContext.jsx";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const expired = new URLSearchParams(location.search).get("expired");
  const redirectTo = location.state?.from?.pathname || "/dashboard";

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // Presentation-level validation only (SDS Component 1); server still re-checks.
  const validate = () => {
    const e = {};
    if (!EMAIL_RE.test(form.email.trim())) e.email = "Enter a valid email address, like name@example.com.";
    if (!form.password) e.password = "Enter your password.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setFormError("");
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await loginUser({ email: form.email.trim().toLowerCase(), password: form.password });
      signIn(data.token, data.user);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      // FR-1.3: never reveal whether the email exists.
      const status = err.response?.status;
      setFormError(
        status === 400 || status === 401
          ? "Email or password is incorrect. Check both and try again."
          : readableError(err, "Sign in failed. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Sign in"
      subtitle="See what you're paying for and what renews next."
      footer={<>New to SubTrack? <Link to="/register">Create an account</Link></>}
    >
      {expired && (
        <div className="notice" role="status">Your session ended. Sign in again to continue.</div>
      )}
      {formError && <div className="alert" role="alert"><strong>Couldn't sign in.</strong> {formError}</div>}

      <form onSubmit={onSubmit} noValidate>
        <FormField id="email" name="email" type="email" label="Email" autoComplete="email"
          value={form.email} onChange={onChange} error={errors.email} />
        <FormField id="password" name="password" type="password" label="Password" autoComplete="current-password"
          value={form.password} onChange={onChange} error={errors.password} />
        <button className="btn btn--primary btn--block" type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthShell>
  );
}
