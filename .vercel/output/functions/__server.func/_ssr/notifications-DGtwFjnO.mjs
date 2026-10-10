import { t as supabase } from "./client-BJ-v0RHx.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { r as useMe } from "./app-BHbNCdDF.mjs";
import { i as formatDistanceToNow } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notifications-DGtwFjnO.js
var import_jsx_runtime = require_jsx_runtime();
function Notifications() {
	const qc = useQueryClient();
	const { data: me } = useMe();
	const { data = [] } = useQuery({
		queryKey: ["notifications"],
		queryFn: async () => (await supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(100)).data ?? []
	});
	const unreadCount = data.filter((n) => !n.read).length;
	async function markAll() {
		if (!me) return;
		await supabase.from("notifications").update({ read: true }).eq("user_id", me.id).eq("read", false);
		qc.invalidateQueries({ queryKey: ["notifications"] });
		qc.invalidateQueries({ queryKey: ["unread"] });
	}
	async function markOne(id) {
		qc.setQueryData(["notifications"], (old) => old ? old.map((n) => n.id === id ? {
			...n,
			read: true
		} : n) : old);
		await supabase.from("notifications").update({ read: true }).eq("id", id);
		qc.invalidateQueries({ queryKey: ["unread"] });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-8 py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold",
				children: "Notifications"
			}), unreadCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: [unreadCount, " unread"]
			})] }), unreadCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				size: "sm",
				onClick: markAll,
				children: "Mark all read"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 divide-y rounded-xl border bg-card shadow-card",
			children: [data.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-10 text-center text-muted-foreground",
				children: "You're all caught up."
			}), data.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				onClick: () => {
					if (!n.read) markOne(n.id);
				},
				className: `flex cursor-pointer items-start gap-3 p-4 transition-colors hover:bg-muted/40 ${!n.read ? "bg-primary/5" : ""}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `mt-1.5 size-2 shrink-0 rounded-full transition-colors ${n.read ? "bg-transparent" : "bg-primary"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1",
					children: [n.design_id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/designs/$id",
						params: { id: n.design_id },
						onClick: (e) => e.stopPropagation(),
						className: `hover:text-primary ${!n.read ? "font-medium" : ""}`,
						children: n.message
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: !n.read ? "font-medium" : "",
						children: n.message
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-0.5 text-xs text-muted-foreground",
						children: [formatDistanceToNow(new Date(n.created_at), { addSuffix: true }), !n.read && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-2 text-primary",
							children: "· Click to mark as read"
						})]
					})]
				})]
			}, n.id))]
		})]
	});
}
//#endregion
export { Notifications as component };
