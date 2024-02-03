"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Updated schema to reflect the expected string values
const FormSchema = z.object({
  order: z.enum(["none", "A-Z", "Z-A"]),
});

type FormData = z.infer<typeof FormSchema>;

interface OrderProps {
  setOrderField: (field: string | null) => void;
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
    // Determine the order direction and field based on the selected value
    if (data.order === "Z-A") {
      setOrderAsc(false); // For Z-A ordering
      setOrderField("name"); // Assuming 'name' is the field you want to order by
    } else if (data.order === "A-Z") {
      setOrderAsc(true); // For A-Z ordering
      setOrderField("name"); // Assuming 'name' is the field you want to order by
    } else {
      setOrderField(null); // For 'none', implying no specific order
    }

    toast({
      title: "Ordering: " + data.order,
    });
  }

  return (
    <Form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
      <FormField
        control={form.control}
        name="order" // Corrected name to match schema
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Order</FormLabel>
            <FormControl>
              <RadioGroup
                {...field} // Spread field props to handle value and onChange
                className="flex flex-col space-y-1"
              >
                <RadioGroupItem value="none">No Order</RadioGroupItem>
                <RadioGroupItem value="A-Z">A-Z</RadioGroupItem>
                <RadioGroupItem value="Z-A">Z-A</RadioGroupItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit">Submit</Button>
    </Form>
  );
}
