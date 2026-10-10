import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { format, startOfWeek, subWeeks } from "date-fns";
import { Download } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { designsQuery } from "./dashboard";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/reports")({
  head: () => ({ meta: [{ title: "Reports — DesignReview" }] }),
  component: Reports,
});

function toCsv(rows: (string | number | null | undefined)[][], headers: string[]): string {
  const escape = (v: string | number | null | undefined) => {
    const s = v == null ? "" : String(v);
    return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n");
}

function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function Reports() {
  const { data: designs = [] } = useQuery(designsQuery);
  const { data: comments = [] } = useQuery({
    queryKey: ["all-comments"],
    queryFn: async () => (await supabase.from("comments").select("author_id, created_at, author:profiles(full_name)")).data ?? [],
  });

  const total = designs.length;
  const approved = designs.filter((d) => d.status === "approved").length;
  const rate = total ? Math.round((approved / total) * 100) : 0;
  const avgVersions = total ? (designs.reduce((s, d) => s + d.current_version, 0) / total).toFixed(1) : "0";
  const approvedDs = designs.filter((d) => d.approved_at);
  const avgDays = approvedDs.length
    ? (approvedDs.reduce((s, d) => s + (new Date(d.approved_at!).getTime() - new Date(d.created_at).getTime()), 0) / approvedDs.length / 86400000).toFixed(1)
    : "—";

  const pie = [
    { name: "Pending", value: designs.filter((d) => d.status === "pending").length, color: "var(--pending)" },
    { name: "Approved", value: approved, color: "var(--approved)" },
    { name: "Changes", value: designs.filter((d) => d.status === "changes_requested").length, color: "var(--changes)" },
  ];

  const weeks = Array.from({ length: 8 }, (_, i) => startOfWeek(subWeeks(new Date(), 7 - i)));
  const weekly = weeks.map((w, i) => {
    const end = weeks[i + 1] ?? new Date(8.64e15);
    return {
      week: format(w, "d MMM"),
      submissions: designs.filter((d) => new Date(d.created_at) >= w && new Date(d.created_at) < end).length,
      comments: comments.filter((c) => new Date(c.created_at) >= w && new Date(c.created_at) < end).length,
    };
  });

  const byDesigner = Object.values(
    designs.reduce<Record<string, { name: string; total: number; approved: number }>>((acc, d) => {
      const k = d.designer_id;
      acc[k] ??= { name: d.designer?.full_name ?? "—", total: 0, approved: 0 };
      acc[k]!.total++;
      if (d.status === "approved") acc[k]!.approved++;
      return acc;
    }, {}),
  ).sort((a, b) => b.total - a.total);

  const byReviewer = Object.values(
    comments.reduce<Record<string, { name: string; n: number }>>((acc, c) => {
      acc[c.author_id] ??= { name: c.author?.full_name ?? "—", n: 0 };
      acc[c.author_id]!.n++;
      return acc;
    }, {}),
  ).sort((a, b) => b.n - a.n);

  function exportDesignsCsv() {
    const csv = toCsv(
      designs.map((d) => [
        d.title,
        d.projects?.name ?? "",
        d.designer?.full_name ?? "",
        d.status,
        d.current_version,
        d.due_date ?? "",
        d.approved_at ? format(new Date(d.approved_at), "yyyy-MM-dd") : "",
        format(new Date(d.created_at), "yyyy-MM-dd"),
        format(new Date(d.updated_at), "yyyy-MM-dd"),
      ]),
      ["Title", "Project", "Designer", "Status", "Current Version", "Due Date", "Approved At", "Created At", "Updated At"],
    );
    downloadCsv(`designs-report-${format(new Date(), "yyyy-MM-dd")}.csv`, csv);
  }

  function exportActivityCsv() {
    const rows = weekly.map((w) => [w.week, w.submissions, w.comments]);
    const csv = toCsv(rows, ["Week", "Submissions", "Comments"]);
    downloadCsv(`activity-report-${format(new Date(), "yyyy-MM-dd")}.csv`, csv);
  }

  return (
    <div className="mx-auto max-w-6xl px-8 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="mt-1 text-muted-foreground">Team activity, review progress and approval rates.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportActivityCsv}>
            <Download className="mr-1.5 size-4" /> Activity CSV
          </Button>
          <Button variant="outline" size="sm" onClick={exportDesignsCsv}>
            <Download className="mr-1.5 size-4" /> Designs CSV
          </Button>
        </div>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        <Stat label="Approval rate" value={`${rate}%`} />
        <Stat label="Avg. versions per design" value={avgVersions} />
        <Stat label="Avg. days to approval" value={avgDays} />
        <Stat label="Total comments" value={comments.length} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card title="Last 8 weeks">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weekly}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="week" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis allowDecimals={false} stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Bar dataKey="submissions" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="comments" fill="var(--chart-4)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Status breakdown">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pie} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={2}>
                {pie.map((p) => <Cell key={p.name} fill={p.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex justify-center gap-4 text-xs">
            {pie.map((p) => (
              <span key={p.name} className="flex items-center gap-1.5"><span className="size-2 rounded-full" style={{ background: p.color }} />{p.name} {p.value}</span>
            ))}
          </div>
        </Card>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="By designer">
          <List rows={byDesigner.map((d) => [d.name, `${d.approved}/${d.total} approved`])} />
        </Card>
        <Card title="Most active commenters">
          <List rows={byReviewer.map((r) => [r.name, `${r.n} comments`])} />
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-card">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-3xl font-bold">{value}</div>
    </div>
  );
}
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-card">
      <h2 className="mb-4 font-semibold">{title}</h2>
      {children}
    </div>
  );
}
function List({ rows }: { rows: [string, string][] }) {
  if (!rows.length) return <p className="text-sm text-muted-foreground">No data yet.</p>;
  return (
    <ul className="divide-y text-sm">
      {rows.map(([a, b], i) => (
        <li key={i} className="flex justify-between py-2"><span>{a}</span><span className="text-muted-foreground">{b}</span></li>
      ))}
    </ul>
  );
}
