import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-BJ-v0RHx.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as Trash2 } from "../_libs/lucide-react.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as initials, r as useMe } from "./app-BHbNCdDF.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/team-DNT4if6X.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Team() {
	const { data: me } = useMe();
	const qc = useQueryClient();
	const { data } = useQuery({
		queryKey: ["team"],
		queryFn: async () => {
			const [p, r, pr] = await Promise.all([
				supabase.from("profiles").select("*").order("created_at"),
				supabase.from("user_roles").select("*"),
				supabase.from("projects").select("*").order("name")
			]);
			return {
				profiles: p.data ?? [],
				roles: r.data ?? [],
				projects: pr.data ?? []
			};
		}
	});
	const [newProject, setNewProject] = (0, import_react.useState)("");
	if (!me?.isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-10 text-muted-foreground",
		children: "Only admins can manage the team."
	});
	async function setRole(userId, role) {
		await supabase.from("user_roles").delete().eq("user_id", userId);
		const { error } = await supabase.from("user_roles").insert({
			user_id: userId,
			role
		});
		if (error) toast.error(error.message);
		else toast.success("Role updated");
		qc.invalidateQueries({ queryKey: ["team"] });
		qc.invalidateQueries({ queryKey: ["me"] });
	}
	async function addProject() {
		if (!newProject.trim()) return;
		const { error } = await supabase.from("projects").insert({
			name: newProject.trim(),
			created_by: me.id
		});
		if (error) {
			toast.error(error.message);
			return;
		}
		setNewProject("");
		qc.invalidateQueries({ queryKey: ["team"] });
		qc.invalidateQueries({ queryKey: ["projects"] });
	}
	async function delProject(id) {
		await supabase.from("projects").delete().eq("id", id);
		qc.invalidateQueries({ queryKey: ["team"] });
		qc.invalidateQueries({ queryKey: ["projects"] });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl px-8 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold",
				children: "Team"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-muted-foreground",
				children: "Designers submit, reviewers approve, admins manage everything."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 divide-y rounded-xl border bg-card shadow-card",
				children: data?.profiles.map((p) => {
					const role = data.roles.find((r) => r.user_id === p.id)?.role ?? "designer";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4 p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-9 place-items-center rounded-full bg-secondary text-xs font-semibold",
								children: initials(p.full_name)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-medium",
									children: [
										p.full_name,
										" ",
										p.id === me.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground",
											children: "(you)"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm text-muted-foreground",
									children: p.email
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: role,
								onValueChange: (v) => setRole(p.id, v),
								disabled: p.id === me.id,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "w-36",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "designer",
										children: "Designer"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "reviewer",
										children: "Reviewer"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "admin",
										children: "Admin"
									})
								] })]
							})
						]
					}, p.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-12 text-xl font-bold",
				children: "Projects"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: newProject,
					onChange: (e) => setNewProject(e.target.value),
					placeholder: "New project name",
					className: "max-w-xs bg-card"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: addProject,
					children: "Add"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-4 divide-y rounded-xl border bg-card shadow-card",
				children: [data?.projects.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "p-4 text-sm text-muted-foreground",
					children: "No projects yet."
				}), data?.projects.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between p-4",
					children: [p.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => delProject(p.id),
						className: "text-muted-foreground hover:text-destructive",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
					})]
				}, p.id))]
			})
		]
	});
}
//#endregion
export { Team as component };
