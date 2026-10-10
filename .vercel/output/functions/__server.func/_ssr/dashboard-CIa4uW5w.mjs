import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-BJ-v0RHx.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { C as CircleAlert, u as Search } from "../_libs/lucide-react.mjs";
import { n as designsQuery } from "./dashboard-DWAnkI-0.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { r as useMe } from "./app-BHbNCdDF.mjs";
import { t as StatusBadge } from "./StatusBadge-m5x-TM83.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { a as format, i as formatDistanceToNow, n as parseISO, o as isValid, r as isPast } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-CIa4uW5w.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function myDesignsQuery(userId) {
	return {
		queryKey: [
			"designs",
			"mine",
			userId
		],
		queryFn: async () => {
			const { data, error } = await supabase.from("designs").select("*, projects(name), designer:profiles!designs_designer_id_fkey(full_name)").eq("designer_id", userId).order("updated_at", { ascending: false });
			if (error) throw error;
			return data;
		}
	};
}
var BANNER_IMAGES = [
	"https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=1400&q=80&auto=format&fit=crop",
	"https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1400&q=80&auto=format&fit=crop",
	"https://images.unsplash.com/photo-1558655146-d09347e92766?w=1400&q=80&auto=format&fit=crop",
	"https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1400&q=80&auto=format&fit=crop"
];
function WelcomeBanner({ name, pending, total }) {
	const [imgIndex, setImgIndex] = (0, import_react.useState)(0);
	const [fade, setFade] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		const t = setInterval(() => {
			setFade(false);
			setTimeout(() => {
				setImgIndex((i) => (i + 1) % BANNER_IMAGES.length);
				setFade(true);
			}, 400);
		}, 5e3);
		return () => clearInterval(t);
	}, []);
	const hour = (/* @__PURE__ */ new Date()).getHours();
	const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative overflow-hidden rounded-2xl shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `absolute inset-0 transition-opacity duration-500 ${fade ? "opacity-100" : "opacity-0"}`,
				style: {
					backgroundImage: `url(${BANNER_IMAGES[imgIndex]})`,
					backgroundSize: "cover",
					backgroundPosition: "center"
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative flex items-center justify-between px-8 py-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-white/70",
						children: greeting
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "mt-0.5 text-3xl font-bold text-white",
						children: [name, " 👋"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-white/70",
						children: total === 0 ? "No designs submitted yet. Start by creating one." : pending > 0 ? `You have ${pending} design${pending > 1 ? "s" : ""} waiting for review.` : "All designs are reviewed. Great work!"
					})
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute bottom-3 right-4 flex gap-1",
				children: BANNER_IMAGES.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `inline-block h-1 rounded-full transition-all ${i === imgIndex ? "w-4 bg-white" : "w-1 bg-white/40"}` }, i))
			})
		]
	});
}
function Dashboard() {
	const { data: me } = useMe();
	const navigate = useNavigate();
	const isDesigner = me?.roles.includes("designer") && !me?.isStaff;
	const { data: designs = [] } = useQuery(isDesigner && me?.id ? myDesignsQuery(me.id) : designsQuery);
	const { data: projects = [] } = useQuery({
		queryKey: ["projects"],
		queryFn: async () => (await supabase.from("projects").select("*").order("name")).data ?? []
	});
	const [status, setStatus] = (0, import_react.useState)("all");
	const [project, setProject] = (0, import_react.useState)("all");
	const [from, setFrom] = (0, import_react.useState)("");
	const [to, setTo] = (0, import_react.useState)("");
	const [mine, setMine] = (0, import_react.useState)(false);
	const [search, setSearch] = (0, import_react.useState)("");
	const filtered = (0, import_react.useMemo)(() => {
		const q = search.trim().toLowerCase();
		return designs.filter((d) => {
			if (status !== "all" && d.status !== status) return false;
			if (project !== "all" && d.project_id !== project) return false;
			if (from && new Date(d.created_at) < new Date(from)) return false;
			if (to && new Date(d.created_at) > /* @__PURE__ */ new Date(to + "T23:59:59")) return false;
			if (!isDesigner && mine && d.designer_id !== me?.id) return false;
			if (q && !d.title.toLowerCase().includes(q) && !d.description.toLowerCase().includes(q)) return false;
			return true;
		});
	}, [
		designs,
		status,
		project,
		from,
		to,
		mine,
		me,
		search,
		isDesigner
	]);
	const pending = designs.filter((d) => d.status === "pending").length;
	const stats = [
		{
			label: "Total submissions",
			value: designs.length,
			cls: "text-foreground",
			bg: "bg-card"
		},
		{
			label: "Pending review",
			value: pending,
			cls: "text-pending",
			bg: "bg-card"
		},
		{
			label: "Approved",
			value: designs.filter((d) => d.status === "approved").length,
			cls: "text-approved",
			bg: "bg-card"
		},
		{
			label: "Changes requested",
			value: designs.filter((d) => d.status === "changes_requested").length,
			cls: "text-changes",
			bg: "bg-card"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-8 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WelcomeBanner, {
				name: me?.name.split(" ")[0] ?? "",
				pending,
				total: designs.length
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: stats.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `rounded-xl border ${s.bg} p-5 shadow-card`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm text-muted-foreground",
						children: s.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `mt-2 font-display text-4xl font-bold ${s.cls}`,
						children: s.value
					})]
				}, s.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "bg-card pl-9",
					placeholder: "Search by title or description…",
					value: search,
					onChange: (e) => setSearch(e.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap items-end gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterBox, {
						label: "Status",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: status,
							onValueChange: (v) => setStatus(v),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "w-44 bg-card",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "all",
									children: "All statuses"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "pending",
									children: "Pending"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "approved",
									children: "Approved"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "changes_requested",
									children: "Changes requested"
								})
							] })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterBox, {
						label: "Project",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: project,
							onValueChange: setProject,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "w-44 bg-card",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "all",
								children: "All projects"
							}), projects.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: p.id,
								children: p.name
							}, p.id))] })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterBox, {
						label: "From",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							className: "w-40 bg-card",
							value: from,
							onChange: (e) => setFrom(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterBox, {
						label: "To",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							className: "w-40 bg-card",
							value: to,
							onChange: (e) => setTo(e.target.value)
						})
					}),
					!isDesigner && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex h-9 items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: mine,
							onChange: (e) => setMine(e.target.checked),
							className: "accent-primary"
						}), "Only mine"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 overflow-hidden rounded-xl border bg-card shadow-card",
				children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-3 p-16 text-center text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid size-14 place-items-center rounded-2xl bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-6 text-muted-foreground" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium text-foreground",
						children: "No designs found"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm",
						children: search ? "Try a different search term." : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Nothing here yet. ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/designs/new",
							className: "text-primary hover:underline",
							children: "Submit one"
						})] })
					})] })]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "border-b bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3 font-medium",
								children: "Design"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3 font-medium",
								children: "Project"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3 font-medium",
								children: "Designer"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3 font-medium",
								children: "Version"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3 font-medium",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3 font-medium",
								children: "Due"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3 font-medium",
								children: "Updated"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filtered.map((d) => {
						const dueDate = d.due_date ? parseISO(d.due_date) : null;
						const overdue = dueDate && isValid(dueDate) && isPast(dueDate) && d.status !== "approved";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							onClick: () => navigate({
								to: "/designs/$id",
								params: { id: d.id }
							}),
							className: `cursor-pointer border-b last:border-0 transition-colors hover:bg-muted/40 ${overdue ? "bg-destructive/5" : ""}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-5 py-3.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-primary",
											children: d.title
										}), overdue && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, {
											className: "size-3.5 shrink-0 text-destructive",
											"aria-label": "Overdue"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: format(new Date(d.created_at), "d MMM yyyy")
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-3.5 text-muted-foreground",
									children: d.projects?.name ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-3.5",
									children: d.designer?.full_name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-5 py-3.5 font-mono text-xs",
									children: ["V", d.current_version]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-3.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: d.status })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: `px-5 py-3.5 text-xs ${overdue ? "font-semibold text-destructive" : "text-muted-foreground"}`,
									children: dueDate && isValid(dueDate) ? format(dueDate, "d MMM yyyy") : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-3.5 text-muted-foreground",
									children: formatDistanceToNow(new Date(d.updated_at), { addSuffix: true })
								})
							]
						}, d.id);
					}) })]
				})
			})
		]
	});
}
function FilterBox({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs font-medium text-muted-foreground",
			children: label
		}), children]
	});
}
//#endregion
export { Dashboard as component, myDesignsQuery };
