import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-BJ-v0RHx.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as Upload } from "../_libs/lucide-react.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { r as useMe } from "./app-BHbNCdDF.mjs";
import { n as Textarea, r as uploadDesignFile, t as ACCEPT } from "./textarea-DKr1Vz3z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/designs.new-Cj2wLgwH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NewDesign() {
	const { data: me } = useMe();
	const navigate = useNavigate();
	const qc = useQueryClient();
	const { data: projects = [] } = useQuery({
		queryKey: ["projects"],
		queryFn: async () => (await supabase.from("projects").select("*").order("name")).data ?? []
	});
	const [title, setTitle] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [projectName, setProjectName] = (0, import_react.useState)("");
	const [figma, setFigma] = (0, import_react.useState)("");
	const [file, setFile] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [due, setDue] = (0, import_react.useState)("");
	async function submit(e) {
		e.preventDefault();
		if (!me) return;
		if (!file && !figma) {
			toast.error("Add a file or a Figma link.");
			return;
		}
		setBusy(true);
		try {
			let projectId = null;
			const pn = projectName.trim();
			if (pn) {
				const existing = projects.find((p) => p.name.toLowerCase() === pn.toLowerCase());
				if (existing) projectId = existing.id;
				else {
					const { data, error } = await supabase.from("projects").insert({
						name: pn,
						created_by: me.id
					}).select().single();
					if (error) throw error;
					projectId = data.id;
				}
			}
			const up = file ? await uploadDesignFile(me.id, file) : null;
			const { data: d, error } = await supabase.from("designs").insert({
				title,
				description,
				project_id: projectId,
				designer_id: me.id,
				due_date: due || null
			}).select().single();
			if (error) throw error;
			const { error: vErr } = await supabase.from("design_versions").insert({
				design_id: d.id,
				version_number: 1,
				file_path: up?.path ?? null,
				file_type: up?.type ?? null,
				figma_url: figma || null,
				notes: description,
				created_by: me.id
			});
			if (vErr) throw vErr;
			qc.invalidateQueries({ queryKey: ["designs"] });
			toast.success("Submitted for review");
			navigate({
				to: "/designs/$id",
				params: { id: d.id }
			});
		} catch (err) {
			toast.error(err.message);
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl px-8 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold",
				children: "New submission"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-muted-foreground",
				children: "Share your design and tell reviewers what it's for."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				className: "mt-8 space-y-5 rounded-xl border bg-card p-6 shadow-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "title",
							children: "Title"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "title",
							value: title,
							onChange: (e) => setTitle(e.target.value),
							required: true,
							placeholder: "Checkout page — mobile"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "project",
								children: "Project"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "project",
								list: "projects",
								value: projectName,
								onChange: (e) => setProjectName(e.target.value),
								placeholder: "Pick or type a new project"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("datalist", {
								id: "projects",
								children: projects.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: p.name }, p.id))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "desc",
							children: "Purpose & description"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "desc",
							rows: 4,
							value: description,
							onChange: (e) => setDescription(e.target.value),
							placeholder: "What problem does this solve? What should reviewers focus on?"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Design file (image or PDF)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed bg-muted/40 p-8 text-sm text-muted-foreground hover:border-primary",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-6" }),
								file ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-foreground",
									children: file.name
								}) : "Click to choose a file (max 20 MB)",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									accept: ACCEPT,
									className: "hidden",
									onChange: (e) => setFile(e.target.files?.[0] ?? null)
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "figma",
							children: "Figma link"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "figma",
							type: "url",
							value: figma,
							onChange: (e) => setFigma(e.target.value),
							placeholder: "https://figma.com/file/…"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "due",
							children: "Review due by (optional)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "due",
							type: "date",
							className: "w-48",
							value: due,
							onChange: (e) => setDue(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: busy,
						className: "w-full",
						children: busy ? "Submitting…" : "Submit for review"
					})
				]
			})
		]
	});
}
//#endregion
export { NewDesign as component };
