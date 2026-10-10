import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useMe } from "@/lib/app";

export const Route = createFileRoute("/_authenticated/notifications")({
  head: () => ({ meta: [{ title: "Notifications — DesignReview" }] }),
  component: Notifications,
});

function Notifications() {
  const qc = useQueryClient();
  const { data: me } = useMe();
  const { data = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () =>
      (await supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(100)).data ?? [],
  });

  const unreadCount = data.filter((n) => !n.read).length;

  async function markAll() {
    if (!me) return;
    await supabase.from("notifications").update({ read: true }).eq("user_id", me.id).eq("read", false);
    qc.invalidateQueries({ queryKey: ["notifications"] });
    qc.invalidateQueries({ queryKey: ["unread"] });
  }

  async function markOne(id: string) {
    // Optimistically update the cache so the dot disappears immediately
    qc.setQueryData<typeof data>(["notifications"], (old) =>
      old ? old.map((n) => (n.id === id ? { ...n, read: true } : n)) : old,
    );
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["unread"] });
  }

  return (
    <div className="mx-auto max-w-3xl px-8 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <p className="mt-1 text-sm text-muted-foreground">{unreadCount} unread</p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAll}>Mark all read</Button>
        )}
      </div>
      <div className="mt-8 divide-y rounded-xl border bg-card shadow-card">
        {data.length === 0 && (
          <div className="p-10 text-center text-muted-foreground">You're all caught up.</div>
        )}
        {data.map((n) => (
          <div
            key={n.id}
            onClick={() => { if (!n.read) markOne(n.id); }}
            className={`flex cursor-pointer items-start gap-3 p-4 transition-colors hover:bg-muted/40 ${!n.read ? "bg-primary/5" : ""}`}
          >
            <span className={`mt-1.5 size-2 shrink-0 rounded-full transition-colors ${n.read ? "bg-transparent" : "bg-primary"}`} />
            <div className="flex-1">
              {n.design_id ? (
                <Link
                  to="/designs/$id"
                  params={{ id: n.design_id }}
                  onClick={(e) => e.stopPropagation()}
                  className={`hover:text-primary ${!n.read ? "font-medium" : ""}`}
                >
                  {n.message}
                </Link>
              ) : (
                <span className={!n.read ? "font-medium" : ""}>{n.message}</span>
              )}
              <div className="mt-0.5 text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                {!n.read && <span className="ml-2 text-primary">· Click to mark as read</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
