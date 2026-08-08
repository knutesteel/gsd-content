import Link from "next/link";
import { logout } from "@/app/login/actions";

const links = [
  ["/instructions", "Instructions"], ["/", "Dashboard"], ["/discover", "Discover"],
  ["/metrics", "Metrics & Export"], ["/collaborations", "Collaborations"], ["/channels", "Channels"],
  ["/retail", "Retail Plan"], ["/online-sales", "Online Sales"], ["/jobs", "Scheduled Jobs"],
  ["/?status=archived", "Archive"],
];

export function AppHeader() {
  return <header className="topbar"><Link className="brand" href="/">GSD Content <small>V2</small></Link><nav>{links.map(([href,label]) => <Link key={href} href={href}>{label}</Link>)}<form action={logout}><button>Sign Out</button></form></nav></header>;
}
