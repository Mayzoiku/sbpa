import { useQuery } from "@tanstack/react-query";
import wallet from "@/services/wallet";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Currency from "@/components/currency";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn, getRelativeDate } from "@/lib/utils";
import {
  IconCashBanknote,
  IconCashRegister,
  IconPig,
  IconTransactionDollar,
} from "@tabler/icons-react";

const SimpleCard = ({
  title,
  trend,
  value,
  percentageChange,
  valueType = "currency",
  Icon,
}) => {
  return (
    <Card className="gap-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="size-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="font-black">
          {valueType === "currency" ? <Currency value={value} /> : value}
        </div>
        <div className="text-sm space-x-1 text-muted-foreground">
          <span
            className={cn(trend === "up" ? "text-green-500" : "text-red-500")}
          >
            {percentageChange}%
          </span>
          <span>from last month</span>
        </div>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: wallet.getDashboardStats,
    select: (data) => data.data,
  });

  const { data: transactions } = useQuery({
    queryKey: ["transactions"],
    queryFn: wallet.getTransactions,
    select: (data) => data.data,
  });

  const { data: insights } = useQuery({
    queryKey: ["insights"],
    queryFn: wallet.getSpendingInsights,
    select: (data) => data.data,
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SimpleCard
          title="Monthly Income"
          trend={stats?.totalIncome.trend}
          value={stats?.totalIncome.currentMonth}
          percentageChange={stats?.totalIncome?.percentageChange}
          Icon={IconCashBanknote}
        />
        <SimpleCard
          title="Monthly Expenses"
          trend={stats?.totalSpent.trend}
          value={stats?.totalSpent.currentMonth}
          percentageChange={stats?.totalSpent?.percentageChange}
          Icon={IconCashRegister}
        />
        <SimpleCard
          title="Monthly Savings"
          trend={stats?.netSavings.trend}
          value={stats?.netSavings.currentMonth}
          percentageChange={stats?.netSavings?.percentageChange}
          Icon={IconPig}
        />
        <SimpleCard
          title="Monthly Transactions"
          trend={stats?.transactionCount.trend}
          value={stats?.transactionCount.currentMonth}
          percentageChange={stats?.transactionCount?.percentageChange}
          valueType="number"
          Icon={IconTransactionDollar}
        />
      </div>

      {/* AI Insights */}
      {insights && (
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>AI Insights: Smart Spending Predictions</CardTitle>
            <CardDescription>
              Personalized recommendations based on your financial trends
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {insights.map((insight, index) => {
              const TrendIcon =
                insight.trend === "up" ? TrendingUp : TrendingDown;
              const trendColorClass =
                insight.trend === "up" ? "text-red-600" : "text-green-600";

              return (
                <div
                  key={index}
                  className="flex flex-col gap-2 p-4 rounded-md bg-muted/50 border"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg capitalize">
                      {insight.category}
                    </h3>
                    <div
                      className={`flex items-center gap-1 ${trendColorClass}`}
                    >
                      <TrendIcon className="h-5 w-5" />
                      <span className="font-medium">
                        {insight.difference > 0 ? "+" : ""}
                        <Currency value={insight.difference.toFixed(2)} />
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {insight.suggestion}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                    <span>
                      Monthly Avg:{" "}
                      <Currency value={insight.monthly_avg.toFixed(2)} />
                    </span>
                    <span className="font-semibold">
                      Predicted:{" "}
                      <Currency value={insight.predicted.toFixed(2)} />
                    </span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Category Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
            <CardDescription>This Month's Spending Trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.topCategories?.map((category) => (
                <div
                  key={category.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        category.trend === "up"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {category.trend === "down" ? (
                        <TrendingDown className="h-4 w-4" />
                      ) : (
                        <TrendingUp className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm capitalize">
                        {category.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <p
                      className={cn(
                        "text-sm",
                        category.trend === "down"
                          ? "text-red-600"
                          : "text-green-600"
                      )}
                    >
                      {category.percentageChange}%
                    </p>
                    <p className={`font-medium text-sm `}>
                      {category.trend === "down" ? "+" : ""}
                      <Currency value={category.currentMonth} />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest financial activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions?.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        transaction.type === "income"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {transaction.description}
                      </p>
                      <p className="capitalize text-xs text-muted-foreground">
                        {transaction.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-medium text-sm ${
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : ""}
                      <Currency value={transaction.amount} />
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {getRelativeDate(transaction.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
