import BalanceCard from "./components/banking/BalanceCard";

export default function Home() {
  return (
    <div>
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>SIDEBAR</div>
        <div>
          <BalanceCard />
          <div>Nova transação</div>
        </div>
        <div>Extrato</div>
      </main>
    </div>
  );
}
