"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { type BaseSyntheticEvent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Updated schema to reflect the expected string values
const FormSchema = z.object({
  query: z.string().min(1),
});

type FormData = z.infer<typeof FormSchema>;
interface SearchProps {
  setQuery: (field: string) => void;
}

export default function SearchSpecies({ setQuery }: SearchProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      query: "", // Default value to ensure form initializes with a selection
    },
  });

  function onSubmit(data: FormData) {
    setQuery(data.query.toLowerCase());
    toast({
      title: "String searched for: " + data.query,
    });
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={(e: BaseSyntheticEvent) => void form.handleSubmit(onSubmit)(e)}>
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Search specific term" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="m-1" variant="outline">
            <Icons.search />
          </Button>
          <Button
            className="w-5/12 hover:bg-green-600"
            variant="default"
            onClick={() => {
              form.reset();
              setQuery("");
            }}
          >
            Clear
          </Button>
        </form>
      </Form>
    </>
  );
}
