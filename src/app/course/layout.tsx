import { SiteFooter, SiteNav } from "@/components/site";
import CourseShell from "./CourseSidebar";
import { AccountProvider } from "./Account";

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav active="/course" />
      <AccountProvider>
        <CourseShell>{children}</CourseShell>
      </AccountProvider>
      <SiteFooter />
    </div>
  );
}
