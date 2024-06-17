import fs from "fs";
import path from "node:path";
import { generateUniqueId } from "../../src/lib/utils";
import type { Movie } from "../../src/types/movie";
import ffmpeg from "fluent-ffmpeg";

function getVideoDurationInSeconds(videoPath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        if (metadata.format.duration !== undefined) {
          resolve(metadata.format.duration);
        } else {
          reject(new Error("Duration is undefined"));
        }
      }
    });
  });
}

type FolderName = Movie["folderName"];

export async function getMoviesData(): Promise<Movie[]> {
  const moviesDirectory = path.join(__dirname, "../public/movies");

  try {
    const directories = fs
      .readdirSync(moviesDirectory, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    const moviesData: Movie[] = [];
    for (const folderName of directories) {
      const dataPath = path.join(
        moviesDirectory,
        folderName,
        `${folderName}Data.json`
      );

      try {
        const data = fs.readFileSync(dataPath, "utf-8");
        const movieMetadata = JSON.parse(data);
        const movie: Movie = {
          id: movieMetadata.id,
          name: movieMetadata.name,
          ageRecommendation: movieMetadata.ageRecommendation,
          runTime: movieMetadata.runTime,
          creditsStart: movieMetadata.creditsStart,
          folderName: movieMetadata.folderName,
          movieFilePath: movieMetadata.movieFilePath,
          posterFilePath: movieMetadata.posterFilePath,
        };
        moviesData.push(movie);
      } catch (error) {
        console.error(`Failed to read data for movie ${folderName}:`, error);
      }
    }
    return moviesData;
  } catch (error) {
    console.error("Failed to read movie directories:", error);
    return [];
  }
}

export async function getMovieFolders() {
  const moviesDirectory = path.join(__dirname, "../public/movies");

  try {
    const directories = fs
      .readdirSync(moviesDirectory, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
    return directories;
  } catch (error) {
    console.error("Failed to read movie directories:", error);
    return [];
  }
}

export async function deleteMovieFolder(
  _event: unknown,
  folderName: FolderName
) {
  const folderPath = path.join(__dirname, "../public/movies", folderName);
  try {
    fs.rmdirSync(folderPath, { recursive: true });
    return { success: true };
  } catch (error) {
    console.error(`Failed to delete movie folder: ${folderName}`, error);
    // @ts-expect-error error
    return { success: false, message: error.message };
  }
}

export async function saveMovieFiles(_event: unknown, movie: Movie) {
  console.log(`Received request to save files for: ${movie.folderName}`);
  // Base directory where movie folders will be saved
  const baseDirectory = path.join(
    __dirname,
    "../public/movies",
    movie.folderName
  );
  console.log(`Base directory resolved to: ${baseDirectory}`);

  // Ensure the target directory exists
  console.log(`Checking if base directory exists...`);
  if (!fs.existsSync(baseDirectory)) {
    console.log(`Base directory does not exist. Creating...`);
    fs.mkdirSync(baseDirectory, { recursive: true });
    console.log(`Base directory created.`);
  } else {
    console.log(`Base directory already exists.`);
  }

  try {
    console.log(`Preparing to copy files...`);
    // Validate paths
    if (!movie.movieFilePath || !movie.posterFilePath) {
      const errorMessage = "Movie file path or poster file path is undefined.";
      console.error(errorMessage);
      return { status: "error", message: errorMessage };
    }

    // Generate unique ID
    const id = generateUniqueId();

    console.log(`Calculating movie runtime...`);

    console.log(`Calculating movie runtime...`);
    let runTime;
    try {
      runTime = await getVideoDurationInSeconds(movie.movieFilePath);
      runTime = Math.round(runTime / 60).toString();
      runTime = runTime.length === 1 ? `0${runTime}:00` : `${runTime}:00`;
      console.log(`Movie runtime calculated: ${runTime} seconds.`);
    } catch (error) {
      // @ts-expect-error errorMessage
      console.error(`Failed to calculate movie runtime: ${error.message}`);
      // @ts-expect-error errorMessage
      return { status: "error", message: error.message };
    }

    // Define the target paths for the movie and poster files, renaming them as specified
    const targetMoviePath = path.join(baseDirectory, `${movie.folderName}.mp4`);
    const targetPosterPath = path.join(
      baseDirectory,
      `${movie.folderName}Poster.jpg`
    );
    console.log(`Resolved target movie path: ${targetMoviePath}`);
    console.log(`Resolved target poster path: ${targetPosterPath}`);

    // Copy the movie and poster files to the target directory, with new names
    console.log(
      `Copying movie file from ${movie.movieFilePath} to ${targetMoviePath}`
    );
    fs.copyFileSync(movie.movieFilePath, targetMoviePath);
    console.log(`Movie file copied successfully.`);

    console.log(
      `Copying poster file from ${movie.posterFilePath} to ${targetPosterPath}`
    );
    fs.copyFileSync(movie.posterFilePath, targetPosterPath);
    console.log(`Poster file copied successfully.`);

    // Save the name and age recommendation in a JSON file within the same directory, with a new name
    console.log(
      `Saving metadata to ${movie.folderName}data.json in the base directory.`
    );
    const metaData = {
      id,
      name: movie.name,
      ageRecommendation: movie.ageRecommendation,
      runTime,
      folderName: movie.folderName,
      movieFilePath: targetMoviePath,
      posterFilePath: targetPosterPath,
    };
    fs.writeFileSync(
      path.join(baseDirectory, `${movie.folderName}data.json`),
      JSON.stringify(metaData, null, 2)
    );
    console.log(`Metadata saved successfully.`);

    return {
      status: "success",
      message: "Movie, poster, and metadata saved successfully.",
    };
  } catch (error) {
    console.error("Failed to save files and metadata:", error);
    // @ts-expect-error error
    return { status: "error", message: error.message };
  }
}
