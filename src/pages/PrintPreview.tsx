import { useParams } from "react-router-dom";

const PrintPreview = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-cream p-8">
      <div className="max-w-[8.5in] mx-auto bg-card border border-border shadow-lg p-12 min-h-[11in]">
        <p className="font-mono text-sm text-muted-foreground text-center tracking-wider uppercase">
          Print Preview for case {id} — Phase 3
        </p>
      </div>
    </div>
  );
};

export default PrintPreview;
