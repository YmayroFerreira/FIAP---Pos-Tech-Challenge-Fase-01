"use client";

import Statement from "@/modules/statement/presentation/components/Statement";

export default function TransactionsListPage() {
  return <Statement isPaginated={true} itemsPerPage={5} />;
}
