import BalanceCard from "@/core/components/BalanceCard";
import Statement from "@/core/components/Statement";
import TransactionForm from "@/core/components/TransactionForm";

export default function Home() {
  return (
    // <div className="grid grid-cols-1 md:grid-cols-10 gap-6">
    //   <main className="col-span-full md:col-span-7">
    //     <div className="flex flex-col gap-6">
    //       <BalanceCard />
    //       <TransactionForm />
    //     </div>
    //   </main>
    //   {/* <div className="col-span-full md:col-span-3">
    //     <Statement showLatest={6} />
    //   </div> */}
    // </div>
    <main>
      <BalanceCard />
      <TransactionForm />
    </main>
  );
}
