import AppLayout from "@/components/AppLayout";

const Index = () => {
  return (
    <AppLayout showFooter>
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6">
        <div className="text-center max-w-2xl">
          <div className="text-5xl mb-4">🏛️</div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            CalPlanCheck <span className="text-gold">AI</span>
          </h1>
          <p className="font-body text-lg text-muted-foreground mb-8">
            From City Comments to Response Letters in Minutes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/dashboard"
              className="inline-flex items-center justify-center px-6 py-3 bg-navy text-cream font-mono text-xs uppercase tracking-[2px] rounded-md hover:bg-navy-light transition-colors border-b-2 border-gold"
            >
              View Dashboard
            </a>
            <a
              href="/new-case"
              className="inline-flex items-center justify-center px-6 py-3 bg-gold text-accent-foreground font-mono text-xs uppercase tracking-[2px] rounded-md hover:bg-gold-dark transition-colors"
            >
              Start New Case
            </a>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
