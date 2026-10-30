import { SiteFooter, SiteNav } from "@/components/site";
import CourseSidebar from "./CourseSidebar";

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav active="/course" />
      <div className="px-4 pt-6 pb-24 max-w-6xl mx-auto grid gap-8 sm:px-8 lg:grid-cols-[17rem_1fr] lg:gap-14 lg:items-start">
        <CourseSidebar />
        <main className="min-w-0">{children}</main>
      </div>
      <SiteFooter />
    </div>
  );
}
