export default function BalanceCard() {
  return (
    <div className="bg-gradient-bb text-white p-4 w-full md:w-3/4 lg:w-1/2 min-h-100">
      <div className="flex flex-col items-start">
        <p>Olá, Username :)</p>
        <p>Quinta-feira, 08/07/2025</p>
      </div>
      <div className="flex flex-col items-end">
        <p>Saldo ICONE</p>
        <p>Conta Corrente</p>
        <p>R$ 2.500,00</p>
      </div>
    </div>
  );
}
