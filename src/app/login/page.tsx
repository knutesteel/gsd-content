import { createAdmin, login } from "./actions";
import styles from "./login.module.css";

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const query = await searchParams;
  return (
    <main className={styles.shell}>
      <section className={styles.card}>
        <p className={styles.eyebrow}>GSD Content · V2</p>
        <h1>Welcome back, Knute.</h1>
        <p className={styles.lede}>Sign in to the private content workspace.</p>
        {query.error && <p className={styles.error}>{query.error === "invalid" ? "Use the authorized email and a password of at least 12 characters." : query.error}</p>}
        {query.created && <p className={styles.success}>Admin account created. Check your email to confirm it, then sign in.</p>}
        <form className={styles.form}>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" defaultValue="knutesteel@gmail.com" required />
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" minLength={12} required />
          <button formAction={login}>Sign In</button>
          <button className={styles.secondary} formAction={createAdmin}>Create Admin Account</button>
        </form>
      </section>
    </main>
  );
}
