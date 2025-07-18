import BalanceCard from "./components/banking/BalanceCard";
import NewTransaction from "./components/banking/NewTransaction";
import Statement from "./components/banking/Statement";

export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      <aside className="col-span-full md:col-span-2">
        <div>SIDEBAR</div>
      </aside>
      <main className="col-span-full md:col-span-7">
        <div className="flex flex-col gap-6">
          <BalanceCard />
          <NewTransaction />
        </div>
      </main>
      <div className="col-span-full md:col-span-3">
        <Statement />
      </div>
    </div>
  );
}
