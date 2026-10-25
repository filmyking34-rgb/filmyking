export function generateSlug(title: string, year?: string): string {
  if (!title) return "movie"
  let slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")

  if (year && !slug.includes(year.trim())) {
    slug = `${slug}-${year.trim()}`
  }
  return slug || "movie"
}

export function generateMovieUrl(movie: { id?: number; title: string; year?: string; slug?: string }): string {
  if (movie.slug && movie.slug.trim().length > 0) {
    return `/movie/${encodeURIComponent(movie.slug.trim())}`
  }
  const generatedSlug = generateSlug(movie.title, movie.year)
  return `/movie/${encodeURIComponent(generatedSlug)}`
}
