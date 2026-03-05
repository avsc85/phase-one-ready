import { useParams } from "react-router-dom";
import AppLayout from "@/components/AppLayout";

const CaseDetail = () => {
  const { id } = useParams();

  return (
    <AppLayout>
      <div className="container py-10">
        <h1 className="font-display text-3xl font-bold text-foreground">Case Detail</h1>
        <p className="font-body text-muted-foreground mt-2">Review comments for case <span className="font-mono text-sm">{id}</span></p>
        <div className="mt-8 rounded-lg border border-border bg-card p-8 text-center">
          <p className="font-mono text-sm text-muted-foreground tracking-wider uppercase">Comment Review — Phase 2</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default CaseDetail;
