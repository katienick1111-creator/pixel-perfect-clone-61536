import { Outlet, createFileRoute } from "@tanstack/react-router";
import { AcademyShell } from "@/components/AcademyShell";

export const Route = createFileRoute("/academy")({
  head: () => ({
    meta: [
      { title: "Trovin Academy — The Vendor Operating System" },
      {
        name: "description",
        content:
          "Premium training, interactive worksheets, and printable resources for festival, market, and event vendors.",
      },
      { property: "og:title", content: "Trovin Academy" },
      {
        property: "og:description",
        content:
          "Learn, prep, and operate your vendor business. 100+ tools and resources.",
      },
    ],
  }),
  component: () => (
    <AcademyShell>
      <Outlet />
    </AcademyShell>
  ),
});
