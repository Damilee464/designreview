import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useMe } from "@/lib/app";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "Profile — DesignReview" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { data: me } = useMe();
  const qc = useQueryClient();

  // Display name form
  const [name, setName] = useState(me?.name ?? "");
  const [savingName, setSavingName] = useState(false);

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPw, setSavingPw] = useState(false);

  // Sync name field once me loads
  useState(() => {
    if (me?.name && !name) setName(me.name);
  });

  async function saveName(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !me) return;
    setSavingName(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: name.trim() })
        .eq("id", me.id);
      if (error) throw error;
      // Also update auth user metadata
      await supabase.auth.updateUser({ data: { full_name: name.trim() } });
      qc.invalidateQueries({ queryKey: ["me"] });
      toast.success("Display name updated.");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSavingName(false);
    }
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setSavingPw(true);
    try {
      // Re-authenticate first to verify current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: me!.email,
        password: currentPassword,
      });
      if (signInError) throw new Error("Current password is incorrect.");

      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success("Password updated.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSavingPw(false);
    }
  }

  if (!me) return <div className="p-10 text-muted-foreground">Loading…</div>;

  return (
    <div className="mx-auto max-w-2xl px-8 py-10">
      <h1 className="text-3xl font-bold">Profile settings</h1>
      <p className="mt-1 text-muted-foreground">Update your display name and password.</p>

      {/* Account info */}
      <div className="mt-8 rounded-xl border bg-card p-6 shadow-card">
        <h2 className="font-semibold">Account</h2>
        <div className="mt-4 space-y-1 text-sm">
          <div className="text-muted-foreground">Email</div>
          <div className="font-medium">{me.email}</div>
        </div>
        <div className="mt-3 space-y-1 text-sm">
          <div className="text-muted-foreground">Role{me.roles.length > 1 ? "s" : ""}</div>
          <div className="capitalize font-medium">{me.roles.join(", ")}</div>
        </div>
      </div>

      {/* Display name */}
      <form onSubmit={saveName} className="mt-6 rounded-xl border bg-card p-6 shadow-card">
        <h2 className="font-semibold">Display name</h2>
        <div className="mt-4 space-y-1.5">
          <Label htmlFor="display-name">Full name</Label>
          <Input
            id="display-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            required
          />
        </div>
        <Button type="submit" className="mt-4" disabled={savingName || !name.trim() || name.trim() === me.name}>
          {savingName ? "Saving…" : "Save name"}
        </Button>
      </form>

      {/* Password */}
      <form onSubmit={savePassword} className="mt-6 rounded-xl border bg-card p-6 shadow-card">
        <h2 className="font-semibold">Change password</h2>
        <div className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="current-pw">Current password</Label>
            <Input
              id="current-pw"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new-pw">New password</Label>
            <Input
              id="new-pw"
              type="password"
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm-pw">Confirm new password</Label>
            <Input
              id="confirm-pw"
              type="password"
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
        </div>
        <Button type="submit" className="mt-4" disabled={savingPw || !currentPassword || !newPassword || !confirmPassword}>
          {savingPw ? "Updating…" : "Update password"}
        </Button>
      </form>
    </div>
  );
}
