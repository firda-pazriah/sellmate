import { redirect } from "next/navigation";

// Daily Digest is the main page: landing on "/" sends you straight
// there instead of duplicating its content at two routes.
export default function Home() {
  redirect("/overview/daily-digest");
}
