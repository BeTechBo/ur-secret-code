import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="w-full bg-white/90 backdrop-blur-md border-b border-secondary/40 shadow-sm sticky top-0 z-40 transition-all">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 sm:h-24 items-center">
          
          <Link href="/" className="flex items-center space-x-3 sm:space-x-4 group">
            <div className="bg-white rounded-full overflow-hidden border-2 border-secondary shadow-sm group-hover:scale-105 transition-transform duration-200 w-14 h-14 sm:w-16 sm:h-16 relative">
              <Image
                src="/logo.jpg"
                alt="The Upper Room Logo"
                fill
                sizes="(max-width: 640px) 56px, 64px"
                className="object-cover"
                priority
              />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold text-foreground block tracking-tight">
                The Upper Room
              </span>
              <span className="text-[10px] sm:text-xs text-primary font-semibold tracking-widest uppercase">
                AUC dorms Community
              </span>
            </div>
          </Link>
          
          <div className="flex items-center gap-3">
            <a 
              href="https://www.instagram.com/the_upper_room_gathering" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-all p-2.5 bg-purple-50 hover:bg-purple-100 rounded-full border border-purple-200 hover:scale-110 shadow-xs"
              title="Follow us on Instagram"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 sm:w-5 sm:h-5">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
          </div>

        </div>
      </div>
    </nav>
  );
}
