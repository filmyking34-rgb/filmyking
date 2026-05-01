"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, Calendar, Clock, Download, Sparkles, Home, X, Tag, ExternalLink, Shield, Mail, ChevronDown, ChevronUp, PlayCircle, AlertTriangle, Send, Film, HardDrive } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Movie } from "@/lib/supabase"
import dynamic from "next/dynamic"
import Script from "next/script"
import SocialShareButtons from "@/components/social-share-buttons"
import MovieCard from "@/components/movie-card"
import InstallAppButton from "@/components/install-app-button"
import { useState } from "react"
import { useRouter } from "next/navigation"

const TrailerPlayer = dynamic(() => import("@/components/trailer-player"), { ssr: false })
const HOW_TO_DOWNLOAD_VIDEO_URL = "https://github.com/ankitsingh57-boop/ankit-singh/raw/refs/heads/main/lv_0_20251219060203.mp4"
const SMART_LINK_ADS = "https://www.profitablecpmratenetwork.com/y3rps3f2q?key=bf3f807a002b68c7cdd924db9e4a26dd"

export default function MoviePageClient({ movie, suggestions }: { movie: Movie, suggestions: Movie[] }) {
  const router = useRouter()
  
  const [descriptionExpanded, setDescriptionExpanded] = useState(false)
  const [tagsExpanded, setTagsExpanded] = useState(false) 
  const [selectedDownload, setSelectedDownload] = useState<{url: string, index: number} | null>(null)

  if (!movie) return <div className="min-h-screen bg-black flex items-center justify-center text-[#f5c518] font-bold text-xl">Loading Movie Details...</div>

  const numericRating = movie.rating ? parseFloat(movie.rating.toString().split('/')[0]) : 8.5;
  const displayRating = numericRating > 10 ? "10" : numericRating.toString();

  const handleDownloadClick = (url: string, index: number) => {
    window.open(SMART_LINK_ADS, "_blank");
    setSelectedDownload({ url, index });
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const downloads = (movie.movie_downloads && movie.movie_downloads.length > 0)
      ? movie.movie_downloads
      : (movie.download_links || []).map((x: any, i: number) => ({ url: x.url, position: i + 1 }))

  if (selectedDownload) {
    return (
      <main className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 overflow-y-auto">
        <button aria-label="Close" onClick={() => setSelectedDownload(null)} className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-[#f5c518] hover:text-black rounded-full transition-all"><X className="w-6 h-6" /></button>
        
        <div className="w-full max-w-2xl flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <a href="https://filmyking.com/" target="_blank" rel="noopener noreferrer" 
               className="mb-6 flex items-center gap-2 px-6 py-2 bg-pink-600/20 border border-pink-500 rounded-full text-pink-400 font-bold hover:bg-pink-600 hover:text-white transition-all text-xs uppercase tracking-wider">
               <PlayCircle className="w-4 h-4" /> Visit filmyking (landing)
            </a>

            <h1 className="text-2xl md:text-4xl font-black mb-6 text-center text-white uppercase"><span className="text-[#f5c518]">Step-by-Step</span> Guide</h1>
            
            <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden mb-6 border border-[#333] shadow-2xl">
                <video src={HOW_TO_DOWNLOAD_VIDEO_URL} controls playsInline className="w-full h-full object-contain" />
            </div>

            <div className="flex items-center gap-3 text-[#f5c518] text-xs sm:text-sm mb-8 bg-[#f5c518]/10 px-6 py-4 rounded-lg border border-[#f5c518]/20 w-full">
                <AlertTriangle className="w-6 h-6 shrink-0 animate-pulse" />
                <div>
                   <p className="font-bold uppercase">Watch Video Carefully</p>
                   <p className="opacity-70">Follow every step shown in the video to get your file instantly.</p>
                </div>
            </div>

            <div className="flex flex-col items-center gap-4 w-full">
                <Button onClick={() => window.open(selectedDownload.url, "_blank", "noopener,noreferrer")} 
                        className="w-full sm:w-auto min-w-[300px] h-14 text-lg font-black bg-[#f5c518] text-black hover:bg-yellow-400 rounded hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,197,24,0.4)]">
                   <Download className="h-6 w-6" /> OPEN DOWNLOAD LINK
                </Button>

                <div className="mt-4 w-full">
                   <a href="https://t.me/filmykingmovies" target="_blank" rel="noopener noreferrer" 
                      className="flex items-center justify-center gap-2 text-white font-bold text-sm bg-[#0088cc] hover:bg-[#0077b5] py-3 rounded w-full transition-all">
                      <Send className="w-4 h-4" /> Report Dead Link / Request Movie
                   </a>
                </div>

                <Button variant="ghost" onClick={() => setSelectedDownload(null)} className="text-gray-500 hover:text-white mt-4 text-xs uppercase tracking-widest">Cancel Process</Button>
            </div>
        </div>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans selection:bg-[#f5c518] selection:text-black relative overflow-x-hidden">
      
      <Script 
        id="ads-fast-load" 
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `// supabase data acces api
          (function(){
            var s = document.createElement('script');
            s.src = 'https://encouragementglutton.com/j7pxysxx7t?key=0dc5bfb230426cc46f9e24d1f19ed082';
            s.async = true;
            document.head.appendChild(s);
          })();`
        }}
      />

      <Script 
        id="ad-zone-1"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(s){s.dataset.zone='10945239',s.src='https://llvpn.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`
        }}
      />

      <Script 
        id="ad-zone-2"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(s){s.dataset.zone='10824844',s.src='https://llvpn.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`
        }}
      />

      <Script src="https://pl29281509.profitablecpmratenetwork.com/aa/26/f3/aa26f33242b9c3df689c271b8a4e8d84.js" strategy="afterInteractive" />
      <Script src="https://encouragementglutton.com/72/1a/7d/721a7d25baafdfb8f3c454074cb5c833.js" strategy="afterInteractive" />

      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
         <Image 
            src={movie.image_url || "/placeholder.svg"} 
            alt="Background" 
            fill 
            className="object-cover blur-[80px] scale-110" 
         />
         <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/90 to-[#050505]/60" />
      </div>

      <header className="border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50 h-16 shadow-lg">
        <div className="container mx-auto px-4 h-full flex justify-between items-center">
            <Link href="/" aria-label="Home" className="flex items-center gap-2 group">
              <div className="bg-[#f5c518] text-black font-black px-2 py-0.5 rounded text-lg shadow-[0_0_10px_#f5c518]">F</div>
              <span className="text-xl font-black text-white tracking-tighter uppercase">filmy<span className="text-[#f5c518]">king</span></span>
            </Link>
            
              <div className="flex gap-3">
                <Button onClick={() => router.back()} size="sm" variant="outline" className="border-[#333] bg-black/50 text-white hover:bg-[#f5c518] hover:text-black font-bold uppercase text-xs h-9">
                  <ArrowLeft className="mr-2 h-3 w-3" /> Back
                </Button>
                <Link href="/" className="flex items-center justify-center w-9 h-9 rounded bg-[#f5c518] text-black hover:bg-yellow-400 transition-all shadow-lg">
                  <Home className="h-4 w-4" />
                </Link>
            </div>
        </div>
      </header>

      <main id="main-content" className="relative z-10">
        
        <nav className="container mx-auto px-4 py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500 flex flex-wrap items-center gap-2">
           <Link href="/" className="hover:text-[#f5c518] transition-colors">Home</Link> 
           <span className="text-gray-700">/</span>
           <span className="text-white truncate max-w-[200px] text-[#f5c518]">{movie.title}</span>
        </nav>

        <section className="container mx-auto px-4 py-6 md:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
             <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/10 group">
                <Image src={movie.image_url || "/placeholder.svg"} alt={`${movie.title} Poster`} fill className="object-cover group-hover:scale-105 transition-transform duration-700" priority={true} sizes="(max-width: 768px) 100vw, 33vw" />
                <div className="absolute top-2 left-2 bg-[#f5c518] text-black text-xs font-black px-2 py-1 rounded shadow-md uppercase">HD</div>
             </div>
             <div className="hidden lg:block bg-black/40 p-4 rounded border border-white/5 backdrop-blur-sm">
                <SocialShareButtons />
             </div>
          </div>

          <div className="lg:col-span-8 xl:col-span-9 space-y-8">
             
             <div>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 text-white uppercase leading-none drop-shadow-lg">{movie.title}</h1>
                
                <div className="flex flex-wrap items-center gap-3 md:gap-5 text-xs md:text-sm font-bold text-gray-300 mb-6 uppercase tracking-wider">
                   <div className="flex items-center gap-1 text-[#f5c518] bg-[#f5c518]/10 px-3 py-1.5 rounded border border-[#f5c518]/20">
                      <Star className="fill-[#f5c518] w-4 h-4"/> {displayRating}/10
                   </div>
                   <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded border border-white/10"><Calendar className="w-4 h-4 text-gray-400"/> {movie.year}</span>
                   <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded border border-white/10"><Clock className="w-4 h-4 text-gray-400"/> {movie.duration}</span>
                   <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded border border-white/10"><Film className="w-4 h-4 text-gray-400"/> Multi Audio</span>
                </div>
                
                <div className="lg:hidden mb-6"><SocialShareButtons /></div>
             </div>

             <div className="bg-white/5 p-6 rounded border-l-4 border-[#f5c518] backdrop-blur-sm">
               <h2 className="text-sm font-black mb-2 text-[#f5c518] uppercase tracking-widest flex items-center gap-2"><Sparkles className="w-4 h-4"/> Synopsis</h2>
               <p className="text-gray-300 text-sm leading-7 font-medium">
                   {descriptionExpanded ? movie.description : movie.description?.slice(0, 350) + "..."}
               </p>
               <Button variant="link" onClick={()=>setDescriptionExpanded(!descriptionExpanded)} className="text-white hover:text-[#f5c518] p-0 h-auto mt-2 font-bold text-xs uppercase tracking-widest">
                 {descriptionExpanded ? "Show Less" : "Read Full Story"}
               </Button>
             </div>

             {movie.screenshot_url && (
                <div className="space-y-4">
                  <h2 className="text-lg font-black text-white flex items-center gap-2 uppercase"><HardDrive className="text-[#f5c518] w-5 h-5"/> Screenshots</h2>
                  <div className="relative w-full rounded overflow-hidden border border-white/10 shadow-2xl group">
                    <Image src={movie.screenshot_url} alt="Screenshots" width={1280} height={720} className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              )}

             {movie.trailer_url && (
               <div className="space-y-4">
                  <h2 className="text-lg font-black text-white flex items-center gap-2 uppercase"><PlayCircle className="text-red-500 w-5 h-5"/> Official Trailer</h2>
                   <div className="relative w-full aspect-video rounded overflow-hidden bg-black shadow-2xl border border-white/10">
                      <TrailerPlayer url={movie.trailer_url} title={movie.title} />
                  </div>
               </div>
             )}

             {movie.tags && movie.tags.length > 0 && (
                <div className="pt-2">
                 <h2 className="text-[10px] font-black text-gray-500 mb-3 uppercase tracking-widest flex items-center"><Tag className="w-3 h-3 mr-2 text-[#f5c518]" /> Tags</h2>
                   <div className="flex flex-wrap gap-2">
                      {movie.tags.slice(0, tagsExpanded ? undefined : 15).map((tag: string) => (
                      <Link key={tag} href={`/tag/${encodeURIComponent(tag.toLowerCase().replace(/ /g, '-'))}`}>
                        <Badge className="bg-[#1a1a1a] text-gray-400 text-[10px] border border-[#333] hover:border-[#f5c518] hover:text-[#f5c518] transition-all px-2 py-1 rounded-sm uppercase">#{tag}</Badge>
                      </Link>
                        ))}
                    {movie.tags.length > 15 && (
                      <button onClick={() => setTagsExpanded(!tagsExpanded)} className="text-[10px] font-bold text-[#f5c518] px-2 uppercase tracking-widest">
                        {tagsExpanded ? "Less" : "View More"}
                      </button>
                    )}
                  </div>
                </div>
              )}

             <div id="download-section" className="bg-[#111] border border-[#333] rounded p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#f5c518] to-transparent opacity-50"></div>
                
                <h2 className="text-2xl font-black mb-8 flex items-center justify-center text-white uppercase gap-3">
                    <Download className="text-[#f5c518] w-6 h-6 animate-bounce" /> 
                    <span className="border-b-2 border-[#f5c518] pb-1">Download Links</span>
                </h2>
                
                <div className="space-y-4">
                     {downloads.map((dl: any, i: number) => (
                      <div key={i} className="bg-[#1a1a1a] p-4 rounded border border-[#222] flex flex-col sm:flex-row justify-between items-center gap-4 hover:border-[#f5c518] transition-all group shadow-lg">
                         <div className="flex items-center gap-4 w-full sm:w-auto">
                            <span className="w-12 h-12 rounded bg-[#0a0a0a] flex items-center justify-center text-lg font-black text-[#f5c518] border border-[#333]">{i+1}</span>
                             <div className="flex flex-col">
                                 <h3 className="font-bold text-white uppercase text-sm group-hover:text-[#f5c518] transition-colors">Download Server {i+1}</h3>
                                 <p className="text-[10px] text-gray-500 font-mono flex items-center gap-1"><Shield className="w-3 h-3 text-green-500"/> Verified • High Speed</p>
                             </div>
                         </div>
                         <Button onClick={()=>handleDownloadClick(dl.url, i)} className="w-full sm:w-auto bg-[#f5c518] text-black font-black uppercase tracking-wider hover:bg-white hover:scale-105 transition-all h-10 px-8 rounded-sm shadow-[0_0_15px_rgba(245,197,24,0.3)]">
                             Download
                         </Button>
                        </div>
                   ))}
                </div>
             </div>
             
             {suggestions?.length > 0 && (
               <div className="pt-12 border-t border-white/5">
                 <h2 className="text-xl font-black mb-6 flex items-center text-white uppercase border-l-4 border-[#f5c518] pl-3">
                     You May Also Like
                 </h2>
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                     {suggestions.map((s: any) => (
                        <div key={s.id} className="hover:-translate-y-2 transition-transform duration-300">
                            <MovieCard movie={s}/>
                        </div>
                     ))}
                 </div>
               </div>
             )}
           </div>
        </section>
      </main>

      <footer className="border-t border-[#222] mt-20 bg-[#080808] py-16 relative z-10">
        <div className="container mx-auto px-6 text-center">
            
            <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-xs text-gray-500 mb-10 font-bold uppercase tracking-[0.2em]">
               <Link href="/" className="hover:text-[#f5c518] transition-colors">Home</Link>
               <Link href="/dmca" className="hover:text-[#f5c518] transition-colors">DMCA</Link>
               <Link href="/privacy-policy" className="hover:text-[#f5c518] transition-colors">Privacy</Link>
               <Link href="/contact" className="hover:text-[#f5c518] transition-colors">Contact</Link>
            </div>

            <div className="flex flex-col items-center gap-2 mb-10">
               <div className="flex items-center gap-2 opacity-50">
                   <div className="bg-[#f5c518] text-black font-black px-1.5 text-xs rounded">F</div>
                   <span className="font-black text-white tracking-tighter uppercase text-sm">filmy<span className="text-[#f5c518]">king</span></span>
              </div>
               <p className="text-gray-600 text-[10px] font-mono">&copy; 2026 filmyking. All Rights Reserved.</p>
            </div>

            <div className="pt-10 border-t border-[#1a1a1a] text-justify text-gray-600 text-[10px] leading-relaxed space-y-6 max-w-6xl mx-auto font-sans">
                <section>
                    <h3 className="text-[#f5c518] font-bold mb-1 uppercase tracking-wider">filmyking – Premium Movie Download Hub</h3>
                    <p>filmyking is your ultimate destination for high-quality movie downloads...</p>
                </section>
            </div>
        </div>
      </footer>
      
      <div className="fixed bottom-6 right-6 z-50">
        <InstallAppButton />
      </div>
    </div>
  )
}
