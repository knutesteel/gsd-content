import { AppHeader } from "@/components/app-header";
import { ContentPlanLoader } from "@/components/content-plan-loader";

export default function ContentPlanPage() {
  return (
    <main className="app-shell">
      <AppHeader />
      <ContentPlanLoader />
    </main>
  );
}
