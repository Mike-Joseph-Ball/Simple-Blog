import { CommentDashboardProvider } from "./_context/CommentDashboardContext";

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <CommentDashboardProvider>
        {children} {/* This will wrap page.tsx and any nested components inside /comments_dashboard */}
      </CommentDashboardProvider>
    </div>
  );
}
