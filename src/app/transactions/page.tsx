import Statement from "../../core/components/Statement";
import AuthGuard from "@/core/components/AuthGuard";

export default function TransactionsPage() {
  return (
    <AuthGuard>
      <Statement isPaginated={true} itemsPerPage={5} />
    </AuthGuard>
  );
}
