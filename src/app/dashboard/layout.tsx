import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <article className="w-full overflow-auto h-screen">
      <main className="flex items-start">
        <Sidebar />
        <section className="lg:w-[calc(100%-275px)] w-full lg:p-6 p-2">{children}</section>
      </main>
    </article>
  );
}