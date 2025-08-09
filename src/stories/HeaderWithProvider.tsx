import React from "react";
import Header from "@/core/components/Header";
import { StatementProvider } from "@/context/StatementContext";

export default function HeaderWithProvider() {
  return (
    <StatementProvider>
      <Header />
    </StatementProvider>
  );
}
