import { DashboardWidgets } from "@/modules/playmates/dashboard/dashboard-widgets/DashboardWidgets";
import { getDashboardData } from "@/modules/playmates/dashboard/get-dashboard-data";

export default async function DashboardPage() {
  const data = await getDashboardData();

  return <DashboardWidgets {...data} />;
}
