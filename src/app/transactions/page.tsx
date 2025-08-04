import Statement from "../components/banking/Statement";

export default function Transactions() {
  return (
    <div>
      <main>
        <div className="px-64">
          <Statement isPaginated={true} itemsPerPage={5} />
        </div>
      </main>
    </div>
  );
}
