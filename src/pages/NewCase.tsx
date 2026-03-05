import AppLayout from "@/components/AppLayout";

const NewCase = () => {
  return (
    <AppLayout>
      <div className="container py-10">
        <h1 className="font-display text-3xl font-bold text-foreground">New Case</h1>
        <p className="font-body text-muted-foreground mt-2">Create a new plan check response case.</p>
        <div className="mt-8 rounded-lg border border-border bg-card p-8 text-center">
          <p className="font-mono text-sm text-muted-foreground tracking-wider uppercase">New Case Wizard — Phase 2</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default NewCase;
