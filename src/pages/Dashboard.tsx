import AppLayout from "@/components/AppLayout";

const Dashboard = () => {
  return (
    <AppLayout>
      <div className="container py-10">
        <h1 className="font-display text-3xl font-bold text-foreground">Case Dashboard</h1>
        <p className="font-body text-muted-foreground mt-2">Manage your plan check response cases.</p>
        <div className="mt-8 rounded-lg border border-border bg-card p-8 text-center">
          <p className="font-mono text-sm text-muted-foreground tracking-wider uppercase">Dashboard content — Phase 2</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
