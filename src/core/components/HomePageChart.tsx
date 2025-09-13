import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface FinancialData {
  month: string;
  receita: number;
  despesas: number;
  lucro: number;
}

interface FinancialChartProps {
  data?: FinancialData[];
  type?: "line" | "bar" | "area";
  height?: number;
  showGrid?: boolean;
  title?: string;
  onTypeChange?: (type: "line" | "bar" | "area") => void;
}

const sampleData: FinancialData[] = [
  { month: "Jan", receita: 45000, despesas: 32000, lucro: 13000 },
  { month: "Fev", receita: 52000, despesas: 35000, lucro: 17000 },
  { month: "Mar", receita: 48000, despesas: 38000, lucro: 10000 },
  { month: "Abr", receita: 61000, despesas: 42000, lucro: 19000 },
  { month: "Mai", receita: 55000, despesas: 39000, lucro: 16000 },
  { month: "Jun", receita: 67000, despesas: 45000, lucro: 22000 },
];

const FinancialChart: React.FC<FinancialChartProps> = ({
  data = sampleData,
  type = "line",
  height = 300,
  showGrid = true,
  title = "Análise Financeira",
  onTypeChange,
}) => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

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
          {payload.map(
            (
              entry: {
                color: string;
                name: string;
                value: number;
                dataKey: string;
              },
              index: number
            ) => (
              <p key={index} style={{ color: entry.color }} className="text-sm">
                {entry.name}: {formatCurrency(entry.value)}
              </p>
            )
          )}
        </div>
      );
    }
    return null;
  };

  const handleTypeChange = (newType: "line" | "bar" | "area"): void => {
    if (onTypeChange) {
      onTypeChange(newType);
    }
  };

  const renderChart = (): React.ReactElement => {
    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
    };

    switch (type) {
      case "line":
        return (
          <LineChart {...commonProps}>
            {showGrid && (
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            )}
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#666" />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="#666"
              tickFormatter={(value: number) => `R$ ${value / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="receita"
              stroke="#10b981"
              strokeWidth={3}
              name="Receita"
              dot={{ fill: "#10b981", r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="despesas"
              stroke="#ef4444"
              strokeWidth={3}
              name="Despesas"
              dot={{ fill: "#ef4444", r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="lucro"
              stroke="#3b82f6"
              strokeWidth={3}
              name="Lucro"
              dot={{ fill: "#3b82f6", r: 4 }}
            />
          </LineChart>
        );

      case "bar":
        return (
          <BarChart {...commonProps}>
            {showGrid && (
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            )}
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#666" />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="#666"
              tickFormatter={(value: number) => `R$ ${value / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="receita" fill="#10b981" name="Receita" />
            <Bar dataKey="despesas" fill="#ef4444" name="Despesas" />
            <Bar dataKey="lucro" fill="#3b82f6" name="Lucro" />
          </BarChart>
        );

      case "area":
        return (
          <AreaChart {...commonProps}>
            {showGrid && (
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            )}
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#666" />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="#666"
              tickFormatter={(value: number) => `R$ ${value / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="receita"
              stackId="1"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.6}
              name="Receita"
            />
            <Area
              type="monotone"
              dataKey="lucro"
              stackId="2"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
              name="Lucro"
            />
          </AreaChart>
        );

      default:
        return (
          <LineChart {...commonProps}>
            <XAxis dataKey="month" />
            <YAxis />
            <Line dataKey="receita" stroke="#10b981" name="Receita" />
          </LineChart>
        );
    }
  };

  const calculateTotal = (field: keyof FinancialData): number => {
    return data.reduce((sum, item) => {
      const value = item[field];
      return typeof value === "number" ? sum + value : sum;
    }, 0);
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
        {title}
      </h3>

      <div className="flex justify-center gap-2 mb-4">
        {(["line", "bar", "area"] as const).map((chartType) => (
          <button
            key={chartType}
            type="button"
            onClick={() => handleTypeChange(chartType)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              type === chartType
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {chartType === "line"
              ? "Linha"
              : chartType === "bar"
              ? "Barras"
              : "Área"}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-600 font-medium">Receita Total</p>
          <p className="text-lg font-bold text-green-800">
            {formatCurrency(calculateTotal("receita"))}
          </p>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <p className="text-sm text-red-600 font-medium">Despesas Total</p>
          <p className="text-lg font-bold text-red-800">
            {formatCurrency(calculateTotal("despesas"))}
          </p>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-600 font-medium">Lucro Total</p>
          <p className="text-lg font-bold text-blue-800">
            {formatCurrency(calculateTotal("lucro"))}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinancialChart;
