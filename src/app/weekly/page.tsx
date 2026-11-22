import { redirect } from "next/navigation";
import { activeWeekId } from "@/data/weekly-bakes";
export default function Page() {
  redirect(`/weekly/${activeWeekId}`);
}
