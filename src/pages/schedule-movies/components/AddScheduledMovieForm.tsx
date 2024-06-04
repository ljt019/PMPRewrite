import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetMoviesQuery } from "@/hooks/useGetMoviesQuery";
import { useSaveScheduleMutation } from "@/hooks/useSaveScheduleMutation";

const formSchema = z.object({
  MovieName: z.string().min(1),
  Time: z.string().min(1),
});

export function AddScheduledMovieForm({
  onOpenChange,
}: {
  onOpenChange: (isOpen: boolean) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      MovieName: "",
      Time: "",
    },
  });

  const {
    data: movies,
    isLoading: isMoviesLoading,
    isError: isMoviesError,
  } = useGetMoviesQuery();

  const saveScheduledMovie = useSaveScheduleMutation();

  const [time, setTime] = useState({ hour: "", minute: "", ampm: "" });

  useEffect(() => {
    if (time.hour && time.minute && time.ampm) {
      form.setValue("Time", `${time.hour}:${time.minute} ${time.ampm}`);
    }
  }, [time, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { MovieName, Time } = values;

    console.log("Form Values: ", values);
    console.log("Movie Name: ", MovieName);
    console.log("Time: ", Time);

    saveScheduledMovie.mutate(
      {
        movieName: MovieName,
        time: Time,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          form.reset();
        },
      }
    );
  }

  if (isMoviesLoading) {
    return <div>Loading...</div>;
  }

  if (isMoviesError || !movies) {
    return <div>Error loading movies</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="MovieName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Movie Name</FormLabel>
              <FormControl>
                <Select onValueChange={(val) => field.onChange(val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a movie" />
                  </SelectTrigger>
                  <SelectContent>
                    {movies.map((movie, index) => (
                      <SelectItem key={index} value={movie.name}>
                        {movie.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="Time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <Select
                    onValueChange={(val) =>
                      setTime((prev) => ({ ...prev, hour: val }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Hour" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[12rem]">
                      {[...Array(12).keys()].map((n) => (
                        <SelectItem
                          key={n}
                          value={String(n + 1).padStart(2, "0")}
                        >
                          {String(n + 1).padStart(2, "0")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    onValueChange={(val) =>
                      setTime((prev) => ({ ...prev, minute: val }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Minute" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "00",
                        "15",
                        "30",
                        "45",
                        new Date(
                          new Date().setMinutes(new Date().getMinutes() + 1)
                        )
                          .getMinutes()
                          .toString()
                          .padStart(2, "0"),
                      ].map((n) => (
                        <SelectItem key={n} value={n}>
                          {n}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    onValueChange={(val) =>
                      setTime((prev) => ({ ...prev, ampm: val }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="AM/PM" />
                    </SelectTrigger>
                    <SelectContent>
                      {["AM", "PM"].map((period) => (
                        <SelectItem key={period} value={period}>
                          {period}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center">
          <Button type="submit" className="w-1/2 rounded-[0.5rem]">
            Add Scheduled Movie
          </Button>
        </div>
      </form>
    </Form>
  );
}
