import { createFileRoute, Link, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, LayoutGrid, LogOut, Moon, Plus, BarChart3, Settings, Sun, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useMe, initials } from "@/lib/app";
import { Button } from "@/components/ui/button";
import { useDarkMode } from "@/hooks/use-dark-mode";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth" });
  },
  component: AppShell,
});

function AppShell() {
  const { data: me } = useMe();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [dark, setDark] = useDarkMode();
  const [confirmSignOut, setConfirmSignOut] = useState(false);

  const { data: unread = 0 } = useQuery({
    queryKey: ["unread"],
    enabled: !!me,
    queryFn: async () => {
      const { count } = await supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("read", false);
      return count ?? 0;
    },
  });

  useEffect(() => {
    if (!me) return;
    const ch = supabase
      .channel("notif-" + me.id)
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${me.id}` }, () => {
        qc.invalidateQueries({ queryKey: ["unread"] });
        qc.invalidateQueries({ queryKey: ["notifications"] });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [me, qc]);

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }
  const nav = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutGrid, show: true },
    { to: "/notifications", label: "Notifications", icon: Bell, show: true, badge: unread },
    { to: "/reports", label: "Reports", icon: BarChart3, show: !!me?.isStaff },
    { to: "/team", label: "Team", icon: Users, show: !!me?.isAdmin },
  ] as const;

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col bg-sidebar p-4 text-sidebar-foreground">
        <Link to="/" className="flex items-center gap-2 px-2 py-2 font-display text-lg font-bold text-sidebar-accent-foreground hover:opacity-80 transition-opacity">
          <span className="grid size-7 place-items-center rounded-md bg-sidebar-primary text-sm text-sidebar-primary-foreground">D</span>
          DesignReview
        </Link>
        <Button asChild className="mt-6">
          <Link to="/designs/new">
            <Plus /> New submission
          </Link>
        </Button>
        <nav className="mt-6 flex flex-col gap-1">
          {nav.filter((n) => n.show).map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}
            >
              <n.icon className="size-4" />
              <span className="flex-1">{n.label}</span>
              {"badge" in n && n.badge > 0 && (
                <span className="rounded-full bg-sidebar-primary px-1.5 text-xs font-semibold text-sidebar-primary-foreground">
                  {n.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Dark mode toggle */}
        <div className="mt-auto mb-2 flex items-center justify-between rounded-md px-3 py-2 text-sm text-sidebar-foreground">
          <span className="flex items-center gap-2">
            {dark ? <Moon className="size-4" /> : <Sun className="size-4" />}
            {dark ? "Dark mode" : "Light mode"}
          </span>
          <button
            aria-label="Toggle dark mode"
            onClick={() => setDark((d) => !d)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none ${dark ? "bg-sidebar-primary" : "bg-sidebar-accent"}`}
          >
            <span
              className={`pointer-events-none inline-block size-4 rounded-full bg-white shadow-sm transition-transform ${dark ? "translate-x-4" : "translate-x-0"}`}
            />
          </button>
        </div>

        {/* User card */}
        <div className="flex items-center gap-3 rounded-lg border border-sidebar-border p-3">
          <span className="grid size-8 place-items-center rounded-full bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground">
            {initials(me?.name ?? "")}
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm text-sidebar-accent-foreground">{me?.name}</div>
            <div className="text-xs capitalize">{me?.roles.join(", ")}</div>
          </div>
          <Link to="/profile" aria-label="Profile settings" className="hover:text-sidebar-accent-foreground">
            <Settings className="size-4" />
          </Link>
          <button onClick={() => setConfirmSignOut(true)} aria-label="Sign out" className="hover:text-sidebar-accent-foreground">
            <LogOut className="size-4" />
          </button>
        </div>
      </aside>
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>

      {/* Sign out confirmation */}
      <AlertDialog open={confirmSignOut} onOpenChange={setConfirmSignOut}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out?</AlertDialogTitle>
            <AlertDialogDescription>
              You'll need to sign in again to access your workspace.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={signOut}>Sign out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
