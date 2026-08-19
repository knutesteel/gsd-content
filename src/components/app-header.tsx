import Link from "next/link";
import { logout } from "@/app/login/actions";

const primaryLinks = [
  ["/", "News Articles"],
  ["/discover", "News Search"],
  ["/instagram-insights", "Instagram Insights"],
  ["/content-plan", "Content Plan"],
  ["/online-sales", "Online Sales"],
];

const bottomLinks = [
  ["/jobs", "Scheduled Jobs"],
  ["/?status=archived", "Archive"],
];

export function AppHeader() {
  return (
    <header className="topbar">
      <Link className="brand" href="/">
        GSD Content <small>V2</small>
      </Link>
      <nav>
        {primaryLinks.map(([href, label]) => (
          <Link key={href} href={href}>
            {label}
          </Link>
        ))}
        <a
          className="external-plan-link"
          href="https://gsd-retail-plan.knutesteel.chatgpt.site/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Retail Plan
        </a>
        <a
          className="external-plan-link"
          href="https://podcast-outreach-command-center.knutesteel.chatgpt.site/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Podcast Plan
        </a>
        <div className="nav-bottom">
          {bottomLinks.map(([href, label]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
          <form action={logout}>
            <button>Sign Out</button>
          </form>
        </div>
      </nav>
    </header>
  );
}
