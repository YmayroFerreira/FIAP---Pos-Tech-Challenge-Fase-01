import Statement from "../../core/components/Statement";

export default function TransactionsPage() {
  return <Statement isPaginated={true} itemsPerPage={5} />;
}
