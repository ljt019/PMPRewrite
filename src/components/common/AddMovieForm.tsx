import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  Name: z.string().min(2).max(50),
  AgeRec: z.string().min(2).max(50),
  Movie: z
    .instanceof(FileList)
    .refine(
      (fileList) =>
        Array.from(fileList).every((file) => file.type === "video/mp4"),
      "The movie file must be of type MP4"
    ),
  Poster: z
    .instanceof(FileList)
    .refine(
      (fileList) =>
        Array.from(fileList).every((file) => file.type === "image/jpeg"),
      "The poster file must be of type JPG"
    ),
});

export default function AddMovieForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Name: "",
      AgeRec: "",
      Movie: undefined,
      Poster: undefined,
    },
  });

  const movieFileRef = form.register("Movie");
  const posterFileRef = form.register("Poster");

  function onSubmit(values: z.infer<typeof formSchema>) {
    let { Name, Movie, Poster } = values;

    // Remove Spaces in Name field
    Name = Name.replace(/\s/g, "");

    console.log(Name);

    // Create folder in public/movies with the name of the movie

    // Save the movie file and the poster file to the folder
    // Files should be named {Name}.mp4 and {Name}poster.jpg respectively
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>Add Movie Form</CardTitle>{" "}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="Name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Movie Name</FormLabel>
                    <FormControl>
                      <Input placeholder="One World One Sky" {...field} />
                    </FormControl>
                    <FormDescription>This is the Movie Name</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="AgeRec"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age Recommendation</FormLabel>
                    <FormControl>
                      <Input placeholder="1st Grade" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the Age Recommendation
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Movie"
                render={() => (
                  <FormItem>
                    <FormLabel>File</FormLabel>
                    <FormControl>
                      <Input
                        className="text-gray-500"
                        type="file"
                        placeholder="shadcn"
                        {...movieFileRef}
                      />
                    </FormControl>
                    <FormDescription>This is the Movie File</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Poster"
                render={() => (
                  <FormItem>
                    <FormLabel>Poster</FormLabel>
                    <FormControl>
                      <Input
                        className="text-gray-500"
                        type="file"
                        placeholder="shadcn"
                        {...posterFileRef}
                      />
                    </FormControl>
                    <FormDescription>This is the Poster File</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
