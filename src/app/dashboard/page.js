import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Dashboard from "@/components/Dashboard";

export default async function DashboardPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return <div className="pt-16 p-6">Not signed in</div>;
  }

  return <Dashboard user={user} />;
}