import BalanceCard from "./components/banking/BalanceCard";
import TransactionForm from "./components/banking/TransactionForm";
import Statement from "./components/banking/Statement";

export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-10 gap-6">
      <main className="col-span-full md:col-span-7">
        <div className="flex flex-col gap-6">
          <BalanceCard />
          <TransactionForm />
        </div>
      </main>
      <div className="col-span-full md:col-span-3">
        <Statement showLatest={6} />
      </div>
    </div>
  );
}
