import { createServerSupabaseClient } from "@/lib/server-utils";
import { redirect } from "next/navigation";
import SpeciesGrid from "./species-grid";

export default async function SpeciesList() {
  // Create supabase server component client and obtain user session from stored cookie
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // this is a protected route - only users who are signed in can view this route
    redirect("/");
  }
  // Obtain the ID of the currently signed-in user
  const sessionId = session.user.id;

  const { data: speciesData, error: speciesError } = await supabase
    .from("species")
    .select("*")
    .order("id", { ascending: true });

  if (speciesError) {
    console.error("Failed to fetch species:", speciesError.message);
    // Handle error - possibly set an error state here
  }

  return (
    <>
      {/* only render when speciesData is not null */}
      {speciesData && <SpeciesGrid sessionId={sessionId} speciesData={speciesData} />}
    </>
  );
}
