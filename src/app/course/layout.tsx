import { SiteFooter, SiteNav } from "@/components/site";
import CourseShell from "./CourseSidebar";

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav active="/course" />
      <CourseShell>{children}</CourseShell>
      <SiteFooter />
    </div>
  );
}
