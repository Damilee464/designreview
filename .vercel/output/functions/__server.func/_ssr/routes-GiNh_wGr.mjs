import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-BJ-v0RHx.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { E as ChevronLeft, T as ChevronRight, _ as LayoutGrid, c as ShieldCheck, h as MessageSquareDot, j as ArrowRight, m as Moon, o as Sun, s as Star, t as Zap, v as GitBranch } from "../_libs/lucide-react.mjs";
import { t as useDarkMode } from "./use-dark-mode-Dg3KrX_4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-GiNh_wGr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DarkModeToggle() {
	const [dark, setDark] = useDarkMode();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		"aria-label": dark ? "Switch to light mode" : "Switch to dark mode",
		onClick: () => setDark((d) => !d),
		className: "flex size-9 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted",
		children: dark ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "size-4" })
	});
}
var SHOWCASE_IMAGES = [
	{
		url: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=900&q=80&auto=format&fit=crop",
		label: "Design systems"
	},
	{
		url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=900&q=80&auto=format&fit=crop",
		label: "UI prototyping"
	},
	{
		url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=900&q=80&auto=format&fit=crop",
		label: "Collaborative review"
	},
	{
		url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=900&q=80&auto=format&fit=crop",
		label: "Team approvals"
	},
	{
		url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&q=80&auto=format&fit=crop",
		label: "Creative workflow"
	}
];
var STATS = [
	{
		value: "3×",
		label: "Faster approvals"
	},
	{
		value: "100%",
		label: "Version history"
	},
	{
		value: "0",
		label: "Lost feedback"
	}
];
function ImageCarousel() {
	const [current, setCurrent] = (0, import_react.useState)(0);
	const [animating, setAnimating] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const timer = setInterval(() => advance(1), 4500);
		return () => clearInterval(timer);
	}, [current]);
	function advance(dir) {
		if (animating) return;
		setAnimating(true);
		setTimeout(() => {
			setCurrent((c) => (c + dir + SHOWCASE_IMAGES.length) % SHOWCASE_IMAGES.length);
			setAnimating(false);
		}, 300);
	}
	const img = SHOWCASE_IMAGES[current];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group relative overflow-hidden rounded-2xl shadow-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `transition-opacity duration-300 ${animating ? "opacity-0" : "opacity-100"}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: img.url,
					alt: img.label,
					className: "aspect-[4/3] w-full object-cover",
					loading: "lazy"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute left-[22%] top-[20%] grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full rounded-bl-none bg-primary text-xs font-bold text-white shadow-lg",
				children: "1"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute left-[68%] top-[48%] grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full rounded-bl-none bg-primary text-xs font-bold text-white shadow-lg",
				children: "2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute left-[40%] top-[75%] grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full rounded-bl-none bg-primary text-xs font-bold text-white shadow-lg",
				children: "3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute bottom-4 left-4 right-4 flex items-end justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm",
					children: img.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-1",
					children: SHOWCASE_IMAGES.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							setAnimating(true);
							setTimeout(() => {
								setCurrent(i);
								setAnimating(false);
							}, 300);
						},
						className: `h-1.5 rounded-full transition-all ${i === current ? "w-6 bg-white" : "w-1.5 bg-white/40"}`,
						"aria-label": `Go to slide ${i + 1}`
					}, i))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => advance(-1),
				className: "absolute left-3 top-1/2 -translate-y-1/2 grid size-8 place-items-center rounded-full bg-black/30 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:bg-black/50",
				"aria-label": "Previous",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => advance(1),
				className: "absolute right-3 top-1/2 -translate-y-1/2 grid size-8 place-items-center rounded-full bg-black/30 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:bg-black/50",
				"aria-label": "Next",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })
			})
		]
	});
}
function Landing() {
	const [loggedIn, setLoggedIn] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		supabase.auth.getSession().then(({ data }) => {
			setLoggedIn(!!data.session);
		});
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-40 border-b border-border/50 bg-background/60 backdrop-blur-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl items-center justify-between px-6 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DarkModeToggle, {}), loggedIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/dashboard",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "size-3.5" }), " Dashboard"]
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/auth",
								children: "Sign in"
							})
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "mx-auto max-w-6xl px-6 pb-16 pt-16",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid items-center gap-12 lg:grid-cols-[1fr_1fr]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-1.5 text-xs font-medium text-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "size-3" }), "Design review & approval platform"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl",
								children: [
									"Feedback that lands",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "relative inline-block",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "relative z-10 text-primary",
											children: "exactly"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -bottom-1 left-0 right-0 h-3 rounded-full bg-primary/15" })]
									}),
									" ",
									"where it matters."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-6 max-w-md text-lg leading-relaxed text-muted-foreground",
								children: "Designers submit. Reviewers drop numbered pins right on the screen. Every version, comment and approval is kept on record — forever."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-8 flex gap-6",
								children: STATS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-display text-2xl font-bold text-primary",
									children: s.value
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: s.label
								})] }, s.label))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-8 flex flex-wrap gap-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									size: "lg",
									className: "rounded-xl px-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/auth",
										children: ["Sign in ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 flex items-center gap-2 text-sm text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex -space-x-2",
										children: [
											"bg-orange-400",
											"bg-blue-400",
											"bg-emerald-400",
											"bg-violet-400"
										].map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `grid size-7 place-items-center rounded-full border-2 border-background ${c} text-[10px] font-bold text-white`,
											children: [
												"A",
												"R",
												"D",
												"T"
											][i]
										}, i))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Trusted by design teams worldwide" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex text-amber-400",
										children: [...Array(5)].map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3 fill-current" }, i))
									})
								]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageCarousel, {})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "border-y border-border/60 bg-muted/30",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto max-w-6xl px-6 py-14",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-10 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-3xl font-bold",
								children: "Everything your team needs"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-muted-foreground",
								children: "No more endless email threads or lost Slack messages."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-5 md:grid-cols-3",
							children: [
								{
									icon: MessageSquareDot,
									t: "Pinned comments",
									d: "Click anywhere on a design to attach a numbered note. Everyone sees exactly what you mean.",
									color: "bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400"
								},
								{
									icon: GitBranch,
									t: "Version history",
									d: "V1, V2, V3 — each resubmission is tracked. Compare changes across every iteration.",
									color: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
								},
								{
									icon: ShieldCheck,
									t: "Clear approvals",
									d: "See who approved what, and when, at a glance. Full audit trail, always.",
									color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
								}
							].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "group rounded-2xl border bg-card p-7 shadow-card transition-shadow hover:shadow-lg",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `inline-flex rounded-xl p-3 ${f.color}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(f.icon, { className: "size-5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-5 text-lg font-semibold",
										children: f.t
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm leading-relaxed text-muted-foreground",
										children: f.d
									})
								]
							}, f.t))
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mx-auto max-w-6xl px-6 py-16",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-12 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-3xl font-bold",
							children: "How it works"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-muted-foreground",
							children: "Three roles, one smooth workflow."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-6 md:grid-cols-3",
						children: [
							{
								step: "01",
								role: "Designer",
								action: "Submits a design",
								detail: "Upload an image, PDF or paste a Figma link. Add context for reviewers."
							},
							{
								step: "02",
								role: "Reviewer",
								action: "Pins feedback",
								detail: "Click directly on the design to leave numbered, threaded comments."
							},
							{
								step: "03",
								role: "Admin",
								action: "Approves or requests changes",
								detail: "One-click approval with a full timestamp and audit history."
							}
						].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative rounded-2xl border bg-card p-7 shadow-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-display text-4xl font-bold text-primary/20",
									children: s.step
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 text-xs font-semibold uppercase tracking-widest text-primary",
									children: s.role
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-1 text-lg font-semibold",
									children: s.action
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm leading-relaxed text-muted-foreground",
									children: s.detail
								})
							]
						}, s.step))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "mx-auto max-w-6xl px-6 pb-20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative overflow-hidden rounded-3xl bg-primary px-10 py-14 text-center text-primary-foreground shadow-2xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -right-16 -top-16 size-64 rounded-full bg-white/10 blur-3xl" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-16 -left-16 size-64 rounded-full bg-white/10 blur-3xl" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-3xl font-bold md:text-4xl",
										children: "Ready to close the feedback loop?"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mx-auto mt-4 max-w-md text-primary-foreground/80",
										children: "Set up in minutes. Your first design review is waiting."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										size: "lg",
										className: "mt-8 rounded-xl bg-white px-8 text-primary hover:bg-white/90",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/auth",
											children: ["Create your account ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
										})
									})
								]
							})
						]
					})
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-border/60 bg-muted/20 py-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl items-center justify-between px-6 text-sm text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Design review made simple." })]
				})
			})
		]
	});
}
function Logo() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2 font-display text-lg font-bold",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "grid size-7 place-items-center rounded-md bg-primary text-sm text-primary-foreground",
			children: "D"
		}), "DesignReview"]
	});
}
//#endregion
export { Logo, Landing as component };
