"use client";

import { useEffect, useState } from "react";
import { api } from "../lib/api";

const money = (amount, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    amount,
  );
const date = (value) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));

export default function Home() {
  const [session, setSession] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [activeAccount, setActiveAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [mode, setMode] = useState("login");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("bank_token");
    const storedUser = localStorage.getItem("bank_user");
    if (token && storedUser) {
      setSession(JSON.parse(storedUser));
      loadAccounts();
    }
  }, []);

  async function loadAccounts() {
    try {
      const list = await api.getAccounts();
      setAccounts(list);
      if (list.length) selectAccount(list[0]);
    } catch (error) {
      logout();
    }
  }

  async function selectAccount(account) {
    setActiveAccount(account);
    try {
      setTransactions(await api.getTransactions(account.id));
    } catch (error) {
      setNotice(error.message);
    }
  }

  async function submitAuth(event) {
    event.preventDefault();
    setLoading(true);
    setNotice("");
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const result =
        mode === "login" ? await api.login(fields) : await api.register(fields);
      localStorage.setItem("bank_token", result.accessToken);
      localStorage.setItem("bank_user", JSON.stringify(result.user));
      setSession(result.user);
      if (result.account) {
        setAccounts([result.account]);
        selectAccount(result.account);
      } else await loadAccounts();
    } catch (error) {
      setNotice(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function submitTransfer(event) {
    event.preventDefault();

    if (!activeAccount) return;

    const form = event.currentTarget;

    setLoading(true);
    setNotice("");

    const fields = Object.fromEntries(new FormData(form));

    try {
      await api.transfer({
        ...fields,
        fromAccountId: activeAccount.id,
        amount: Number(fields.amount),
      });

      form.reset();

      setNotice("Transfer completed successfully.");
      await loadAccounts();
    } catch (error) {
      setNotice(error.message);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("bank_token");
    localStorage.removeItem("bank_user");
    setSession(null);
    setAccounts([]);
    setTransactions([]);
  }

  if (!session)
    return (
      <main className="auth-shell">
        <section className="brand-panel">
          <div className="mark">N</div>
          <p className="eyebrow">NORTHSTAR BANK</p>
          <h1>Money, with a little more clarity.</h1>
          <p>
            One calm place to view your balance, move money, and keep track of
            what matters.
          </p>
          <div className="trust">
            <span>●</span> Secure demo banking experience
          </div>
        </section>
        <section className="auth-panel">
          <div className="auth-card">
            <p className="eyebrow">WELCOME</p>
            <h2>
              {mode === "login"
                ? "Sign in to your account"
                : "Open your account"}
            </h2>
            <p className="muted">
              {mode === "login"
                ? "Good to see you again."
                : "It takes less than a minute."}
            </p>
            <form onSubmit={submitAuth}>
              {mode === "register" && (
                <div className="two-inputs">
                  <label>
                    First name
                    <input name="firstName" required />
                  </label>
                  <label>
                    Last name
                    <input name="lastName" required />
                  </label>
                </div>
              )}
              <label>
                Email address
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                />
              </label>
              <label>
                Password
                <input
                  name="password"
                  type="password"
                  minLength="8"
                  required
                  placeholder="At least 8 characters"
                />
              </label>
              {notice && <p className="notice error">{notice}</p>}
              <button disabled={loading}>
                {loading
                  ? "Please wait…"
                  : mode === "login"
                    ? "Sign in"
                    : "Create account"}
              </button>
            </form>
            <p className="switch">
              {mode === "login"
                ? "New to Northstar?"
                : "Already have an account?"}{" "}
              <button
                onClick={() => {
                  setMode(mode === "login" ? "register" : "login");
                  setNotice("");
                }}
                className="link-button"
              >
                {mode === "login" ? "Create an account" : "Sign in"}
              </button>
            </p>
          </div>
        </section>
      </main>
    );

  return (
    <main className="dashboard">
      <header>
        <a className="logo">
          <span className="mark small">N</span> Northstar
        </a>
        <nav>
          <span>Overview</span>
          <span>Payments</span>
          <span>Support</span>
        </nav>
        <button className="profile" onClick={logout}>
          {session.firstName?.[0]}
          {session.lastName?.[0]} <b>Sign out</b>
        </button>
      </header>
      <section className="hero">
        <div>
          <p className="eyebrow">
            GOOD DAY, {session.firstName?.toUpperCase()}
          </p>
          <h1>Your financial picture</h1>
          <p>Here is what is happening across your accounts.</p>
        </div>
        <div className="secure">⌁ Your information is protected</div>
      </section>
      <section className="content">
        <div className="primary">
          <div className="section-heading">
            <div>
              <p className="eyebrow">ACCOUNTS</p>
              <h2>Your money</h2>
            </div>
          </div>
          <div className="account-grid">
            {accounts.map((account) => (
              <button
                className={`account-card ${activeAccount?.id === account.id ? "selected" : ""}`}
                onClick={() => selectAccount(account)}
                key={account.id}
              >
                <span>{account.type} account</span>
                <strong>{money(account.balance, account.currency)}</strong>
                <small>•••• {account.accountNumber.slice(-4)}</small>
              </button>
            ))}
          </div>
          <div className="transactions">
            <div className="section-heading">
              <div>
                <p className="eyebrow">ACTIVITY</p>
                <h2>Recent transactions</h2>
              </div>
            </div>
            {transactions.length ? (
              transactions.map((item) => (
                <article className="transaction" key={item.id}>
                  <div className={`transaction-icon ${item.direction}`}>
                    {item.direction === "credit" ? "↓" : "↑"}
                  </div>
                  <div>
                    <strong>
                      {item.description ||
                        (item.direction === "credit"
                          ? "Incoming transfer"
                          : "Transfer")}
                    </strong>
                    <p>
                      {date(item.createdAt)} · Account ••••{" "}
                      {item.counterpartyAccountNumber?.slice(-4)}
                    </p>
                  </div>
                  <b className={item.direction}>
                    {item.direction === "credit" ? "+" : "-"}
                    {money(item.amount, item.currency)}
                  </b>
                </article>
              ))
            ) : (
              <div className="empty">
                No transactions yet. Your activity will appear here.
              </div>
            )}
          </div>
        </div>
        <aside className="transfer-card">
          <p className="eyebrow">QUICK TRANSFER</p>
          <h2>Move money</h2>
          <p className="muted">Send money to another Northstar account.</p>
          <form onSubmit={submitTransfer}>
            <label>
              To account number
              <input
                name="toAccountNumber"
                inputMode="numeric"
                pattern="[0-9]{10,18}"
                required
                placeholder="10–18 digits"
              />
            </label>
            <label>
              Amount
              <input
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                required
                placeholder="0.00"
              />
            </label>
            <label>
              Note <em>optional</em>
              <input
                name="description"
                maxLength="140"
                placeholder="What is this for?"
              />
            </label>
            {notice && (
              <p
                className={`notice ${notice.includes("success") ? "success" : "error"}`}
              >
                {notice}
              </p>
            )}
            <button disabled={loading || !activeAccount}>
              {loading ? "Processing…" : "Review & send"}
            </button>
          </form>
        </aside>
      </section>
    </main>
  );
}
