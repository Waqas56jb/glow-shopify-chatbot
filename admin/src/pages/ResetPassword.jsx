import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./Login.module.css";
import rpStyles from "./ResetPassword.module.css";

export default function ResetPassword() {
  const { resetPassword } = useAuth();
  const [email,   setEmail]   = useState("");
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err } = await resetPassword(email);
    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      setSent(true);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logoWrap}>
          <div className={styles.logoMark}>G</div>
          <div>
            <p className={styles.logoName}>GlowUp Goods</p>
            <p className={styles.logoSub}>Admin Dashboard</p>
          </div>
        </div>

        {sent ? (
          <div className={rpStyles.successBox}>
            <div className={rpStyles.successIcon}>✓</div>
            <h2 className={rpStyles.successTitle}>Check your inbox</h2>
            <p className={rpStyles.successText}>
              We sent a password reset link to <strong>{email}</strong>.
              Check your spam folder if you don't see it.
            </p>
            <Link to="/login" className={styles.submitBtn} style={{ display: "flex", justifyContent: "center", marginTop: "16px" }}>
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <h1 className={styles.heading}>Reset password</h1>
            <p className={styles.sub}>
              Enter your admin email and we'll send a reset link.
            </p>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.field}>
                <label className={styles.label}>Email address</label>
                <input
                  className={styles.input}
                  type="email"
                  placeholder="admin@glowupgoods.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              {error && <p className={styles.errorMsg}>{error}</p>}

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? <span className={styles.spinner} /> : "Send Reset Link"}
              </button>
            </form>

            <Link to="/login" className={styles.forgotLink}>
              ← Back to Sign In
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
