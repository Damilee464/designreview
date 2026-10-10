import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { format, formatDistanceToNow, isPast, isValid, parseISO } from "date-fns";
import { AlertCircle, ArrowRight, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useMe, type DesignStatus } from "@/lib/app";
import { StatusBadge } from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — DesignReview" }] }),
  component: Dashboard,
});

export const designsQuery = {
  queryKey: ["designs"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("designs")
      .select("*, projects(name), designer:profiles!designs_designer_id_fkey(full_name)")
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return data;
  },
};

// Designers only see their own submissions
export function myDesignsQuery(userId: string) {
  return {
    queryKey: ["designs", "mine", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("designs")
        .select("*, projects(name), designer:profiles!designs_designer_id_fkey(full_name)")
        .eq("designer_id", userId)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  };
}

const BANNER_IMAGES = [
  "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=1400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558655146-d09347e92766?w=1400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1400&q=80&auto=format&fit=crop",
];

function WelcomeBanner({ name, pending, total }: { name: string; pending: number; total: number }) {
  const [imgIndex, setImgIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setImgIndex((i) => (i + 1) % BANNER_IMAGES.length);
        setFade(true);
      }, 400);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-card">
      {/* Background image */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${fade ? "opacity-100" : "opacity-0"}`}
        style={{
          backgroundImage: `url(${BANNER_IMAGES[imgIndex]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />

      {/* Content */}
      <div className="relative flex flex-col gap-4 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-8">
        <div>
          <p className="text-sm font-medium text-white/70">{greeting}</p>
          <h1 className="mt-0.5 text-2xl font-bold text-white sm:text-3xl">{name} 👋</h1>
          <p className="mt-2 text-sm text-white/70">
            {total === 0
              ? "No designs submitted yet. Start by creating one."
              : pending > 0
              ? `You have ${pending} design${pending > 1 ? "s" : ""} waiting for review.`
              : "All designs are reviewed. Great work!"}
          </p>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-3 right-4 flex gap-1">
        {BANNER_IMAGES.map((_, i) => (
          <span key={i} className={`inline-block h-1 rounded-full transition-all ${i === imgIndex ? "w-4 bg-white" : "w-1 bg-white/40"}`} />
        ))}
      </div>
    </div>
  );
}

function Dashboard() {
  const { data: me } = useMe();
  const navigate = useNavigate();
  const isDesigner = me?.roles.includes("designer") && !me?.isStaff;

  // Staff see all designs; designers see only their own
  const { data: designs = [] } = useQuery(
    isDesigner && me?.id ? myDesignsQuery(me.id) : designsQuery,
  );
  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => (await supabase.from("projects").select("*").order("name")).data ?? [],
  });
  const [status, setStatus] = useState<"all" | DesignStatus>("all");
  const [project, setProject] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [mine, setMine] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return designs.filter((d) => {
      if (status !== "all" && d.status !== status) return false;
      if (project !== "all" && d.project_id !== project) return false;
      if (from && new Date(d.created_at) < new Date(from)) return false;
      if (to && new Date(d.created_at) > new Date(to + "T23:59:59")) return false;
      // "Only mine" only applies to staff — designers already see only their own
      if (!isDesigner && mine && d.designer_id !== me?.id) return false;
      if (q && !d.title.toLowerCase().includes(q) && !d.description.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [designs, status, project, from, to, mine, me, search, isDesigner]);

  const pending = designs.filter((d) => d.status === "pending").length;

  const stats = [
    { label: "Total submissions", value: designs.length, cls: "text-foreground", bg: "bg-card" },
    { label: "Pending review", value: pending, cls: "text-pending", bg: "bg-card" },
    { label: "Approved", value: designs.filter((d) => d.status === "approved").length, cls: "text-approved", bg: "bg-card" },
    { label: "Changes requested", value: designs.filter((d) => d.status === "changes_requested").length, cls: "text-changes", bg: "bg-card" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-8">

      {/* Welcome banner */}
      <WelcomeBanner
        name={me?.name.split(" ")[0] ?? ""}
        pending={pending}
        total={designs.length}
      />

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-xl border ${s.bg} p-4 sm:p-5 shadow-card`}>
            <div className="text-xs sm:text-sm text-muted-foreground">{s.label}</div>
            <div className={`mt-2 font-display text-3xl sm:text-4xl font-bold ${s.cls}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="mt-6 sm:mt-8 relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="bg-card pl-9"
          placeholder="Search by title or description…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="mt-3 flex flex-wrap items-end gap-2 sm:gap-3">
        <FilterBox label="Status">
          <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
            <SelectTrigger className="w-36 sm:w-44 bg-card"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="changes_requested">Changes requested</SelectItem>
            </SelectContent>
          </Select>
        </FilterBox>
        <FilterBox label="Project">
          <Select value={project} onValueChange={setProject}>
            <SelectTrigger className="w-36 sm:w-44 bg-card"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All projects</SelectItem>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterBox>
        <FilterBox label="From">
          <Input type="date" className="w-36 sm:w-40 bg-card" value={from} onChange={(e) => setFrom(e.target.value)} />
        </FilterBox>
        <FilterBox label="To">
          <Input type="date" className="w-36 sm:w-40 bg-card" value={to} onChange={(e) => setTo(e.target.value)} />
        </FilterBox>
        {!isDesigner && (
          <label className="flex h-9 items-center gap-2 text-sm">
            <input type="checkbox" checked={mine} onChange={(e) => setMine(e.target.checked)} className="accent-primary" />
            Only mine
          </label>
        )}
      </div>

      {/* Table */}
      <div className="mt-5 overflow-x-auto rounded-xl border bg-card shadow-card">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 p-12 text-center text-muted-foreground">
            <div className="grid size-14 place-items-center rounded-2xl bg-muted">
              <Search className="size-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">No designs found</p>
              <p className="mt-1 text-sm">
                {search ? "Try a different search term." : <>Nothing here yet. <Link to="/designs/new" className="text-primary hover:underline">Submit one</Link></>}
              </p>
            </div>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium sm:px-5">Design</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell sm:px-5">Project</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell sm:px-5">Designer</th>
                <th className="hidden px-4 py-3 font-medium lg:table-cell sm:px-5">Version</th>
                <th className="px-4 py-3 font-medium sm:px-5">Status</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell sm:px-5">Due</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell sm:px-5">Updated</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => {
                const dueDate = d.due_date ? parseISO(d.due_date) : null;
                const overdue = dueDate && isValid(dueDate) && isPast(dueDate) && d.status !== "approved";
                return (
                  <tr
                    key={d.id}
                    onClick={() => navigate({ to: "/designs/$id", params: { id: d.id } })}
                    className={`cursor-pointer border-b last:border-0 transition-colors hover:bg-muted/40 ${overdue ? "bg-destructive/5" : ""}`}
                  >
                    <td className="px-4 py-3.5 sm:px-5">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-primary">{d.title}</span>
                        {overdue && <AlertCircle className="size-3.5 shrink-0 text-destructive" aria-label="Overdue" />}
                      </div>
                      <div className="text-xs text-muted-foreground">{format(new Date(d.created_at), "d MMM yyyy")}</div>
                    </td>
                    <td className="hidden px-4 py-3.5 text-muted-foreground sm:table-cell sm:px-5">{d.projects?.name ?? "—"}</td>
                    <td className="hidden px-4 py-3.5 md:table-cell sm:px-5">{d.designer?.full_name}</td>
                    <td className="hidden px-4 py-3.5 font-mono text-xs lg:table-cell sm:px-5">V{d.current_version}</td>
                    <td className="px-4 py-3.5 sm:px-5"><StatusBadge value={d.status} /></td>
                    <td className={`hidden px-4 py-3.5 text-xs sm:table-cell sm:px-5 ${overdue ? "font-semibold text-destructive" : "text-muted-foreground"}`}>
                      {dueDate && isValid(dueDate) ? format(dueDate, "d MMM yyyy") : "—"}
                    </td>
                    <td className="hidden px-4 py-3.5 text-muted-foreground md:table-cell sm:px-5">
                      {formatDistanceToNow(new Date(d.updated_at), { addSuffix: true })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function FilterBox({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      {children}
    </div>
  );
}
