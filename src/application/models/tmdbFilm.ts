export interface tmdbFilm {
  title: string
  original_title: string
  overview: string
  release_date: string
  genres: { id: number; name: string }[]
  runtime: number
  tagline: string
  vote_average: number
  vote_count: number
  budget: number
  revenue: number
  poster_path: string
  production_companies: { id: number; name: string }[]
}
