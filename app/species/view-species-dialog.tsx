"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { createBrowserSupabaseClient } from "@/lib/client-utils";
import type { Database } from "@/lib/schema";
import { useEffect, useState } from "react";
type Species = Database["public"]["Tables"]["species"]["Row"];
type Profiles = Database["public"]["Tables"]["profiles"]["Row"];

// We use zod (z) to define a schema for the "Add species" form.
// zod handles validation of the input values with methods like .string(), .nullable(). It also processes the form inputs with .transform() before the inputs are sent to the database.

export default function ViewSpeciesDialog({ species }: { species: Species }) {
  const [open, setOpen] = useState<boolean>(false);
  // State to store the profile data
  const [profile, setProfile] = useState<Profiles | null>(null); // Adjust the type as needed
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const supabase = createBrowserSupabaseClient();
        const { data, error } = await supabase.from("profiles").select("*").eq("id", species.author).single();

        if (error) {
          throw error; // Throw the error to be caught by the catch block
        }
        setProfile(data); // Assuming the query returns an array and you're interested in the first item
      } catch (error) {
        toast({
          title: "Something went wrong.",
          variant: "destructive",
        });
      }
    };
    void fetchProfile();
  }, [species.author]); // Depend on species.author so that if it changes, the profile is re-fetched

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mt-3 w-full hover:bg-green-600">Learn More</Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            Details about <span className="text-green-600">{species.scientific_name}</span>
          </DialogTitle>
          <DialogDescription>{species.description}</DialogDescription>
          {species.endangered && (
            <Badge variant="destructive" className="w-1/5">
              Endangered
            </Badge>
          )}
          <ul>
            <li>
              Common name: <span className="text-green-500">{species.common_name}</span>
            </li>
            <li>
              Total population: <span className="text-green-400">{species.total_population}</span>
            </li>
            <li>
              Kingdom: <span className="text-green-300">{species.kingdom}</span>
            </li>
          </ul>
        </DialogHeader>
        <hr className="border-gray-200" />
        <DialogFooter className="flex">
          {/* Display profile information if available */}
          {profile && (
            <div className="w-full italic">
              <p>Created by: {profile ? profile.display_name : "Loading..."}</p>
              <p>Email address: {profile ? profile.email : "Loading..."}</p>
              <p className="w-full">Bio: {profile ? profile.biography : "Loading..."} </p>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
