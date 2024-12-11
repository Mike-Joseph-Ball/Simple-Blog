import { ExploreProvider } from "./_components/ExploreContext";

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <ExploreProvider>
        {children} {/* This will wrap page.tsx and any nested components inside /explore */}
      </ExploreProvider>
    </div>
  );
}
