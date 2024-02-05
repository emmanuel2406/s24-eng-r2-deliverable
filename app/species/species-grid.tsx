"use client";

import { Separator } from "@/components/ui/separator";
import { TypographyH2 } from "@/components/ui/typography";
import type { Database } from "@/lib/schema";
import { useState } from "react";
import AddSpeciesDialog from "./add-species-dialog";
import FilterSpecies from "./filter-species";
import OrderSpecies from "./order-species";
import SearchSpecies from "./search-species";
import SpeciesCard from "./species-card";

type Species = Database["public"]["Tables"]["species"]["Row"];

interface speciesGripProps {
  sessionId: string;
  speciesData: Species[];
}
type SpeciesKeys = keyof Species;

export default function SpeciesGrid({ sessionId, speciesData }: speciesGripProps) {
  const [orderField, setOrderField] = useState<SpeciesKeys>("id");
  const [orderAsc, setOrderAsc] = useState<boolean>(false);
  const [kingdom, setKingdom] = useState<string>("All");
  const [query, setQuery] = useState<string>("");

  speciesData.sort((a, b) => {
    const valueA = a[orderField];
    const valueB = b[orderField];
    // Check if the values are numbers or strings and sort accordingly
    if (typeof valueA === "number" && typeof valueB === "number") {
      return orderAsc ? valueA - valueB : valueB - valueA;
    } else if (typeof valueA === "string" && typeof valueB === "string") {
      return orderAsc ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    }
    return 0;
  });
  if (kingdom !== "All") {
    speciesData = speciesData.filter((species) => {
      return species.kingdom == kingdom;
    });
  }

  speciesData = speciesData.filter((species) => {
    let included = false;
    // note that query is already lower cased
    // make lower case each of the fields to search: scientific_name, common_name and description
    if (species.scientific_name.toLowerCase().includes(query)) {
      included = true;
    } else if (species.common_name && species.common_name.toLowerCase().includes(query)) {
      included = true;
    } else if (species.description && species.description.toLowerCase().includes(query)) {
      included = true;
    }
    return included;
  });
  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <TypographyH2>Species List</TypographyH2>
        <SearchSpecies setQuery={setQuery} />
        <OrderSpecies setOrderField={setOrderField} setOrderAsc={setOrderAsc} />
        <FilterSpecies setKingdom={setKingdom} />
        {sessionId && <AddSpeciesDialog userId={sessionId} />}
      </div>
      <Separator className="my-4" />
      <div className="flex flex-wrap justify-center">
        {speciesData?.map((species) => <SpeciesCard key={species.id} species={species} userId={sessionId} />)}
        {speciesData.length == 0 && <TypographyH2 className="text-red-500">No Species Found</TypographyH2>}
      </div>
    </>
  );
}
