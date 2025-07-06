import BalanceCard from "./components/banking/BalanceCard";

export default function Home() {
  return (
    <div className="">
      <main className="">
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
