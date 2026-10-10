import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { format, formatDistanceToNow, isPast, isValid, parseISO } from "date-fns";
import { toast } from "sonner";
import { AlertCircle, ArrowLeft, Check, CornerDownRight, Download, ExternalLink, FileText, Pencil, RotateCcw, Trash2, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useMe, useSignedUrl, initials, type DesignStatus } from "@/lib/app";
import { uploadDesignFile, ACCEPT } from "@/lib/upload";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/designs/$id")({
  head: () => ({ meta: [{ title: "Review — DesignReview" }] }),
  component: ReviewPage,
});

function useDesign(id: string) {
  return useQuery({
    queryKey: ["design", id],
    queryFn: async () => {
      const [d, v, c, e, profiles] = await Promise.all([
        supabase
          .from("designs")
          .select("*, projects(name), designer:profiles!designs_designer_id_fkey(full_name), approver:profiles!designs_approved_by_fkey(full_name)")
          .eq("id", id)
          .single(),
        supabase.from("design_versions").select("*").eq("design_id", id).order("version_number"),
        supabase.from("comments").select("*, author:profiles(full_name)").eq("design_id", id).order("created_at"),
        supabase.from("design_events").select("*, actor:profiles(full_name)").eq("design_id", id).order("created_at", { ascending: false }),
        supabase.from("profiles").select("id, full_name"),
      ]);
      if (d.error) throw d.error;
      return {
        design: d.data,
        versions: v.data ?? [],
        comments: c.data ?? [],
        events: e.data ?? [],
        profiles: profiles.data ?? [],
      };
    },
  });
}

// ── @mention composer ────────────────────────────────────────────────────────
function MentionComposer({
  value,
  onChange,
  onKeyDown,
  placeholder,
  rows,
  textareaRef,
  profiles,
}: {
  value: string;
  onChange: (val: string, mentionIds: string[]) => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
  rows?: number;
  textareaRef?: React.RefObject<HTMLTextAreaElement>;
  profiles: { id: string; full_name: string }[];
}) {
  const [mentionSearch, setMentionSearch] = useState<string | null>(null);
  const [caretPos, setCaretPos] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const mentionMatches = useMemo(() => {
    if (mentionSearch === null) return [];
    return profiles.filter((p) =>
      p.full_name.toLowerCase().includes(mentionSearch.toLowerCase()),
    ).slice(0, 6);
  }, [mentionSearch, profiles]);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value;
    const pos = e.target.selectionStart ?? 0;
    setCaretPos(pos);

    // Find @word before caret
    const before = val.slice(0, pos);
    const match = before.match(/@(\w*)$/);
    setMentionSearch(match ? match[1] : null);

    // Re-extract mentions from final text
    const ids = extractMentionIds(val, profiles);
    onChange(val, ids);
  }

  function pickMention(profile: { id: string; full_name: string }) {
    const before = value.slice(0, caretPos);
    const after = value.slice(caretPos);
    const replaced = before.replace(/@(\w*)$/, `@${profile.full_name.replace(/ /g, "_")} `);
    const next = replaced + after;
    const ids = extractMentionIds(next, profiles);
    onChange(next, ids);
    setMentionSearch(null);
    setTimeout(() => textareaRef?.current?.focus(), 0);
  }

  return (
    <div ref={containerRef} className="relative">
      <Textarea
        ref={textareaRef}
        rows={rows ?? 3}
        value={value}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (mentionMatches.length > 0 && (e.key === "Escape")) {
            setMentionSearch(null);
            return;
          }
          onKeyDown?.(e);
        }}
        placeholder={placeholder}
        className="resize-none"
      />
      {mentionSearch !== null && mentionMatches.length > 0 && (
        <ul className="absolute bottom-full left-0 z-50 mb-1 w-56 overflow-hidden rounded-lg border bg-card shadow-card">
          {mentionMatches.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent"
                onMouseDown={(e) => { e.preventDefault(); pickMention(p); }}
              >
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-secondary text-[10px] font-semibold">
                  {initials(p.full_name)}
                </span>
                {p.full_name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function extractMentionIds(text: string, profiles: { id: string; full_name: string }[]) {
  const ids: string[] = [];
  for (const p of profiles) {
    const tag = "@" + p.full_name.replace(/ /g, "_");
    if (text.includes(tag)) ids.push(p.id);
  }
  return ids;
}

// ── Main ReviewPage ───────────────────────────────────────────────────────────
function ReviewPage() {
  const { id } = Route.useParams();
  const { data: me } = useMe();
  const qc = useQueryClient();
  const { data, isLoading } = useDesign(id);
  const [versionNo, setVersionNo] = useState<number | null>(null);
  const [draftPin, setDraftPin] = useState<{ x: number; y: number } | null>(null);
  const [activePin, setActivePin] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [mentionIds, setMentionIds] = useState<string[]>([]);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [showResolved, setShowResolved] = useState(false);
  const composerRef = useRef<HTMLTextAreaElement>(null);

  const design = data?.design;
  const versions = data?.versions ?? [];
  const profiles = data?.profiles ?? [];
  const current = versions.find((v) => v.version_number === (versionNo ?? design?.current_version)) ?? versions[versions.length - 1];
  const { data: fileUrl } = useSignedUrl(current?.file_path);

  useEffect(() => { setDraftPin(null); }, [current?.id]);

  const versionComments = useMemo(
    () => (data?.comments ?? []).filter((c) => c.version_id === current?.id),
    [data, current],
  );
  const topLevel = versionComments.filter((c) => !c.parent_id && (showResolved || !c.resolved));
  const pinNumbers = useMemo(() => {
    const m = new Map<string, number>();
    versionComments.filter((c) => !c.parent_id && c.pin_x != null).forEach((c, i) => m.set(c.id, i + 1));
    return m;
  }, [versionComments]);

  const resolvedCount = versionComments.filter((c) => !c.parent_id && c.resolved).length;

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["design", id] });
    qc.invalidateQueries({ queryKey: ["designs"] });
  };

  if (isLoading || !design || !me) return <div className="p-10 text-muted-foreground">Loading…</div>;
  const isOwner = design.designer_id === me.id;
  const isLatest = current?.version_number === design.current_version;

  // Due date helpers
  const dueDate = design.due_date ? parseISO(design.due_date) : null;
  const isOverdue = dueDate && isValid(dueDate) && isPast(dueDate) && design.status !== "approved";

  function onCanvasClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!isLatest) { toast.info("Switch to the latest version to add pins."); return; }
    const r = e.currentTarget.getBoundingClientRect();
    setDraftPin({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
    setReplyTo(null);
    setTimeout(() => composerRef.current?.focus(), 0);
  }

  async function postComment() {
    if (!text.trim() || !current) return;
    const { error } = await supabase.from("comments").insert({
      design_id: id,
      version_id: current.id,
      author_id: me!.id,
      body: text.trim(),
      parent_id: replyTo,
      pin_x: replyTo ? null : draftPin?.x ?? null,
      pin_y: replyTo ? null : draftPin?.y ?? null,
      mentions: mentionIds,
    });
    if (error) { toast.error(error.message); return; }
    setText("");
    setMentionIds([]);
    setDraftPin(null);
    setReplyTo(null);
    refresh();
  }

  async function setStatus(s: DesignStatus) {
    const { error } = await supabase.from("designs").update({ status: s }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Status updated");
    refresh();
  }

  async function toggleResolved(cid: string, v: boolean) {
    await supabase.from("comments").update({ resolved: v }).eq("id", cid);
    refresh();
  }

  async function deleteComment(cid: string) {
    const { error } = await supabase.from("comments").delete().eq("id", cid);
    if (error) { toast.error(error.message); return; }
    refresh();
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center gap-4 border-b bg-card px-6 py-4">
        <Link to="/dashboard" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="size-5" /></Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <h1 className="truncate text-xl font-bold">{design.title}</h1>
            <StatusBadge value={design.status} />
            {isOverdue && (
              <span className="flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                <AlertCircle className="size-3" /> Overdue
              </span>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {design.projects?.name ?? "No project"} · by {design.designer?.full_name}
            {design.status === "approved" && design.approved_at && (
              <> · approved by {design.approver?.full_name} on {format(new Date(design.approved_at), "d MMM yyyy, HH:mm")}</>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
          {versions.map((v) => (
            <button
              key={v.id}
              onClick={() => setVersionNo(v.version_number)}
              className={`rounded-md px-2.5 py-1 font-mono text-xs ${v.id === current?.id ? "bg-card shadow-card" : "text-muted-foreground"}`}
            >
              V{v.version_number}
            </button>
          ))}
        </div>
        {me.isStaff && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setStatus("changes_requested")} disabled={design.status === "changes_requested"}>
              <RotateCcw /> Request changes
            </Button>
            <Button size="sm" onClick={() => setStatus("approved")} disabled={design.status === "approved"}>
              <Check /> Approve
            </Button>
          </div>
        )}
        {isOwner && <NewVersionDialog designId={id} next={design.current_version + 1} userId={me.id} onDone={() => { setVersionNo(null); refresh(); }} />}
      </header>

      <div className="flex min-h-0 flex-1">
        <section className="min-w-0 flex-1 overflow-auto bg-muted bg-grid p-8">
          {current?.figma_url && (
            <a href={current.figma_url} target="_blank" rel="noreferrer" className="mb-4 inline-flex items-center gap-2 rounded-md border bg-card px-3 py-1.5 text-sm hover:text-primary">
              <ExternalLink className="size-4" /> Open in Figma
            </a>
          )}
          {current?.file_type === "image" && fileUrl ? (
            <div className="relative mx-auto w-fit cursor-crosshair" onClick={onCanvasClick}>
              <img src={fileUrl} alt={design.title} className="block max-w-full rounded-lg shadow-card" draggable={false} />
              {versionComments.filter((c) => !c.parent_id && c.pin_x != null).map((c) => (
                <button
                  key={c.id}
                  onClick={(e) => { e.stopPropagation(); setActivePin(c.id); document.getElementById("c-" + c.id)?.scrollIntoView({ behavior: "smooth", block: "center" }); }}
                  className={`absolute grid size-7 -translate-x-1/2 -translate-y-full place-items-center rounded-full rounded-bl-none text-xs font-bold shadow-pin transition-transform hover:scale-110 ${c.resolved ? "bg-approved text-primary-foreground" : "bg-primary text-primary-foreground"} ${activePin === c.id ? "scale-125 ring-2 ring-ink" : ""}`}
                  style={{ left: `${c.pin_x}%`, top: `${c.pin_y}%` }}
                >
                  {pinNumbers.get(c.id)}
                </button>
              ))}
              {draftPin && (
                <span className="absolute grid size-7 -translate-x-1/2 -translate-y-full animate-pulse place-items-center rounded-full rounded-bl-none bg-ink text-xs font-bold text-ink-foreground" style={{ left: `${draftPin.x}%`, top: `${draftPin.y}%` }}>
                  +
                </span>
              )}
            </div>
          ) : current?.file_type === "pdf" && fileUrl ? (
            <div className="h-full min-h-[600px]">
              <iframe src={fileUrl} title={design.title} className="h-full w-full rounded-lg border bg-card" />
            </div>
          ) : (
            <div className="grid h-80 place-items-center rounded-lg border bg-card text-muted-foreground">
              <div className="text-center"><FileText className="mx-auto mb-2 size-8" />No file — review via the Figma link.</div>
            </div>
          )}
          {current?.file_type === "image" && (
            <p className="mt-4 text-center text-xs text-muted-foreground">Click anywhere on the design to pin a comment.</p>
          )}
        </section>

        <aside className="flex w-[380px] shrink-0 flex-col border-l bg-card">
          <Tabs defaultValue="comments" className="flex min-h-0 flex-1 flex-col">
            <TabsList className="mx-4 mt-4">
              <TabsTrigger value="comments">Comments ({versionComments.filter((c) => !c.parent_id).length})</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <TabsContent value="comments" className="flex min-h-0 flex-1 flex-col">
              {/* Resolve filter */}
              {resolvedCount > 0 && (
                <div className="flex items-center justify-end border-b px-4 py-2">
                  <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={showResolved}
                      onChange={(e) => setShowResolved(e.target.checked)}
                      className="accent-primary"
                    />
                    Show {resolvedCount} resolved
                  </label>
                </div>
              )}
              <div className="flex-1 space-y-3 overflow-auto p-4">
                {topLevel.length === 0 && (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    {resolvedCount > 0 && !showResolved
                      ? "All comments are resolved."
                      : `No feedback on V${current?.version_number} yet.`}
                  </p>
                )}
                {topLevel.map((c) => (
                  <div
                    key={c.id}
                    id={"c-" + c.id}
                    onMouseEnter={() => setActivePin(c.id)}
                    className={`rounded-lg border p-3 transition-colors ${activePin === c.id ? "border-primary" : ""} ${c.resolved ? "opacity-60" : ""}`}
                  >
                    <CommentRow
                      c={c}
                      pin={pinNumbers.get(c.id)}
                      canEdit={c.author_id === me.id}
                      canDelete={c.author_id === me.id || me.isStaff}
                      onDelete={() => deleteComment(c.id)}
                      onEdited={refresh}
                    />
                    {versionComments.filter((r) => r.parent_id === c.id).map((r) => (
                      <div key={r.id} className="mt-3 flex gap-2 border-l-2 pl-3">
                        <CornerDownRight className="mt-1 size-3 shrink-0 text-muted-foreground" />
                        <CommentRow
                          c={r}
                          canEdit={r.author_id === me.id}
                          canDelete={r.author_id === me.id || me.isStaff}
                          onDelete={() => deleteComment(r.id)}
                          onEdited={refresh}
                        />
                      </div>
                    ))}
                    <div className="mt-2 flex gap-3 text-xs">
                      <button className="text-muted-foreground hover:text-foreground" onClick={() => { setReplyTo(c.id); setDraftPin(null); composerRef.current?.focus(); }}>Reply</button>
                      {(me.isStaff || c.author_id === me.id) && (
                        <button className="text-muted-foreground hover:text-foreground" onClick={() => toggleResolved(c.id, !c.resolved)}>
                          {c.resolved ? "Reopen" : "Resolve"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t p-4">
                {(draftPin || replyTo) && (
                  <div className="mb-2 flex items-center justify-between rounded-md bg-accent px-2 py-1 text-xs text-accent-foreground">
                    {replyTo ? "Replying to comment" : "New pinned comment"}
                    <button onClick={() => { setDraftPin(null); setReplyTo(null); }}><X className="size-3" /></button>
                  </div>
                )}
                <MentionComposer
                  value={text}
                  onChange={(val, ids) => { setText(val); setMentionIds(ids); }}
                  onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) postComment(); }}
                  placeholder={draftPin ? "What should change here? Use @ to mention someone." : "Leave general feedback… Use @ to mention."}
                  rows={3}
                  textareaRef={composerRef}
                  profiles={profiles}
                />
                <Button className="mt-2 w-full" size="sm" onClick={postComment} disabled={!text.trim()}>Post</Button>
              </div>
            </TabsContent>
            <TabsContent value="details" className="overflow-auto p-4 text-sm">
              <h3 className="font-semibold">Purpose</h3>
              <p className="mt-1 whitespace-pre-wrap text-muted-foreground">{design.description || "—"}</p>
              <h3 className="mt-5 font-semibold">V{current?.version_number} notes</h3>
              <p className="mt-1 whitespace-pre-wrap text-muted-foreground">{current?.notes || "—"}</p>
              {dueDate && isValid(dueDate) && (
                <div className={`mt-5 flex items-center gap-2 rounded-lg border p-3 ${isOverdue ? "border-destructive/30 bg-destructive/5" : "bg-muted/40"}`}>
                  <AlertCircle className={`size-4 shrink-0 ${isOverdue ? "text-destructive" : "text-muted-foreground"}`} />
                  <div>
                    <div className={`text-xs font-medium ${isOverdue ? "text-destructive" : "text-muted-foreground"}`}>
                      {isOverdue ? "Overdue" : "Due date"}
                    </div>
                    <div className="font-semibold">{format(dueDate, "d MMM yyyy")}</div>
                  </div>
                </div>
              )}
              {me.isStaff && design.status !== "pending" && (
                <Button variant="outline" size="sm" className="mt-6" onClick={() => setStatus("pending")}>Move back to pending</Button>
              )}
            </TabsContent>
            <TabsContent value="history" className="overflow-auto p-4">
              <div className="mb-3 flex justify-end">
                <button
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    const rows = [["Actor", "Event", "Detail", "Date"]];
                    for (const ev of data!.events) {
                      rows.push([
                        ev.actor?.full_name ?? "System",
                        ev.kind,
                        ev.detail,
                        format(new Date(ev.created_at), "yyyy-MM-dd HH:mm"),
                      ]);
                    }
                    const csv = rows.map((r) => r.map((v) => (v.includes(",") ? `"${v}"` : v)).join(",")).join("\n");
                    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${design.title}-history.csv`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  <Download className="size-3.5" /> Export CSV
                </button>
              </div>
              <ol className="relative space-y-4 border-l pl-5">
                {data!.events.map((ev) => (
                  <li key={ev.id} className="text-sm">
                    <span className="absolute -left-1.5 mt-1.5 size-3 rounded-full border-2 border-card bg-primary" />
                    <div>
                      <span className="font-medium">{ev.actor?.full_name ?? "System"}</span>{" "}
                      {ev.kind === "submitted" && "submitted V1"}
                      {ev.kind === "version" && `uploaded ${ev.detail.toUpperCase()}`}
                      {ev.kind === "status" && <>set status to <StatusBadge value={ev.detail as DesignStatus} /></>}
                    </div>
                    <div className="text-xs text-muted-foreground">{format(new Date(ev.created_at), "d MMM yyyy, HH:mm")}</div>
                  </li>
                ))}
              </ol>
            </TabsContent>
          </Tabs>
        </aside>
      </div>
    </div>
  );
}

// ── CommentRow with edit/delete ───────────────────────────────────────────────
function CommentRow({
  c,
  pin,
  canEdit,
  canDelete,
  onDelete,
  onEdited,
}: {
  c: { id: string; body: string; created_at: string; author: { full_name: string } | null; author_id: string };
  pin?: number;
  canEdit: boolean;
  canDelete: boolean;
  onDelete: () => void;
  onEdited: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(c.body);
  const [saving, setSaving] = useState(false);

  async function saveEdit() {
    if (!editText.trim()) return;
    setSaving(true);
    const { error } = await supabase.from("comments").update({ body: editText.trim() }).eq("id", c.id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    setEditing(false);
    onEdited();
  }

  return (
    <div className="flex min-w-0 flex-1 gap-2">
      {pin != null ? (
        <span className="grid size-6 shrink-0 place-items-center rounded-full rounded-bl-none bg-primary text-[11px] font-bold text-primary-foreground">{pin}</span>
      ) : (
        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-secondary text-[10px] font-semibold">{initials(c.author?.full_name ?? "")}</span>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2 text-xs">
          <div>
            <span className="font-semibold">{c.author?.full_name}</span>{" "}
            <span className="text-muted-foreground">{formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}</span>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {canEdit && !editing && (
              <button
                aria-label="Edit comment"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => { setEditText(c.body); setEditing(true); }}
              >
                <Pencil className="size-3" />
              </button>
            )}
            {canDelete && !editing && (
              <button
                aria-label="Delete comment"
                className="text-muted-foreground hover:text-destructive"
                onClick={onDelete}
              >
                <Trash2 className="size-3" />
              </button>
            )}
          </div>
        </div>
        {editing ? (
          <div className="mt-1 space-y-1">
            <Textarea
              rows={2}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              autoFocus
              className="text-sm"
            />
            <div className="flex gap-2">
              <Button size="sm" className="h-6 px-2 text-xs" onClick={saveEdit} disabled={saving}>Save</Button>
              <Button size="sm" variant="ghost" className="h-6 px-2 text-xs" onClick={() => setEditing(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <p className="mt-0.5 whitespace-pre-wrap text-sm">{c.body}</p>
        )}
      </div>
    </div>
  );
}

function NewVersionDialog({ designId, next, userId, onDone }: { designId: string; next: number; userId: string; onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [figma, setFigma] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!file && !figma) { toast.error("Add a file or Figma link."); return; }
    setBusy(true);
    try {
      const up = file ? await uploadDesignFile(userId, file) : null;
      const { error } = await supabase.from("design_versions").insert({
        design_id: designId, version_number: next, file_path: up?.path ?? null, file_type: up?.type ?? null,
        figma_url: figma || null, notes, created_by: userId,
      });
      if (error) throw error;
      toast.success(`V${next} sent for review`);
      setOpen(false); setFile(null); setFigma(""); setNotes("");
      onDone();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Upload /> Upload V{next}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Resubmit as V{next}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>File</Label>
            <Input type="file" accept={ACCEPT} onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </div>
          <div className="space-y-1.5">
            <Label>Figma link</Label>
            <Input type="url" value={figma} onChange={(e) => setFigma(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>What changed?</Label>
            <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Addressed spacing (pin 1), new mobile layout (pin 2)…" />
          </div>
          <Button className="w-full" onClick={submit} disabled={busy}>{busy ? "Uploading…" : "Send for review"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
