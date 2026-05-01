import { createClient } from "@supabase/supabase-js";

/* -------------------- DOMAIN GUARD -------------------- */
if (typeof window !== "undefined") {
  const allowedDomains = ["filmyking.com", "localhost", "127.0.0.1", "filmyking34-rgb.vercel.app"];
  const currentHostname = window.location.hostname;
  const isAuthorized = allowedDomains.some(domain => currentHostname.includes(domain));

  if (!isAuthorized) {
    document.body.innerHTML = `
      <div style="display:flex;justify-content:center;align-items:center;height:100vh;background:#000;color:#fff;font-family:sans-serif;text-align:center;padding:20px;">
        <div>
          <h1 style="color:#ff4d4d;font-size:40px;">403 - Access Denied</h1>
          <p style="font-size:18px;">This is locked by flipmega please contact flipmega.com</p>
        </div>
      </div>`;
    throw new Error("Unauthorized Domain: Access to Supabase client is blocked.");
  }
}

/* -------------------- Supabase Config -------------------- */
const supabaseUrl = "https://xabkybevddenygvczssb.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhYmt5YmV2ZGRlbnlndmN6c3NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NzcxNzgsImV4cCI6MjA5MzA1MzE3OH0.xXifXojT9ttnVpXqFIAKh6IXaLPb2sZHLB5TtydjMaE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* -------------------- Lightweight client-side cache -------------------- */
const cache = new Map();
const TTL = 30000;

function getCache(key) {
  const e = cache.get(key);
  if (!e) return null;
  if (Date.now() - e.ts > TTL) {
    cache.delete(key);
    return null;
  }
  return e.data;
}

function setCache(key, data) {
  cache.set(key, { data, ts: Date.now() });
}

export function clearCache(prefix) {
  if (!prefix) cache.clear();
  else {
    for (const k of cache.keys()) {
      if (k.startsWith(prefix)) cache.delete(k);
    }
  }
}

/* -------------------- Retry helper for network errors -------------------- */
async function withRetry(fn, retries = 2, delay = 500) {
  let lastError;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < retries && (err?.message?.includes("fetch") || err?.message?.includes("network"))) {
        await new Promise((r) => setTimeout(r, delay * (i + 1)));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

/* -------------------- Admin verify -------------------- */
export async function adminVerify(email, password) {
  const { data, error } = await supabase.rpc("admin_verify", { p_email: email, p_plain_password: password });
  if (error) {
    console.warn("admin_verify RPC error:", error);
    return false;
  }
  return !!data;
}

/* -------------------- Genres -------------------- */
const DEFAULT_GENRES = ["Action", "Adventure", "Drama", "Sci-Fi", "Crime", "Comedy", "Thriller", "Romance", "Horror"];

export async function getGenres() {
  try {
    const { data, error } = await supabase.from("genres").select("name").order("name", { ascending: true });
    if (error) throw error;
    const names = (data || []).map((g) => g.name).filter(Boolean);
    const merged = Array.from(new Set([...(names.length ? names : DEFAULT_GENRES)]));
    if (!merged.includes("Horror")) merged.push("Horror");
    return merged;
  } catch {
    return DEFAULT_GENRES;
  }
}

/* -------------------- Movies list with paging (PUBLIC) -------------------- */
export async function getMoviesPaged(params = {}) {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.max(1, params.pageSize ?? 40);
  const key = `movies:${page}:${pageSize}:${params.search ?? ""}:${params.category ?? ""}`;
  
  const cached = getCache(key);
  if (cached) return cached;

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  try {
    const result = await withRetry(async () => {
      let query = supabase
        .from("movies")
        .select("id, title, year, rating, duration, genre, image_url, description, tags, trailer_url, featured, created_at, is_published", { count: "exact" })
        .eq("is_published", true);

      if (params.search && params.search.trim().length > 0) {
        query = query.ilike("title", `%${params.search.trim()}%`);
      }
      if (params.category && params.category !== "All") {
        query = query.contains("genre", [params.category]);
      }

      const { data, error, count } = await query.order("created_at", { ascending: false }).range(from, to);
      if (error) throw error;
      return { data, count };
    });

    const value = { items: (result.data || []), total: result.count ?? 0, page, pageSize };
    setCache(key, value);
    return value;
  } catch (error) {
    console.error("Error fetching paged movies:", error);
    return { items: [], total: 0, page, pageSize };
  }
}

/* -------------------- Featured (PUBLIC) -------------------- */
export async function getFeaturedMovies(limit = 3) {
  const key = `featured:${limit}`;
  const cached = getCache(key);
  if (cached) return cached;

  try {
    const { data, error } = await supabase
      .from("movies")
      .select("id, title, year, rating, genre, image_url, featured, created_at, is_published")
      .eq("featured", true)
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(Math.max(1, limit));

    if (error) throw error;
    const items = data || [];
    setCache(key, items);
    return items;
  } catch (error) {
    console.error("Error fetching featured movies:", error);
    return [];
  }
}

/* -------------------- Movie detail -------------------- */
export async function getMovieById(id) {
  const key = `movie:${id}`;
  const cached = getCache(key);
  if (cached !== null && cached !== undefined) return cached;

  const { data: movie, error: movieErr } = await supabase.from("movies").select("*").eq("id", id).single();
  if (movieErr || !movie) {
    setCache(key, null);
    return null;
  }

  let tableDownloads = [];
  const { data: dls, error: dlErr } = await supabase.from("movie_downloads").select("*").eq("movie_id", id).order("position", { ascending: true });

  if (!dlErr && dls) {
    tableDownloads = dls;
  } else if (Array.isArray(movie.download_links)) {
    tableDownloads = movie.download_links.map((x, idx) => ({ url: x?.url ?? "", position: idx + 1 }));
  }

  const full = { ...movie, movie_downloads: tableDownloads };
  setCache(key, full);
  return full;
}

export async function getMovieBySlug(slug) {
  const key = `movie-slug:${slug}`;
  const cached = getCache(key);
  if (cached !== null && cached !== undefined) return cached;

  const idMatch = slug.match(/^(\d+)/);
  const movieId = idMatch ? parseInt(idMatch[1], 10) : null;

  try {
    if (movieId) {
      const movie = await getMovieById(movieId);
      if (movie && movie.is_published === false) return null;
      if (movie) return movie;
    }

    const { data: movie, error: slugErr } = await supabase.from("movies").select("*").eq("slug", slug).single();
    if (!slugErr && movie) {
      if (movie.is_published === false) return null;
      const full = await getMovieById(movie.id);
      setCache(key, full);
      return full;
    }
    return null;
  } catch (err) {
    return null;
  }
}

/* -------------------- CRUD -------------------- */
export async function addMovie(movie) {
  const { data, error } = await supabase.from("movies").insert([movie]).select().single();
  if (!error) {
    clearCache("movies:");
    clearCache("featured:");
    return data;
  }
  return null;
}

export async function updateMovie(id, movie) {
  const { data, error } = await supabase.from("movies").update(movie).eq("id", id).select().single();
  if (!error) {
    clearCache(`movie:${id}`);
    clearCache("movies:");
    clearCache("featured:");
    return data;
  }
  return null;
}

export async function deleteMovie(id) {
  const { error } = await supabase.from("movies").delete().eq("id", id);
  if (!error) {
    clearCache(`movie:${id}`);
    clearCache("movies:");
    clearCache("featured:");
    return true;
  }
  return false;
}

/* -------------------- App Settings -------------------- */
export async function getAppSettings() {
  const fallback = { id: 1, telegram_url: null, how_to_download_url: null, created_at: "", updated_at: "" };
  try {
    const { data, error } = await supabase.from("app_settings").select("*").eq("id", 1).single();
    return error ? fallback : data;
  } catch {
    return fallback;
  }
}

export async function updateAppSettings(settings) {
  const { data, error } = await supabase.from("app_settings").upsert({ id: 1, ...settings }, { onConflict: "id" }).select().single();
  return error ? null : data;
}

/* -------------------- Tags -------------------- */
export async function getMoviesByTag(tag) {
  const key = `tag:${tag}`;
  const cached = getCache(key);
  if (cached) return cached;
  try {
    const { data, error } = await supabase.from("movies").select("*").contains("tags", [tag.toLowerCase()]).eq("is_published", true).order("created_at", { ascending: false });
    if (error) throw error;
    setCache(key, data);
    return data;
  } catch {
    return [];
  }
}
