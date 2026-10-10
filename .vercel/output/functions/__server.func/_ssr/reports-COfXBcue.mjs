import { t as supabase } from "./client-BJ-v0RHx.mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { x as Download } from "../_libs/lucide-react.mjs";
import { n as designsQuery } from "./dashboard-DWAnkI-0.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as format, s as startOfWeek, t as subWeeks } from "../_libs/date-fns.mjs";
import { a as CartesianGrid, c as Cell, i as XAxis, l as ResponsiveContainer, n as BarChart, o as Bar, r as YAxis, s as Pie, t as PieChart, u as Tooltip } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reports-COfXBcue.js
var import_jsx_runtime = require_jsx_runtime();
function toCsv(rows, headers) {
	const escape = (v) => {
		const s = v == null ? "" : String(v);
		return s.includes(",") || s.includes("\"") || s.includes("\n") ? `"${s.replace(/"/g, "\"\"")}"` : s;
	};
	return [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n");
}
function downloadCsv(filename, csv) {
	const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
function Reports() {
	const { data: designs = [] } = useQuery(designsQuery);
	const { data: comments = [] } = useQuery({
		queryKey: ["all-comments"],
		queryFn: async () => (await supabase.from("comments").select("author_id, created_at, author:profiles(full_name)")).data ?? []
	});
	const total = designs.length;
	const approved = designs.filter((d) => d.status === "approved").length;
	const rate = total ? Math.round(approved / total * 100) : 0;
	const avgVersions = total ? (designs.reduce((s, d) => s + d.current_version, 0) / total).toFixed(1) : "0";
	const approvedDs = designs.filter((d) => d.approved_at);
	const avgDays = approvedDs.length ? (approvedDs.reduce((s, d) => s + (new Date(d.approved_at).getTime() - new Date(d.created_at).getTime()), 0) / approvedDs.length / 864e5).toFixed(1) : "—";
	const pie = [
		{
			name: "Pending",
			value: designs.filter((d) => d.status === "pending").length,
			color: "var(--pending)"
		},
		{
			name: "Approved",
			value: approved,
			color: "var(--approved)"
		},
		{
			name: "Changes",
			value: designs.filter((d) => d.status === "changes_requested").length,
			color: "var(--changes)"
		}
	];
	const weeks = Array.from({ length: 8 }, (_, i) => startOfWeek(subWeeks(/* @__PURE__ */ new Date(), 7 - i)));
	const weekly = weeks.map((w, i) => {
		const end = weeks[i + 1] ?? /* @__PURE__ */ new Date(864e13);
		return {
			week: format(w, "d MMM"),
			submissions: designs.filter((d) => new Date(d.created_at) >= w && new Date(d.created_at) < end).length,
			comments: comments.filter((c) => new Date(c.created_at) >= w && new Date(c.created_at) < end).length
		};
	});
	const byDesigner = Object.values(designs.reduce((acc, d) => {
		const k = d.designer_id;
		acc[k] ??= {
			name: d.designer?.full_name ?? "—",
			total: 0,
			approved: 0
		};
		acc[k].total++;
		if (d.status === "approved") acc[k].approved++;
		return acc;
	}, {})).sort((a, b) => b.total - a.total);
	const byReviewer = Object.values(comments.reduce((acc, c) => {
		acc[c.author_id] ??= {
			name: c.author?.full_name ?? "—",
			n: 0
		};
		acc[c.author_id].n++;
		return acc;
	}, {})).sort((a, b) => b.n - a.n);
	function exportDesignsCsv() {
		const csv = toCsv(designs.map((d) => [
			d.title,
			d.projects?.name ?? "",
			d.designer?.full_name ?? "",
			d.status,
			d.current_version,
			d.due_date ?? "",
			d.approved_at ? format(new Date(d.approved_at), "yyyy-MM-dd") : "",
			format(new Date(d.created_at), "yyyy-MM-dd"),
			format(new Date(d.updated_at), "yyyy-MM-dd")
		]), [
			"Title",
			"Project",
			"Designer",
			"Status",
			"Current Version",
			"Due Date",
			"Approved At",
			"Created At",
			"Updated At"
		]);
		downloadCsv(`designs-report-${format(/* @__PURE__ */ new Date(), "yyyy-MM-dd")}.csv`, csv);
	}
	function exportActivityCsv() {
		const csv = toCsv(weekly.map((w) => [
			w.week,
			w.submissions,
			w.comments
		]), [
			"Week",
			"Submissions",
			"Comments"
		]);
		downloadCsv(`activity-report-${format(/* @__PURE__ */ new Date(), "yyyy-MM-dd")}.csv`, csv);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-8 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-bold",
					children: "Reports"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-muted-foreground",
					children: "Team activity, review progress and approval rates."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: exportActivityCsv,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1.5 size-4" }), " Activity CSV"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: exportDesignsCsv,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1.5 size-4" }), " Designs CSV"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-4 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Approval rate",
						value: `${rate}%`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Avg. versions per design",
						value: avgVersions
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Avg. days to approval",
						value: avgDays
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Total comments",
						value: comments.length
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "Last 8 weeks",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: 260,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: weekly,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									stroke: "var(--border)",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "week",
									stroke: "var(--muted-foreground)",
									fontSize: 12
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									allowDecimals: false,
									stroke: "var(--muted-foreground)",
									fontSize: 12
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
									background: "var(--card)",
									border: "1px solid var(--border)",
									borderRadius: 8
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "submissions",
									fill: "var(--chart-1)",
									radius: [
										4,
										4,
										0,
										0
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "comments",
									fill: "var(--chart-4)",
									radius: [
										4,
										4,
										0,
										0
									]
								})
							]
						})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					title: "Status breakdown",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: 200,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
							data: pie,
							dataKey: "value",
							innerRadius: 50,
							outerRadius: 80,
							paddingAngle: 2,
							children: pie.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: p.color }, p.name))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {})] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex justify-center gap-4 text-xs",
						children: pie.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "size-2 rounded-full",
									style: { background: p.color }
								}),
								p.name,
								" ",
								p.value
							]
						}, p.name))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "By designer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { rows: byDesigner.map((d) => [d.name, `${d.approved}/${d.total} approved`]) })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "Most active commenters",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { rows: byReviewer.map((r) => [r.name, `${r.n} comments`]) })
				})]
			})
		]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border bg-card p-5 shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 font-display text-3xl font-bold",
			children: value
		})]
	});
}
function Card({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border bg-card p-5 shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mb-4 font-semibold",
			children: title
		}), children]
	});
}
function List({ rows }) {
	if (!rows.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "No data yet."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "divide-y text-sm",
		children: rows.map(([a, b], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "flex justify-between py-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: a }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted-foreground",
				children: b
			})]
		}, i))
	});
}
//#endregion
export { Reports as component };
