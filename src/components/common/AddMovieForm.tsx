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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

export default function AddMovieForm({
  refreshMovies,
  onOpenChange,
}: {
  refreshMovies: () => void;
  onOpenChange: (isOpen: boolean) => void;
}) {
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
    const { Name, AgeRec, Movie, Poster } = values;

    console.log("Form Values:", values);
    console.log("Name:", Name);
    console.log("Age Recommendation:", AgeRec);
    console.log("Movie:", Movie);
    console.log("Poster:", Poster);

    const movieFilePath = Movie?.[0]?.path;
    const posterFilePath = Poster?.[0]?.path;

    console.log("Movie File Path:", movieFilePath);
    console.log("Poster File Path:", posterFilePath);

    // Sanitize the Name for use as a folder name
    const sanitizedFolderName = Name.trim().replace(/[^a-zA-Z0-9-_]/g, "");

    // Send the data to the main process
    window.electronAPI
      .saveFiles({
        folderName: sanitizedFolderName,
        ageRecommendation: AgeRec,
        movieFilePath,
        posterFilePath,
      })
      .then((response: boolean) => {
        console.log(response); // Handle response from main process
        refreshMovies();
        onOpenChange(false);
      })
      .catch((error: Error) => {
        console.error("Error in saving files:", error);
      });
  }

  return (
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
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="Movie"
          render={() => (
            <FormItem>
              <FormLabel>Movie File</FormLabel>
              <FormControl>
                <Input
                  className="text-gray-500"
                  type="file"
                  placeholder="shadcn"
                  {...movieFileRef}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="Poster"
          render={() => (
            <FormItem>
              <FormLabel>Poster File</FormLabel>
              <FormControl>
                <Input
                  className="text-gray-500"
                  type="file"
                  placeholder="shadcn"
                  {...posterFileRef}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center">
          <Button type="submit" className="w-1/2 rounded-[0.5rem]">
            Add Movie
          </Button>
        </div>
      </form>
    </Form>
  );
}
