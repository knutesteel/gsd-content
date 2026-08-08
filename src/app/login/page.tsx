import { loginWithGoogle } from "./actions";
import styles from "./login.module.css";

const errorMessages: Record<string, string> = {
  unauthorized: "This Google account is not authorized. Sign in with knutesteel@gmail.com.",
  confirmation_failed: "Google sign-in could not be completed. Please try again.",
  google_sign_in_failed: "Google sign-in could not be started. Please try again.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const query = await searchParams;
  const error = query.error ? (errorMessages[query.error] ?? query.error) : null;

  return (
    <main className={styles.shell}>
      <section className={styles.card}>
        <p className={styles.eyebrow}>GSD Content · V2</p>
        <h1>Welcome back, Knute.</h1>
        <p className={styles.lede}>Sign in to the private content workspace with your authorized Google account.</p>
        {error && <p className={styles.error}>{error}</p>}
        <form className={styles.form} action={loginWithGoogle}>
          <button type="submit">Continue with Google</button>
        </form>
      </section>
    </main>
  );
}
