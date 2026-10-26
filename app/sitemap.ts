import { getMoviesPaged } from "@/lib/supabase"
import { generateSlug } from "@/lib/utils/slug"
import { MetadataRoute } from "next"

const BASE_URL = "https://filmyking.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Fetching all published movies
  const { items: movies } = await getMoviesPaged({ page: 1, pageSize: 2000 })

  // 2. Movie Entries (High-ranking Movie Title Slug based - No ID)
  const movieEntries: MetadataRoute.Sitemap = movies.map((movie) => {
    const slug = movie.slug || generateSlug(movie.title, movie.year)
    return {
      url: `${BASE_URL}/movie/${encodeURIComponent(slug)}`,
      lastModified: new Date(movie.updated_at || movie.created_at || new Date()),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }
  })

  // 3. Tag Entries (Slug based)
  const allTags = Array.from(new Set(movies.flatMap(movie => movie.tags || [])));
  const tagEntries: MetadataRoute.Sitemap = allTags.map((tag) => ({
    url: `${BASE_URL}/tag/${encodeURIComponent(tag.toLowerCase().replace(/ /g, '-'))}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }))

  // 4. Static Pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}/dmca`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ]

  return [...staticPages, ...movieEntries, ...tagEntries]
}
