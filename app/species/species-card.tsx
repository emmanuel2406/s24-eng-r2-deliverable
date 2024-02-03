"use client";

import { Badge } from "@/components/ui/badge";
import type { Database } from "@/lib/schema";
import DeleteSpeciesDialog from "./delete-species-dialog";
import EditSpeciesDialog from "./edit-species-dialog";
import ViewSpeciesDialog from "./view-species-dialog";

import Image from "next/image";
type Species = Database["public"]["Tables"]["species"]["Row"];

export default function SpeciesCard({ species, userId }: { species: Species; userId: string }) {
  return (
    <div className="m-4 w-72 min-w-72 flex-none rounded border-2 p-3 shadow">
      {species.image && (
        <div className="relative h-40 w-full">
          <Image src={species.image} alt={species.scientific_name} fill style={{ objectFit: "cover" }} />
        </div>
      )}
      <h3 className="mt-3 text-2xl font-semibold">{species.scientific_name}</h3>
      <div className="flex w-full">
        <h4 className="text-lg font-light italic">{species.common_name}</h4>
        {species.endangered && (
          <Badge variant="destructive" className="m-1">
            Endangered
          </Badge>
        )}
      </div>
      <p>{species.description ? species.description.slice(0, 150).trim() + "..." : ""}</p>
      <ViewSpeciesDialog species={species} />
      {userId === species.author && (
        <div className="h-40 w-full">
          <EditSpeciesDialog species={species} />
          <DeleteSpeciesDialog species={species} />
        </div>
      )}
    </div>
  );
}
