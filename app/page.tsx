import { getSessionUserId } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const userId = await getSessionUserId();
  if (userId) {
    redirect("/memo");
  }
  redirect("/login");
}
