import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useStatementStore } from "@/store/StatementStore";

interface ChartData {
  date: string;
  entradas: number;
  saidas: number;
  saldo: number;
}

interface FinancialChartProps {
  height?: number;
  showGrid?: boolean;
  title?: string;
}

const FinancialChart = React.memo<FinancialChartProps>(function FinancialChart({
  height = 300,
  showGrid = true,
  title = "Extrato da Conta",
}) {
  const { transactions, loading, error } = useStatementStore();

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const chartData = useMemo((): ChartData[] => {
    if (!transactions || transactions.length === 0) return [];

    const sorted = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    let runningBalance = 0;

    return sorted.map((transaction) => {
      const date = new Date(transaction.date).toLocaleDateString("pt-BR");
      const isCredit = transaction.type === "Credit";

      runningBalance += transaction.value;

      return {
        date,
        entradas: isCredit ? transaction.value : 0,
        saidas: isCredit ? 0 : Math.abs(transaction.value),
        saldo: runningBalance,
      };
    });
  }, [transactions]);

  const { totalEntradas, totalSaidas, saldoAtual } = useMemo(() => {
    const totalEntradas = chartData.reduce(
      (sum, item) => sum + item.entradas,
      0,
    );
    const totalSaidas = chartData.reduce((sum, item) => sum + item.saidas, 0);
    const saldoAtual =
      chartData.length > 0 ? chartData[chartData.length - 1].saldo : 0;

    return { totalEntradas, totalSaidas, saldoAtual };
  }, [chartData]);

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{
      color: string;
      name: string;
      value: number;
      dataKey: string;
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length > 0) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = (): React.ReactElement => {
    const commonProps = {
      data: chartData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
    };

    return (
      <LineChart {...commonProps}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
        <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#666" />
        <YAxis
          tick={{ fontSize: 12 }}
          stroke="#666"
          tickFormatter={(value: number) => formatCurrency(value)}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="saldo"
          stroke="#3b82f6"
          strokeWidth={3}
          name="Saldo"
          dot={{ fill: "#3b82f6", r: 4 }}
        />
      </LineChart>
    );
  };

  if (loading) {
    return (
      <div className="w-full bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Carregando extrato...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="w-full bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Nenhuma transação encontrada</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
        {title}
      </h3>

      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-600 font-medium">Total Entradas</p>
          <p className="text-lg font-bold text-green-800">
            {formatCurrency(totalEntradas)}
          </p>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <p className="text-sm text-red-600 font-medium">Total Saídas</p>
          <p className="text-lg font-bold text-red-800">
            {formatCurrency(totalSaidas)}
          </p>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-600 font-medium">Saldo Atual</p>
          <p className="text-lg font-bold text-blue-800">
            {formatCurrency(saldoAtual)}
          </p>
        </div>
      </div>
    </div>
  );
});

export default FinancialChart;
