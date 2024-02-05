"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { type BaseSyntheticEvent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const kingdoms = z.enum(["All", "Animalia", "Plantae", "Fungi", "Protista", "Archaea", "Bacteria"]);

// Updated schema to reflect the expected string values
const FormSchema = z.object({
  kingdom: kingdoms,
});

type FormData = z.infer<typeof FormSchema>;
interface OrderProps {
  setKingdom: (field: string) => void;
}

export default function FilterSpecies({ setKingdom }: OrderProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      kingdom: "All", // Default value to ensure form initializes with a selection
    },
  });

  function onSubmit(data: FormData) {
    setKingdom(data.kingdom);
    toast({
      title: "Filtered kingdom: " + data.kingdom,
    });
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={(e: BaseSyntheticEvent) => void form.handleSubmit(onSubmit)(e)}>
          <FormField
            control={form.control}
            name="kingdom"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={(value) => field.onChange(kingdoms.parse(value))} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a kingdom" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {kingdoms.options.map((kingdom, index) => (
                        <SelectItem key={index} value={kingdom}>
                          {kingdom}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant="outline">
            Filter by kingdom
          </Button>
        </form>
      </Form>
    </>
  );
}
