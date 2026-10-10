import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useMe } from "@/lib/app";
import { uploadDesignFile, ACCEPT } from "@/lib/upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/designs/new")({
  head: () => ({ meta: [{ title: "New submission — DesignReview" }] }),
  component: NewDesign,
});

function NewDesign() {
  const { data: me } = useMe();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => (await supabase.from("projects").select("*").order("name")).data ?? [],
  });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectName, setProjectName] = useState("");
  const [figma, setFigma] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [due, setDue] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!me) return;
    if (!file && !figma) { toast.error("Add a file or a Figma link."); return; }
    setBusy(true);
    try {
      let projectId: string | null = null;
      const pn = projectName.trim();
      if (pn) {
        const existing = projects.find((p) => p.name.toLowerCase() === pn.toLowerCase());
        if (existing) projectId = existing.id;
        else {
          const { data, error } = await supabase.from("projects").insert({ name: pn, created_by: me.id }).select().single();
          if (error) throw error;
          projectId = data.id;
        }
      }
      const up = file ? await uploadDesignFile(me.id, file) : null;
      const { data: d, error } = await supabase
        .from("designs")
        .insert({ title, description, project_id: projectId, designer_id: me.id, due_date: due || null })
        .select()
        .single();
      if (error) throw error;
      const { error: vErr } = await supabase.from("design_versions").insert({
        design_id: d.id,
        version_number: 1,
        file_path: up?.path ?? null,
        file_type: up?.type ?? null,
        figma_url: figma || null,
        notes: description,
        created_by: me.id,
      });
      if (vErr) throw vErr;
      qc.invalidateQueries({ queryKey: ["designs"] });
      toast.success("Submitted for review");
      navigate({ to: "/designs/$id", params: { id: d.id } });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-8 py-10">
      <h1 className="text-3xl font-bold">New submission</h1>
      <p className="mt-1 text-muted-foreground">Share your design and tell reviewers what it's for.</p>
      <form onSubmit={submit} className="mt-8 space-y-5 rounded-xl border bg-card p-6 shadow-card">
        <div className="space-y-1.5">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Checkout page — mobile" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="project">Project</Label>
          <Input id="project" list="projects" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Pick or type a new project" />
          <datalist id="projects">
            {projects.map((p) => <option key={p.id} value={p.name} />)}
          </datalist>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="desc">Purpose & description</Label>
          <Textarea id="desc" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What problem does this solve? What should reviewers focus on?" />
        </div>
        <div className="space-y-1.5">
          <Label>Design file (image or PDF)</Label>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed bg-muted/40 p-8 text-sm text-muted-foreground hover:border-primary">
            <Upload className="size-6" />
            {file ? <span className="font-medium text-foreground">{file.name}</span> : "Click to choose a file (max 20 MB)"}
            <input type="file" accept={ACCEPT} className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </label>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="figma">Figma link</Label>
          <Input id="figma" type="url" value={figma} onChange={(e) => setFigma(e.target.value)} placeholder="https://figma.com/file/…" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="due">Review due by (optional)</Label>
          <Input id="due" type="date" className="w-48" value={due} onChange={(e) => setDue(e.target.value)} />
        </div>
        <Button type="submit" disabled={busy} className="w-full">
          {busy ? "Submitting…" : "Submit for review"}
        </Button>
      </form>
    </div>
  );
}
