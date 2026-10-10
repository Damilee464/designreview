import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-BJ-v0RHx.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime, d as DialogContent$1, f as DialogDescription$1, g as DialogTrigger$1, h as DialogTitle$1, l as Dialog$1, m as DialogPortal$1, p as DialogOverlay$1, u as DialogClose } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as CircleAlert, M as ArrowLeft, O as Check, S as CornerDownRight, a as Trash2, b as ExternalLink, d as RotateCcw, i as Upload, n as X, p as Pencil, x as Download, y as FileText } from "../_libs/lucide-react.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { i as useSignedUrl, n as initials, r as useMe } from "./app-BHbNCdDF.mjs";
import { t as StatusBadge } from "./StatusBadge-m5x-TM83.mjs";
import { a as format, i as formatDistanceToNow, n as parseISO, o as isValid, r as isPast } from "../_libs/date-fns.mjs";
import { t as Route } from "./designs._id-DHrvT9sT.mjs";
import { n as Textarea, r as uploadDesignFile, t as ACCEPT } from "./textarea-DKr1Vz3z.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/designs._id-GWTC4UuD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Tabs = Root2;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = List.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}));
TabsTrigger.displayName = Trigger.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}));
TabsContent.displayName = Content.displayName;
var Dialog = Dialog$1;
var DialogTrigger = DialogTrigger$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
function useDesign(id) {
	return useQuery({
		queryKey: ["design", id],
		queryFn: async () => {
			const [d, v, c, e, profiles] = await Promise.all([
				supabase.from("designs").select("*, projects(name), designer:profiles!designs_designer_id_fkey(full_name), approver:profiles!designs_approved_by_fkey(full_name)").eq("id", id).single(),
				supabase.from("design_versions").select("*").eq("design_id", id).order("version_number"),
				supabase.from("comments").select("*, author:profiles(full_name)").eq("design_id", id).order("created_at"),
				supabase.from("design_events").select("*, actor:profiles(full_name)").eq("design_id", id).order("created_at", { ascending: false }),
				supabase.from("profiles").select("id, full_name")
			]);
			if (d.error) throw d.error;
			return {
				design: d.data,
				versions: v.data ?? [],
				comments: c.data ?? [],
				events: e.data ?? [],
				profiles: profiles.data ?? []
			};
		}
	});
}
function MentionComposer({ value, onChange, onKeyDown, placeholder, rows, textareaRef, profiles }) {
	const [mentionSearch, setMentionSearch] = (0, import_react.useState)(null);
	const [caretPos, setCaretPos] = (0, import_react.useState)(0);
	const containerRef = (0, import_react.useRef)(null);
	const mentionMatches = (0, import_react.useMemo)(() => {
		if (mentionSearch === null) return [];
		return profiles.filter((p) => p.full_name.toLowerCase().includes(mentionSearch.toLowerCase())).slice(0, 6);
	}, [mentionSearch, profiles]);
	function handleChange(e) {
		const val = e.target.value;
		const pos = e.target.selectionStart ?? 0;
		setCaretPos(pos);
		const match = val.slice(0, pos).match(/@(\w*)$/);
		setMentionSearch(match ? match[1] : null);
		onChange(val, extractMentionIds(val, profiles));
	}
	function pickMention(profile) {
		const before = value.slice(0, caretPos);
		const after = value.slice(caretPos);
		const next = before.replace(/@(\w*)$/, `@${profile.full_name.replace(/ /g, "_")} `) + after;
		onChange(next, extractMentionIds(next, profiles));
		setMentionSearch(null);
		setTimeout(() => textareaRef?.current?.focus(), 0);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: containerRef,
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
			ref: textareaRef,
			rows: rows ?? 3,
			value,
			onChange: handleChange,
			onKeyDown: (e) => {
				if (mentionMatches.length > 0 && e.key === "Escape") {
					setMentionSearch(null);
					return;
				}
				onKeyDown?.(e);
			},
			placeholder,
			className: "resize-none"
		}), mentionSearch !== null && mentionMatches.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "absolute bottom-full left-0 z-50 mb-1 w-56 overflow-hidden rounded-lg border bg-card shadow-card",
			children: mentionMatches.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent",
				onMouseDown: (e) => {
					e.preventDefault();
					pickMention(p);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid size-6 shrink-0 place-items-center rounded-full bg-secondary text-[10px] font-semibold",
					children: initials(p.full_name)
				}), p.full_name]
			}) }, p.id))
		})]
	});
}
function extractMentionIds(text, profiles) {
	const ids = [];
	for (const p of profiles) {
		const tag = "@" + p.full_name.replace(/ /g, "_");
		if (text.includes(tag)) ids.push(p.id);
	}
	return ids;
}
function ReviewPage() {
	const { id } = Route.useParams();
	const { data: me } = useMe();
	const qc = useQueryClient();
	const { data, isLoading } = useDesign(id);
	const [versionNo, setVersionNo] = (0, import_react.useState)(null);
	const [draftPin, setDraftPin] = (0, import_react.useState)(null);
	const [activePin, setActivePin] = (0, import_react.useState)(null);
	const [text, setText] = (0, import_react.useState)("");
	const [mentionIds, setMentionIds] = (0, import_react.useState)([]);
	const [replyTo, setReplyTo] = (0, import_react.useState)(null);
	const [showResolved, setShowResolved] = (0, import_react.useState)(false);
	const composerRef = (0, import_react.useRef)(null);
	const design = data?.design;
	const versions = data?.versions ?? [];
	const profiles = data?.profiles ?? [];
	const current = versions.find((v) => v.version_number === (versionNo ?? design?.current_version)) ?? versions[versions.length - 1];
	const { data: fileUrl } = useSignedUrl(current?.file_path);
	(0, import_react.useEffect)(() => {
		setDraftPin(null);
	}, [current?.id]);
	const versionComments = (0, import_react.useMemo)(() => (data?.comments ?? []).filter((c) => c.version_id === current?.id), [data, current]);
	const topLevel = versionComments.filter((c) => !c.parent_id && (showResolved || !c.resolved));
	const pinNumbers = (0, import_react.useMemo)(() => {
		const m = /* @__PURE__ */ new Map();
		versionComments.filter((c) => !c.parent_id && c.pin_x != null).forEach((c, i) => m.set(c.id, i + 1));
		return m;
	}, [versionComments]);
	const resolvedCount = versionComments.filter((c) => !c.parent_id && c.resolved).length;
	const refresh = () => {
		qc.invalidateQueries({ queryKey: ["design", id] });
		qc.invalidateQueries({ queryKey: ["designs"] });
	};
	if (isLoading || !design || !me) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-10 text-muted-foreground",
		children: "Loading…"
	});
	const isOwner = design.designer_id === me.id;
	const isLatest = current?.version_number === design.current_version;
	const dueDate = design.due_date ? parseISO(design.due_date) : null;
	const isOverdue = dueDate && isValid(dueDate) && isPast(dueDate) && design.status !== "approved";
	function onCanvasClick(e) {
		if (!isLatest) {
			toast.info("Switch to the latest version to add pins.");
			return;
		}
		const r = e.currentTarget.getBoundingClientRect();
		setDraftPin({
			x: (e.clientX - r.left) / r.width * 100,
			y: (e.clientY - r.top) / r.height * 100
		});
		setReplyTo(null);
		setTimeout(() => composerRef.current?.focus(), 0);
	}
	async function postComment() {
		if (!text.trim() || !current) return;
		const { error } = await supabase.from("comments").insert({
			design_id: id,
			version_id: current.id,
			author_id: me.id,
			body: text.trim(),
			parent_id: replyTo,
			pin_x: replyTo ? null : draftPin?.x ?? null,
			pin_y: replyTo ? null : draftPin?.y ?? null,
			mentions: mentionIds
		});
		if (error) {
			toast.error(error.message);
			return;
		}
		setText("");
		setMentionIds([]);
		setDraftPin(null);
		setReplyTo(null);
		refresh();
	}
	async function setStatus(s) {
		const { error } = await supabase.from("designs").update({ status: s }).eq("id", id);
		if (error) {
			toast.error(error.message);
			return;
		}
		toast.success("Status updated");
		refresh();
	}
	async function toggleResolved(cid, v) {
		await supabase.from("comments").update({ resolved: v }).eq("id", cid);
		refresh();
	}
	async function deleteComment(cid) {
		const { error } = await supabase.from("comments").delete().eq("id", cid);
		if (error) {
			toast.error(error.message);
			return;
		}
		refresh();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-screen flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-center gap-4 border-b bg-card px-6 py-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/dashboard",
					className: "text-muted-foreground hover:text-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "truncate text-xl font-bold",
								children: design.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: design.status }),
							isOverdue && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-3" }), " Overdue"]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-sm text-muted-foreground",
						children: [
							design.projects?.name ?? "No project",
							" · by ",
							design.designer?.full_name,
							design.status === "approved" && design.approved_at && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								" · approved by ",
								design.approver?.full_name,
								" on ",
								format(new Date(design.approved_at), "d MMM yyyy, HH:mm")
							] })
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-1 rounded-lg bg-muted p-1",
					children: versions.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setVersionNo(v.version_number),
						className: `rounded-md px-2.5 py-1 font-mono text-xs ${v.id === current?.id ? "bg-card shadow-card" : "text-muted-foreground"}`,
						children: ["V", v.version_number]
					}, v.id))
				}),
				me.isStaff && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => setStatus("changes_requested"),
						disabled: design.status === "changes_requested",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {}), " Request changes"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: () => setStatus("approved"),
						disabled: design.status === "approved",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {}), " Approve"]
					})]
				}),
				isOwner && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewVersionDialog, {
					designId: id,
					next: design.current_version + 1,
					userId: me.id,
					onDone: () => {
						setVersionNo(null);
						refresh();
					}
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "min-w-0 flex-1 overflow-auto bg-muted bg-grid p-8",
				children: [
					current?.figma_url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: current.figma_url,
						target: "_blank",
						rel: "noreferrer",
						className: "mb-4 inline-flex items-center gap-2 rounded-md border bg-card px-3 py-1.5 text-sm hover:text-primary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-4" }), " Open in Figma"]
					}),
					current?.file_type === "image" && fileUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mx-auto w-fit cursor-crosshair",
						onClick: onCanvasClick,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: fileUrl,
								alt: design.title,
								className: "block max-w-full rounded-lg shadow-card",
								draggable: false
							}),
							versionComments.filter((c) => !c.parent_id && c.pin_x != null).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: (e) => {
									e.stopPropagation();
									setActivePin(c.id);
									document.getElementById("c-" + c.id)?.scrollIntoView({
										behavior: "smooth",
										block: "center"
									});
								},
								className: `absolute grid size-7 -translate-x-1/2 -translate-y-full place-items-center rounded-full rounded-bl-none text-xs font-bold shadow-pin transition-transform hover:scale-110 ${c.resolved ? "bg-approved text-primary-foreground" : "bg-primary text-primary-foreground"} ${activePin === c.id ? "scale-125 ring-2 ring-ink" : ""}`,
								style: {
									left: `${c.pin_x}%`,
									top: `${c.pin_y}%`
								},
								children: pinNumbers.get(c.id)
							}, c.id)),
							draftPin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute grid size-7 -translate-x-1/2 -translate-y-full animate-pulse place-items-center rounded-full rounded-bl-none bg-ink text-xs font-bold text-ink-foreground",
								style: {
									left: `${draftPin.x}%`,
									top: `${draftPin.y}%`
								},
								children: "+"
							})
						]
					}) : current?.file_type === "pdf" && fileUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full min-h-[600px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
							src: fileUrl,
							title: design.title,
							className: "h-full w-full rounded-lg border bg-card"
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-80 place-items-center rounded-lg border bg-card text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "mx-auto mb-2 size-8" }), "No file — review via the Figma link."]
						})
					}),
					current?.file_type === "image" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-center text-xs text-muted-foreground",
						children: "Click anywhere on the design to pin a comment."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "flex w-[380px] shrink-0 flex-col border-l bg-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
					defaultValue: "comments",
					className: "flex min-h-0 flex-1 flex-col",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
							className: "mx-4 mt-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
									value: "comments",
									children: [
										"Comments (",
										versionComments.filter((c) => !c.parent_id).length,
										")"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "details",
									children: "Details"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "history",
									children: "History"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
							value: "comments",
							className: "flex min-h-0 flex-1 flex-col",
							children: [
								resolvedCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center justify-end border-b px-4 py-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex cursor-pointer items-center gap-2 text-xs text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: showResolved,
												onChange: (e) => setShowResolved(e.target.checked),
												className: "accent-primary"
											}),
											"Show ",
											resolvedCount,
											" resolved"
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 space-y-3 overflow-auto p-4",
									children: [topLevel.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "py-8 text-center text-sm text-muted-foreground",
										children: resolvedCount > 0 && !showResolved ? "All comments are resolved." : `No feedback on V${current?.version_number} yet.`
									}), topLevel.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										id: "c-" + c.id,
										onMouseEnter: () => setActivePin(c.id),
										className: `rounded-lg border p-3 transition-colors ${activePin === c.id ? "border-primary" : ""} ${c.resolved ? "opacity-60" : ""}`,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommentRow, {
												c,
												pin: pinNumbers.get(c.id),
												canEdit: c.author_id === me.id,
												canDelete: c.author_id === me.id || me.isStaff,
												onDelete: () => deleteComment(c.id),
												onEdited: refresh
											}),
											versionComments.filter((r) => r.parent_id === c.id).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-3 flex gap-2 border-l-2 pl-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CornerDownRight, { className: "mt-1 size-3 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommentRow, {
													c: r,
													canEdit: r.author_id === me.id,
													canDelete: r.author_id === me.id || me.isStaff,
													onDelete: () => deleteComment(r.id),
													onEdited: refresh
												})]
											}, r.id)),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-2 flex gap-3 text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: "text-muted-foreground hover:text-foreground",
													onClick: () => {
														setReplyTo(c.id);
														setDraftPin(null);
														composerRef.current?.focus();
													},
													children: "Reply"
												}), (me.isStaff || c.author_id === me.id) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: "text-muted-foreground hover:text-foreground",
													onClick: () => toggleResolved(c.id, !c.resolved),
													children: c.resolved ? "Reopen" : "Resolve"
												})]
											})
										]
									}, c.id))]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border-t p-4",
									children: [
										(draftPin || replyTo) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mb-2 flex items-center justify-between rounded-md bg-accent px-2 py-1 text-xs text-accent-foreground",
											children: [replyTo ? "Replying to comment" : "New pinned comment", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => {
													setDraftPin(null);
													setReplyTo(null);
												},
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3" })
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MentionComposer, {
											value: text,
											onChange: (val, ids) => {
												setText(val);
												setMentionIds(ids);
											},
											onKeyDown: (e) => {
												if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) postComment();
											},
											placeholder: draftPin ? "What should change here? Use @ to mention someone." : "Leave general feedback… Use @ to mention.",
											rows: 3,
											textareaRef: composerRef,
											profiles
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											className: "mt-2 w-full",
											size: "sm",
											onClick: postComment,
											disabled: !text.trim(),
											children: "Post"
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
							value: "details",
							className: "overflow-auto p-4 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-semibold",
									children: "Purpose"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 whitespace-pre-wrap text-muted-foreground",
									children: design.description || "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "mt-5 font-semibold",
									children: [
										"V",
										current?.version_number,
										" notes"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 whitespace-pre-wrap text-muted-foreground",
									children: current?.notes || "—"
								}),
								dueDate && isValid(dueDate) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `mt-5 flex items-center gap-2 rounded-lg border p-3 ${isOverdue ? "border-destructive/30 bg-destructive/5" : "bg-muted/40"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: `size-4 shrink-0 ${isOverdue ? "text-destructive" : "text-muted-foreground"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `text-xs font-medium ${isOverdue ? "text-destructive" : "text-muted-foreground"}`,
										children: isOverdue ? "Overdue" : "Due date"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-semibold",
										children: format(dueDate, "d MMM yyyy")
									})] })]
								}),
								me.isStaff && design.status !== "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "sm",
									className: "mt-6",
									onClick: () => setStatus("pending"),
									children: "Move back to pending"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
							value: "history",
							className: "overflow-auto p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-3 flex justify-end",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground",
									onClick: () => {
										const rows = [[
											"Actor",
											"Event",
											"Detail",
											"Date"
										]];
										for (const ev of data.events) rows.push([
											ev.actor?.full_name ?? "System",
											ev.kind,
											ev.detail,
											format(new Date(ev.created_at), "yyyy-MM-dd HH:mm")
										]);
										const csv = rows.map((r) => r.map((v) => v.includes(",") ? `"${v}"` : v).join(",")).join("\n");
										const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
										const url = URL.createObjectURL(blob);
										const a = document.createElement("a");
										a.href = url;
										a.download = `${design.title}-history.csv`;
										a.click();
										URL.revokeObjectURL(url);
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), " Export CSV"]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
								className: "relative space-y-4 border-l pl-5",
								children: data.events.map((ev) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -left-1.5 mt-1.5 size-3 rounded-full border-2 border-card bg-primary" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: ev.actor?.full_name ?? "System"
											}),
											" ",
											ev.kind === "submitted" && "submitted V1",
											ev.kind === "version" && `uploaded ${ev.detail.toUpperCase()}`,
											ev.kind === "status" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["set status to ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: ev.detail })] })
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground",
											children: format(new Date(ev.created_at), "d MMM yyyy, HH:mm")
										})
									]
								}, ev.id))
							})]
						})
					]
				})
			})]
		})]
	});
}
function CommentRow({ c, pin, canEdit, canDelete, onDelete, onEdited }) {
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [editText, setEditText] = (0, import_react.useState)(c.body);
	const [saving, setSaving] = (0, import_react.useState)(false);
	async function saveEdit() {
		if (!editText.trim()) return;
		setSaving(true);
		const { error } = await supabase.from("comments").update({ body: editText.trim() }).eq("id", c.id);
		setSaving(false);
		if (error) {
			toast.error(error.message);
			return;
		}
		setEditing(false);
		onEdited();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-w-0 flex-1 gap-2",
		children: [pin != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "grid size-6 shrink-0 place-items-center rounded-full rounded-bl-none bg-primary text-[11px] font-bold text-primary-foreground",
			children: pin
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "grid size-6 shrink-0 place-items-center rounded-full bg-secondary text-[10px] font-semibold",
			children: initials(c.author?.full_name ?? "")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold",
						children: c.author?.full_name
					}),
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: formatDistanceToNow(new Date(c.created_at), { addSuffix: true })
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 items-center gap-1",
					children: [canEdit && !editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						"aria-label": "Edit comment",
						className: "text-muted-foreground hover:text-foreground",
						onClick: () => {
							setEditText(c.body);
							setEditing(true);
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-3" })
					}), canDelete && !editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						"aria-label": "Delete comment",
						className: "text-muted-foreground hover:text-destructive",
						onClick: onDelete,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3" })
					})]
				})]
			}), editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					rows: 2,
					value: editText,
					onChange: (e) => setEditText(e.target.value),
					autoFocus: true,
					className: "text-sm"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						className: "h-6 px-2 text-xs",
						onClick: saveEdit,
						disabled: saving,
						children: "Save"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						className: "h-6 px-2 text-xs",
						onClick: () => setEditing(false),
						children: "Cancel"
					})]
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-0.5 whitespace-pre-wrap text-sm",
				children: c.body
			})]
		})]
	});
}
function NewVersionDialog({ designId, next, userId, onDone }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [file, setFile] = (0, import_react.useState)(null);
	const [figma, setFigma] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function submit() {
		if (!file && !figma) {
			toast.error("Add a file or Figma link.");
			return;
		}
		setBusy(true);
		try {
			const up = file ? await uploadDesignFile(userId, file) : null;
			const { error } = await supabase.from("design_versions").insert({
				design_id: designId,
				version_number: next,
				file_path: up?.path ?? null,
				file_type: up?.type ?? null,
				figma_url: figma || null,
				notes,
				created_by: userId
			});
			if (error) throw error;
			toast.success(`V${next} sent for review`);
			setOpen(false);
			setFile(null);
			setFigma("");
			setNotes("");
			onDone();
		} catch (e) {
			toast.error(e.message);
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, {}),
					" Upload V",
					next
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: ["Resubmit as V", next] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "File" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "file",
						accept: ACCEPT,
						onChange: (e) => setFile(e.target.files?.[0] ?? null)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Figma link" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "url",
						value: figma,
						onChange: (e) => setFigma(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "What changed?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						rows: 3,
						value: notes,
						onChange: (e) => setNotes(e.target.value),
						placeholder: "Addressed spacing (pin 1), new mobile layout (pin 2)…"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "w-full",
					onClick: submit,
					disabled: busy,
					children: busy ? "Uploading…" : "Send for review"
				})
			]
		})] })]
	});
}
//#endregion
export { ReviewPage as component };
