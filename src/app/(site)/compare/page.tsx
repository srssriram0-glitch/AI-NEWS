import type { Metadata } from "next";
import { GitCompare, Check, X, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockModels } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "AI Model Comparison",
  description:
    "Compare AI models side-by-side — speed, cost, coding, vision, context, API pricing, and benchmarks.",
};

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <GitCompare className="h-6 w-6 text-indigo-500" />
          <h1 className="text-3xl font-bold">AI Model Comparison</h1>
        </div>
        <p className="text-muted-foreground">
          Compare leading AI models side-by-side on speed, cost, coding, vision,
          context, and benchmarks.
        </p>
      </div>

      {/* Comparison Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-semibold">Model</th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Provider
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Category
                  </th>
                  <th className="px-4 py-3 text-center font-semibold">
                    Context
                  </th>
                  <th className="px-4 py-3 text-center font-semibold">
                    Speed
                  </th>
                  <th className="px-4 py-3 text-center font-semibold">
                    Coding
                  </th>
                  <th className="px-4 py-3 text-center font-semibold">
                    Vision
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    API Pricing
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockModels.map((model) => (
                  <tr
                    key={model.id}
                    className="border-b transition-colors hover:bg-muted/30"
                  >
                    <td className="px-4 py-3 font-medium">{model.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {model.provider}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-xs">
                        {model.category}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {model.contextWindow}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <ScoreBar value={model.speed} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <ScoreBar value={model.coding} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      {model.vision ? (
                        <Check className="mx-auto h-4 w-4 text-green-500" />
                      ) : (
                        <X className="mx-auto h-4 w-4 text-red-400" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {model.apiPricing}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Benchmarks */}
      <h2 className="mt-10 mb-4 text-xl font-bold">Benchmark Scores</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {["MMLU", "HumanEval", "MATH"].map((benchmark) => (
          <Card key={benchmark}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{benchmark}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockModels
                .sort(
                  (a, b) =>
                    (b.benchmarks[benchmark] ?? 0) -
                    (a.benchmarks[benchmark] ?? 0)
                )
                .map((model, i) => (
                  <div key={model.id} className="flex items-center gap-3">
                    <span className="w-5 text-xs font-bold text-muted-foreground">
                      #{i + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">
                          {model.name}
                        </span>
                        <span className="text-sm font-bold">
                          {model.benchmarks[benchmark]}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
                          style={{
                            width: `${model.benchmarks[benchmark]}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ScoreBar({ value }: { value: number }) {
  const color =
    value >= 95
      ? "bg-green-500"
      : value >= 90
        ? "bg-blue-500"
        : value >= 85
          ? "bg-yellow-500"
          : "bg-red-400";

  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-12 rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs font-medium">{value}</span>
    </div>
  );
}
