"use client";

import { Separator } from "@/components/ui/separator";
import { TypographyH2 } from "@/components/ui/typography";
import { createBrowserSupabaseClient } from "@/lib/client-utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AddSpeciesDialog from "./add-species-dialog";
import OrderSpecies from "./order-species";
import SpeciesCard from "./species-card";

export default function SpeciesList() {
  const router = useRouter();

  const [orderField, setOrderField] = useState<string>("id");
  const [orderAsc, setOrderAsc] = useState<boolean>(false);
  const [species, setSpecies] = useState([]);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();

    const fetchSessionAndSpecies = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (!sessionData.session || sessionError) {
        // Redirect if not signed in
        router.push("/");
        return;
      }

      setSessionId(sessionData.session.user.id);

      const { data: speciesData, error: speciesError } = await supabase
        .from("species")
        .select("*")
        .order(orderField, { ascending: orderAsc });

      if (!speciesError) {
        setSpecies(speciesData);
      } else {
        console.error("Failed to fetch species:", speciesError.message);
        // Handle error - possibly set an error state here
      }
    };

    void fetchSessionAndSpecies();
  }, [orderField, orderAsc, router]);

  // Return statement remains unchanged
  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <TypographyH2>Species List</TypographyH2>
        {/* <OrderSpecies setOrderField={setOrderField} setOrderAsc={setOrderAsc} /> */}
        {sessionId && <AddSpeciesDialog userId={sessionId} />}
      </div>
      <Separator className="my-4" />
      <div className="flex flex-wrap justify-center">
        {species.map((speciesItem) => (
          <SpeciesCard key={speciesItem.id} species={speciesItem} userId={sessionId} />
        ))}
      </div>
    </>
  );
}
