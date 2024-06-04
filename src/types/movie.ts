export interface Movie {
  id: string;
  name: string;
  ageRecommendation: string;
  runTime: string;
  creditsStart?: string;
  folderName: string;
  movieFilePath: string;
  posterFilePath: string;
}

// creation data structure
export interface saveMovieData {
  name: string;
  folderName: string;
  ageRecommendation: string;
  movieFilePath: string;
  posterFilePath: string;
}

export interface ScheduledMovie {
  id: string;
  movieName: string;
  time: string;
}

export interface saveScheduledMovieData {
  movieName: string;
  time: string;
}
