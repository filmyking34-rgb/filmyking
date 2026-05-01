import { createClient } from "@supabase/supabase-js"

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
const supabaseUrl = "https://xabkybevddenygvczssb.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhYmt5YmV2ZGRlbnlndmN6c3NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NzcxNzgsImV4cCI6MjA5MzA1MzE3OH0.xXifXojT9ttnVpXqFIAKh6IXaLPb2sZHLB5TtydjMaE"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/* -------------------- Lightweight client-side cache -------------------- */
type CacheEntry<T> = { data: T; ts: number }
const cache = new Map<string, CacheEntry<any>>()
const TTL = 30_000 

function getCache<T>(key: string): T | null {
  const e = cache.get(key)
  if (!e) return null
  if (Date.now() - e.ts > TTL) {
    cache.delete(key)
    return null
  }
  return e.data as T
}

function setCache<T>(key: string, data: T) {
  cache.set(key, { data, ts: Date.now() })
}

export function clearCache(prefix?: string) {
  if (!prefix) cache.clear()
  else {
    for (const k of cache.keys()) {
      if (k.startsWith(prefix)) cache.delete(k)
    }
  }
}

/* -------------------- Retry helper -------------------- */
async function withRetry<T>(fn: () => Promise<T>, retries = 2, delay = 500): Promise<T> {
  let lastError: any
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn()
    } catch (err: any) {
      lastError = err
      if (i < retries && (err?.message?.includes("fetch") || err?.message?.includes("network"))) {
        await new Promise((r) => setTimeout(r, delay * (i + 1)))
        continue
      }
      throw err
    }
  }
  throw lastError
}

/* -------------------- Types -------------------- */
export interface MovieDownload {
  id?: number; movie_id?: number; url: string; position: number;
  created_at?: string; updated_at?: string;
}

export interface Movie {
  id: number; title: string; year: string; rating: string; duration: string;
  genre: string[]; image_url: string; description: string; tags?: string[];
  trailer_url?: string | null; screenshot_url?: string | null; featured: boolean;
  is_published?: boolean; created_at: string; updated_at: string;
  download_links?: Array<{ url: string }>; movie_downloads?: MovieDownload[];
}

export interface AppSettings {
  id: number; telegram_url: string | null; how_to_download_url: string | null;
  anime_url: string | null; hollywood_url: string | null; info_text: string | null;
  info_url: string | null; created_at: string; updated_at: string;
}

/* -------------------- Admin functions -------------------- */
export async function adminVerify(email: string, password: string): Promise<boolean> {
  const { data, error } = await supabase.rpc("admin_verify", { p_email: email, p_plain_password: password })
  if (error) return false
  return !!data
}

// Admin List - Isme Published aur Unpublished sab dikhega
export async function getMovies(): Promise<Movie[]> {
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return [];
  return (data || []) as Movie[];
}

/* -------------------- Movies list & paging (Modified for Admin Visibility) -------------------- */
export interface GetMoviesPagedParams {
  page?: number; pageSize?: number; search?: string; category?: string; isAdmin?: boolean;
}

export async function getMoviesPaged(params: GetMoviesPagedParams = {}) {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.max(1, params.pageSize ?? 40);
  const key = `movies:${page}:${pageSize}:${params.search ?? ""}:${params.category ?? ""}:${params.isAdmin}`;
  
  const cached = getCache(key);
  if (cached) return cached;

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  try {
    const result = await withRetry(async () => {
      let query = supabase.from("movies").select("*", { count: "exact" });
      
      // Agar admin nahi hai, toh sirf published movies dikhao
      if (!params.isAdmin) {
        query = query.eq("is_published", true);
      }

      if (params.search?.trim()) query = query.ilike("title", `%${params.search.trim()}%`);
      if (params.category && params.category !== "All") query = query.contains("genre", [params.category]);
      
      const { data, error, count } = await query.order("created_at", { ascending: false }).range(from, to);
      if (error) throw error;
      return { data, count };
    });

    const value = { items: result.data || [], total: result.count ?? 0, page, pageSize };
    setCache(key, value);
    return value;
  } catch {
    return { items: [], total: 0, page, pageSize };
  }
}

/* -------------------- Details & CRUD -------------------- */
export async function getMovieById(id: number): Promise<Movie | null> {
  const { data: movie } = await supabase.from("movies").select("*").eq("id", id).single();
  if (!movie) return null;
  const { data: dls } = await supabase.from("movie_downloads").select("*").eq("movie_id", id).order("position", { ascending: true });
  return { ...(movie as Movie), movie_downloads: (dls || []) as MovieDownload[] };
}

export async function addMovie(movie: any) {
  const { data, error } = await supabase.from("movies").insert([movie]).select().single();
  if (error) throw error;
  clearCache("movies:");
  return data;
}

export async function updateMovie(id: number, movie: any) {
  const { data, error } = await supabase.from("movies").update(movie).eq("id", id).select().single();
  if (error) throw error;
  clearCache(`movie:${id}`);
  clearCache("movies:");
  return data;
}

export async function deleteMovie(id: number) {
  const { error } = await supabase.from("movies").delete().eq("id", id);
  clearCache("movies:");
  return !error;
}

/* -------------------- Settings -------------------- */
export async function getAppSettings(): Promise<AppSettings> {
  const { data } = await supabase.from("app_settings").select("*").eq("id", 1).single();
  return data as AppSettings;
}

export async function updateAppSettings(settings: any) {
  const { data } = await supabase.from("app_settings").upsert({ id: 1, ...settings }).select().single();
  return data;
}
