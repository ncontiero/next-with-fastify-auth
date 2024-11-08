import { redirect } from "next/navigation";
import { isAuthenticated } from "@/utils/auth";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (await isAuthenticated()) {
    redirect("/");
  }

  return (
    <div className="mt-16 flex flex-col items-center justify-center px-4">
      <div className="w-96 rounded-md border p-6">{children}</div>
    </div>
  );
}
