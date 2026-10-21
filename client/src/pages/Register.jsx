import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell.jsx";
import FormField from "../components/FormField.jsx";
import { registerUser, loginUser, readableError } from "../api/auth.js";
import { useAuth } from "../context/AuthContext.jsx";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = "Enter your name (at least 2 characters).";
    if (!EMAIL_RE.test(form.email.trim())) e.email = "Enter a valid email address, like name@example.com.";
    if (form.password.length < 8) e.password = "Use at least 8 characters for your password.";
    if (form.confirm !== form.password) e.confirm = "Passwords don't match. Retype the same password.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setFormError(null);
    if (!validate()) return;
    setLoading(true);

    const payload = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // used for trial day counts (FR-6.3)
    };

    try {
      const res = await registerUser(payload);
      // UC-01: signed in right after sign-up. Use token if the API returns one, else log in.
      let { token, user } = res.data || {};
      if (!token) {
        const login = await loginUser({ email: payload.email, password: payload.password });
        token = login.data.token;
        user = login.data.user;
      }
      signIn(token, user || { name: payload.name, email: payload.email });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (err.response?.status === 409 || /already/i.test(err.response?.data?.message || "")) {
        // FR-1.1: already-registered email is rejected with an explanation.
        setFormError({ already: true });
      } else {
        setFormError({ text: readableError(err, "Could not create your account. Check the details and try again.") });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Takes under a minute. No bank login needed."
      footer={<>Already have an account? <Link to="/login">Sign in</Link></>}
    >
      {formError && (
        <div className="alert" role="alert">
          <strong>Couldn't create the account.</strong>{" "}
          {formError.already
            ? <>This email is already registered. <Link to="/login">Sign in instead</Link> or use a different email.</>
            : formError.text}
        </div>
      )}

      <form onSubmit={onSubmit} noValidate>
        <FormField id="name" name="name" label="Name" autoComplete="name"
          value={form.name} onChange={onChange} error={errors.name} />
        <FormField id="email" name="email" type="email" label="Email" autoComplete="email"
          value={form.email} onChange={onChange} error={errors.email} />
        <FormField id="password" name="password" type="password" label="Password" autoComplete="new-password"
          hint="At least 8 characters." value={form.password} onChange={onChange} error={errors.password} />
        <FormField id="confirm" name="confirm" type="password" label="Confirm password" autoComplete="new-password"
          value={form.confirm} onChange={onChange} error={errors.confirm} />
        <button className="btn btn--primary btn--block" type="submit" disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}
