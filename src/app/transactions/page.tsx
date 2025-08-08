import Statement from "../components/banking/Statement";

export default function Transactions() {
  return <Statement isPaginated={true} itemsPerPage={5} />;
}
