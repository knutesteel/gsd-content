import Link from "next/link";
import { logout } from "@/app/login/actions";

const primaryLinks = [
  ["/instructions", "Instructions"],
  ["/", "Content Ideas"],
  ["/discover", "Content Search"],
  ["/instagram-insights", "Instagram Insights"],
  ["/content-plan", "Content Plan"],
  ["/collaborations", "Collaborations"],
  ["/channels", "Channels"],
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
          href="https://gsd-retail-plan.knutesteel.chatgpt.site/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Retail Plan
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
