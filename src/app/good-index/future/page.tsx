import { redirect } from "next/navigation";

// GOOD FUTURE lives on the GOOD INDEX home; send anyone here back to it.
export default function FutureRoot() {
  redirect("/good-index");
}
