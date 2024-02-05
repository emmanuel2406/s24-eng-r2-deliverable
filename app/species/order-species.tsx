"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { type BaseSyntheticEvent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { Database } from "@/lib/schema";
type Species = Database["public"]["Tables"]["species"]["Row"];

// Updated schema to reflect the expected string values
const FormSchema = z.object({
  order: z.enum(["none", "A-Z", "Z-A"]),
});

type FormData = z.infer<typeof FormSchema>;
type SpeciesKeys = keyof Species;
interface OrderProps {
  setOrderField: (field: SpeciesKeys) => void;
  setOrderAsc: (asc: boolean) => void;
}

export default function OrderSpecies({ setOrderField, setOrderAsc }: OrderProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      order: "none", // Default value to ensure form initializes with a selection
    },
  });

  function onSubmit(data: FormData) {
    if (data.order === "Z-A") {
      setOrderAsc(false); // For Z-A ordering
      setOrderField("scientific_name"); // Assuming 'name' is the field you want to order by
    } else if (data.order === "A-Z") {
      setOrderAsc(true); // For A-Z ordering
      setOrderField("scientific_name"); // Assuming 'name' is the field you want to order by
    } else {
      setOrderAsc(true);
      setOrderField("id"); // For 'none', implying no specific order
    }
    toast({
      title: "Scientific name ordering: " + data.order,
    });
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={(e: BaseSyntheticEvent) => void form.handleSubmit(onSubmit)(e)}>
          <FormField
            control={form.control}
            name="order"
            render={({ field }) => (
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-row">
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="A-Z" />
                  </FormControl>
                  <FormLabel className="font-normal">A-Z</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="Z-A" />
                  </FormControl>
                  <FormLabel className="font-normal">Z-A</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="none" />
                  </FormControl>
                  <FormLabel className="font-normal">Default</FormLabel>
                </FormItem>
              </RadioGroup>
            )}
          />
          <Button type="submit" variant="outline">
            Order by scientific name
          </Button>
        </form>
      </Form>
    </>
  );
}
