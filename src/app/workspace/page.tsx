import { AssetManager } from "@/components/AssetManager";
import { LiveCanvas } from "@/components/LiveCanvas";

export default function WorkspacePage() {
  return (
    <main className="min-h-screen pt-24 pb-8 px-4 md:px-8 h-screen flex flex-col">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[380px_1fr] gap-6 max-w-[1600px] w-full mx-auto overflow-hidden">
        {/* Mobile: AssetManager is shown first, but on smaller screens we might want it collapsible.
            For now, relying on standard flex/grid flow. */}
        <section className="h-full overflow-hidden">
          <AssetManager />
        </section>
        
        <section className="h-full overflow-hidden">
          <LiveCanvas />
        </section>
      </div>
    </main>
  );
}
