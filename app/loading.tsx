export default function Loading() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#0f172a] relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-saffron/20 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-igreen/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-navy/30 rounded-full blur-[100px]"></div>

      {/* Glass loader card */}
      <div className="relative z-10 flex flex-col items-center justify-center panel p-12 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] border border-white/10 backdrop-blur-xl">
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-saffron rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-2xl">🚆</div>
        </div>
        
        <div className="text-center">
          <div className="text-white font-bold tracking-[0.3em] text-xl mb-1">RAILSY</div>
          <div className="text-saffron text-[10px] tracking-widest uppercase opacity-80">Command Center</div>
        </div>
        
        <div className="mt-6 flex gap-1">
          <span className="w-2 h-2 bg-saffron rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
          <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
          <span className="w-2 h-2 bg-igreen rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
        </div>
      </div>
    </div>
  );
}
