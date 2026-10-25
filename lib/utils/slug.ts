export function generateSlug(title: string, year?: string): string {
  if (!title) return "movie"

  // Convert to lowercase and clean up
  let slug = title
    .toLowerCase()
    .trim()
    // Replace special chars, brackets, commas, quotes with hyphen
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")

  // Append year only if not already present in title
  if (year && !slug.includes(year.trim())) {
    slug = `${slug}-${year.trim()}`
  }

  return slug || "movie"
}

export function generateMovieUrl(movie: { id?: number; title: string; year?: string; slug?: string }): string {
  // If slug exists in database, use it
  if (movie.slug && movie.slug.trim().length > 0) {
    return `/movie/${encodeURIComponent(movie.slug.trim())}`
  }

  // Otherwise generate slug on the fly from title and year (no ID!)
  const generatedSlug = generateSlug(movie.title, movie.year)
  return `/movie/${encodeURIComponent(generatedSlug)}`
}
