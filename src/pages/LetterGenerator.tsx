import { useParams } from "react-router-dom";
import AppLayout from "@/components/AppLayout";

const LetterGenerator = () => {
  const { id } = useParams();

  return (
    <AppLayout>
      <div className="container py-10">
        <h1 className="font-display text-3xl font-bold text-foreground">Letter Generator</h1>
        <p className="font-body text-muted-foreground mt-2">Generate response letter for case <span className="font-mono text-sm">{id}</span></p>
        <div className="mt-8 rounded-lg border border-border bg-card p-8 text-center">
          <p className="font-mono text-sm text-muted-foreground tracking-wider uppercase">Letter Editor — Phase 3</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default LetterGenerator;
