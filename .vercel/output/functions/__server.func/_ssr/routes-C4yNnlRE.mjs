import { _ as createFileRoute, g as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C4yNnlRE.js
var import_jsx_runtime = require_jsx_runtime();
var $$splitComponentImporter = () => import("./routes-GiNh_wGr.mjs");
var Route = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "DesignReview — Submit, review and approve UI designs" },
		{
			name: "description",
			content: "One place for designers to submit work, reviewers to pin feedback, and teams to track every version to approval."
		},
		{
			property: "og:title",
			content: "DesignReview — Submit, review and approve UI designs"
		},
		{
			property: "og:description",
			content: "Pinned feedback, version history and approvals for UI/UX teams."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
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
export { Route as n, Logo as t };
