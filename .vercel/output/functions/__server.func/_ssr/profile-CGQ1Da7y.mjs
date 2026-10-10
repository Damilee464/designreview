import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-BJ-v0RHx.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { r as useMe } from "./app-BHbNCdDF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-CGQ1Da7y.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProfilePage() {
	const { data: me } = useMe();
	const qc = useQueryClient();
	const [name, setName] = (0, import_react.useState)(me?.name ?? "");
	const [savingName, setSavingName] = (0, import_react.useState)(false);
	const [currentPassword, setCurrentPassword] = (0, import_react.useState)("");
	const [newPassword, setNewPassword] = (0, import_react.useState)("");
	const [confirmPassword, setConfirmPassword] = (0, import_react.useState)("");
	const [savingPw, setSavingPw] = (0, import_react.useState)(false);
	(0, import_react.useState)(() => {
		if (me?.name && !name) setName(me.name);
	});
	async function saveName(e) {
		e.preventDefault();
		if (!name.trim() || !me) return;
		setSavingName(true);
		try {
			const { error } = await supabase.from("profiles").update({ full_name: name.trim() }).eq("id", me.id);
			if (error) throw error;
			await supabase.auth.updateUser({ data: { full_name: name.trim() } });
			qc.invalidateQueries({ queryKey: ["me"] });
			toast.success("Display name updated.");
		} catch (err) {
			toast.error(err.message);
		} finally {
			setSavingName(false);
		}
	}
	async function savePassword(e) {
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
			const { error: signInError } = await supabase.auth.signInWithPassword({
				email: me.email,
				password: currentPassword
			});
			if (signInError) throw new Error("Current password is incorrect.");
			const { error } = await supabase.auth.updateUser({ password: newPassword });
			if (error) throw error;
			toast.success("Password updated.");
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
		} catch (err) {
			toast.error(err.message);
		} finally {
			setSavingPw(false);
		}
	}
	if (!me) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-10 text-muted-foreground",
		children: "Loading…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl px-8 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold",
				children: "Profile settings"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-muted-foreground",
				children: "Update your display name and password."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 rounded-xl border bg-card p-6 shadow-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-semibold",
						children: "Account"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 space-y-1 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-muted-foreground",
							children: "Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: me.email
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 space-y-1 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-muted-foreground",
							children: ["Role", me.roles.length > 1 ? "s" : ""]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "capitalize font-medium",
							children: me.roles.join(", ")
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: saveName,
				className: "mt-6 rounded-xl border bg-card p-6 shadow-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-semibold",
						children: "Display name"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "display-name",
							children: "Full name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "display-name",
							value: name,
							onChange: (e) => setName(e.target.value),
							placeholder: "Your full name",
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "mt-4",
						disabled: savingName || !name.trim() || name.trim() === me.name,
						children: savingName ? "Saving…" : "Save name"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: savePassword,
				className: "mt-6 rounded-xl border bg-card p-6 shadow-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-semibold",
						children: "Change password"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "current-pw",
									children: "Current password"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "current-pw",
									type: "password",
									value: currentPassword,
									onChange: (e) => setCurrentPassword(e.target.value),
									required: true,
									autoComplete: "current-password"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "new-pw",
									children: "New password"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "new-pw",
									type: "password",
									minLength: 6,
									value: newPassword,
									onChange: (e) => setNewPassword(e.target.value),
									required: true,
									autoComplete: "new-password"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "confirm-pw",
									children: "Confirm new password"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "confirm-pw",
									type: "password",
									minLength: 6,
									value: confirmPassword,
									onChange: (e) => setConfirmPassword(e.target.value),
									required: true,
									autoComplete: "new-password"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "mt-4",
						disabled: savingPw || !currentPassword || !newPassword || !confirmPassword,
						children: savingPw ? "Updating…" : "Update password"
					})
				]
			})
		]
	});
}
//#endregion
export { ProfilePage as component };
