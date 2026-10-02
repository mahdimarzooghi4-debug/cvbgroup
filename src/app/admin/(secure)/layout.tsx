import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { hasAdminSession } from "@/lib/admin-auth";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await hasAdminSession())) redirect("/admin/login");
  return <AdminShell>{children}</AdminShell>;
}
