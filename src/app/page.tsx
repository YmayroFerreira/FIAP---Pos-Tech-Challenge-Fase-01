"use client";

import AuthGuard from "@/shared/components/auth/AuthGuard";
import DashboardPage from "@/modules/statement/presentation/pages/DashboardPage";

export default function Home() {
  return (
    <AuthGuard>
      <DashboardPage />
    </AuthGuard>
  );
}
