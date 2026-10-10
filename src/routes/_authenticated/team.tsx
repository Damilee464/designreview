import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useMe, initials, type Role } from "@/lib/app";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/team")({
  head: () => ({ meta: [{ title: "Team — DesignReview" }] }),
  component: Team,
});

function Team() {
  const { data: me } = useMe();
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["team"],
    queryFn: async () => {
      const [p, r, pr] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at"),
        supabase.from("user_roles").select("*"),
        supabase.from("projects").select("*").order("name"),
      ]);
      return { profiles: p.data ?? [], roles: r.data ?? [], projects: pr.data ?? [] };
    },
  });
  const [newProject, setNewProject] = useState("");

  if (!me?.isAdmin) return <div className="p-10 text-muted-foreground">Only admins can manage the team.</div>;

  async function setRole(userId: string, role: Role) {
    await supabase.from("user_roles").delete().eq("user_id", userId);
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
    if (error) toast.error(error.message);
    else toast.success("Role updated");
    qc.invalidateQueries({ queryKey: ["team"] });
    qc.invalidateQueries({ queryKey: ["me"] });
  }
  async function addProject() {
    if (!newProject.trim()) return;
    const { error } = await supabase.from("projects").insert({ name: newProject.trim(), created_by: me!.id });
    if (error) { toast.error(error.message); return; }
    setNewProject("");
    qc.invalidateQueries({ queryKey: ["team"] });
    qc.invalidateQueries({ queryKey: ["projects"] });
  }
  async function delProject(id: string) {
    await supabase.from("projects").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["team"] });
    qc.invalidateQueries({ queryKey: ["projects"] });
  }

  return (
    <div className="mx-auto max-w-5xl px-8 py-10">
      <h1 className="text-3xl font-bold">Team</h1>
      <p className="mt-1 text-muted-foreground">Designers submit, reviewers approve, admins manage everything.</p>
      <div className="mt-8 divide-y rounded-xl border bg-card shadow-card">
        {data?.profiles.map((p) => {
          const role = data.roles.find((r) => r.user_id === p.id)?.role ?? "designer";
          return (
            <div key={p.id} className="flex items-center gap-4 p-4">
              <span className="grid size-9 place-items-center rounded-full bg-secondary text-xs font-semibold">{initials(p.full_name)}</span>
              <div className="flex-1">
                <div className="font-medium">{p.full_name} {p.id === me.id && <span className="text-xs text-muted-foreground">(you)</span>}</div>
                <div className="text-sm text-muted-foreground">{p.email}</div>
              </div>
              <Select value={role} onValueChange={(v) => setRole(p.id, v as Role)} disabled={p.id === me.id}>
                <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="designer">Designer</SelectItem>
                  <SelectItem value="reviewer">Reviewer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          );
        })}
      </div>

      <h2 className="mt-12 text-xl font-bold">Projects</h2>
      <div className="mt-4 flex gap-2">
        <Input value={newProject} onChange={(e) => setNewProject(e.target.value)} placeholder="New project name" className="max-w-xs bg-card" />
        <Button onClick={addProject}>Add</Button>
      </div>
      <ul className="mt-4 divide-y rounded-xl border bg-card shadow-card">
        {data?.projects.length === 0 && <li className="p-4 text-sm text-muted-foreground">No projects yet.</li>}
        {data?.projects.map((p) => (
          <li key={p.id} className="flex items-center justify-between p-4">
            {p.name}
            <button onClick={() => delProject(p.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="size-4" /></button>
          </li>
        ))}
      </ul>
    </div>
  );
}
