import AuthGuard from "@/shared/components/auth/AuthGuard";
import TransactionsListPage from "@/modules/statement/presentation/pages/TransactionsListPage";

export default function TransactionsPage() {
  return (
    <AuthGuard>
      <TransactionsListPage />
    </AuthGuard>
  );
}
