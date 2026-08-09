import Script from "next/script";
import { AppHeader } from "@/components/app-header";

export default function ContentPlanPage() {
  return <main className="app-shell">
    <AppHeader />
    <section className="main-content content-plan-host" data-content-plan-root />
    <Script src="/content-plan-data.js" strategy="afterInteractive" />
    <Script src="/content-plan-ui.js" strategy="afterInteractive" />
  </main>;
}
