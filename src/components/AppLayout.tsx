import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/new-case", label: "New Case" },
  { to: "/dashboard", label: "Active Reviews" },
];

const DemoBanner = () => (
  <div className="h-7 bg-accent flex items-center justify-center font-mono text-[10px] tracking-widest text-accent-foreground">
    🚧 DEMO MODE — For Presentation Purposes Only — Not for Official Submission
  </div>
);

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="h-14 bg-navy flex items-center px-6 border-b-[3px] border-gold">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 mr-8">
        <span className="text-xl">🏛️</span>
        <span className="font-display font-bold text-lg text-cream">
          CalPlanCheck
        </span>
        <span className="font-display font-bold text-lg text-gold">AI</span>
      </Link>

      {/* Center links */}
      <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            to={link.to}
            className={`font-mono text-[11px] uppercase tracking-[2px] transition-colors ${
              location.pathname === link.to
                ? "text-cream"
                : "text-cream/60 hover:text-cream"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 ml-auto">
        <span className="font-mono text-[10px] uppercase tracking-wider bg-gold/20 text-gold border border-gold/40 px-2 py-0.5 rounded">
          DEMO
        </span>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-navy-light flex items-center justify-center text-cream text-xs font-mono font-medium border border-gold/30">
            PC
          </div>
          <span className="hidden lg:block font-mono text-[11px] text-cream/70">
            Plan Checker · Bay Area
          </span>
        </div>
      </div>
    </nav>
  );
};

interface AppLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

const AppLayout = ({ children, showFooter = false }: AppLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DemoBanner />
      <Navbar />
      <main className="flex-1">{children}</main>
      {showFooter && (
        <footer className="bg-navy py-8 px-6 text-center">
          <p className="font-mono text-[11px] text-cream/60 tracking-wider">
            CalPlanCheck AI · Powered by GPT-4o · 2022 CBC / CRC / CMC / CPC / CEC · © 2025
          </p>
          <p className="font-body text-[11px] text-cream/40 mt-2 max-w-2xl mx-auto">
            This tool is for demonstration purposes. Always verify code compliance with licensed professionals.
          </p>
        </footer>
      )}
    </div>
  );
};

export default AppLayout;
