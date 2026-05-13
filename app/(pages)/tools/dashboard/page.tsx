import { Suspense } from "react";
import DashboardPageContent from "./DashboardPageContent";

export default function EssayTitlePage() {
  return (
    <Suspense
      fallback={
        <div className="h-72 animate-pulse bg-gray-200 dark:bg-gray-800" />
      }
    >
      <DashboardPageContent />
    </Suspense>
  );
}
