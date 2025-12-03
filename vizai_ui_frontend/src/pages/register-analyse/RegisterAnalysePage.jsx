import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './RegisterAnalysePage.module.css';

// PUBLIC_INTERFACE
export default function RegisterAnalysePage() {
  /** Page component that replicates the /register-analyse preview exactly:
   *  - Header with logo and brand
   *  - Centered auth card with title, subtitle, form (email/password), login CTA
   *  - Secondary text with register link
   *  - "Need Help?" link toggling a modal dialog
   *  - Assistant widget fixed at bottom-right
   *  Notes: No backend calls; purely UI and accessibility as per design notes.
   */

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showHelp, setShowHelp] = useState(false);

  const emailRef = useRef(null);
  const errorRefs = useRef({});

  // Autofocus email on mount
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const API_BASE = useMemo(() => process.env.REACT_APP_API_BASE, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.email.trim()) nextErrors.email = 'Email/Username is required';
    if (!form.password.trim()) nextErrors.password = 'Password is required';
    return nextErrors;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    // Focus the first field with error
    const firstErrorKey = Object.keys(nextErrors)[0];
    if (firstErrorKey) {
      errorRefs.current[firstErrorKey]?.focus();
      return;
    }

    // Mock submit (no backend)
    // eslint-disable-next-line no-console
    console.log('Submitting to API (mock):', {
      API_BASE,
      payload: { ...form },
    });
    alert('Login submitted (mock). No backend calls implemented.');
  };

  const toggleHelp = () => setShowHelp((s) => !s);

  // Close modal with ESC
  useEffect(() => {
    if (!showHelp) return;
    const onKey = (ev) => {
      if (ev.key === 'Escape') setShowHelp(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showHelp]);

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.header} aria-label="Brand">
        <img
          src="/assets/vizai-logo-20251203.png"
          alt="VizAI Logo"
          className={styles.logo}
        />
        <div className={styles.brand}>VizAI</div>
      </header>

      <main className={styles.authContainer}>
        <section className={styles.authCard} role="form" aria-labelledby="auth-title">
          <h1 id="auth-title" className={styles.title}>
            Sign in to VizAI
          </h1>
          <p className={styles.subtitle}>
            Your role determines the dashboard view and available features.
          </p>

          <form className={styles.form} onSubmit={onSubmit} noValidate>
            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>
                Email/Username
              </label>
              <input
                ref={(el) => {
                  emailRef.current = el;
                  errorRefs.current.email = el;
                }}
                id="email"
                name="email"
                type="text"
                placeholder="Enter your email or username"
                value={form.email}
                onChange={onChange}
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              />
              {errors.email && (
                <div id="email-error" className={styles.errorText} role="alert">
                  {errors.email}
                </div>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <input
                ref={(el) => (errorRefs.current.password = el)}
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={onChange}
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby={errors.password ? 'password-error' : undefined}
                className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
              />
              {errors.password && (
                <div id="password-error" className={styles.errorText} role="alert">
                  {errors.password}
                </div>
              )}
            </div>

            <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
              Login
            </button>
          </form>

          <div className={styles.secondary}>
            New to VizAI?{' '}
            <a className={styles.link} href="/register">
              Create an account
            </a>
          </div>

          <div className={styles.help}>
            <button type="button" className={styles.helpLink} onClick={toggleHelp}>
              Need Help?
            </button>
          </div>
        </section>
      </main>

      <AssistantWidget initialMessage="Hi! I’m your VizAI helper. How can I assist you today?" />

      {showHelp && <HelpModal onClose={toggleHelp} />}
    </div>
  );
}

function HelpModal({ onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  const onOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onOverlayClick}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-title"
        tabIndex={-1}
        ref={modalRef}
      >
        <div className={styles.modalHeader}>
          <h2 id="help-title" className={styles.modalTitle}>
            VizAI Help • login
          </h2>
          <button
            className={styles.modalClose}
            aria-label="Close"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>
        <div className={styles.modalBody}>
          <button className={styles.modalItem} type="button">How do I sign in?</button>
          <button className={styles.modalItem} type="button">I forgot my password</button>
          <button className={styles.modalItem} type="button">Create an account</button>
        </div>
      </div>
    </div>
  );
}

function AssistantWidget({ initialMessage }) {
  return (
    <aside className={styles.assistant} role="complementary" aria-label="Assistant">
      <div className={styles.assistantContent}>
        <p className={styles.assistantText}>
          <strong>Assistant:</strong> {initialMessage}
        </p>
        <div className={styles.assistantActions}>
          <button className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`} type="button">
            Send
          </button>
        </div>
      </div>
    </aside>
  );
}
