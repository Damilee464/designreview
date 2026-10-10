import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as STATUS_LABEL } from "./app-BHbNCdDF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/StatusBadge-m5x-TM83.js
var import_jsx_runtime = require_jsx_runtime();
var status = cva("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium", { variants: { s: {
	pending: "bg-pending-soft text-pending",
	approved: "bg-approved-soft text-approved",
	changes_requested: "bg-changes-soft text-changes"
} } });
function StatusBadge({ value, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn(status({ s: value }), className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-current" }), STATUS_LABEL[value]]
	});
}
//#endregion
export { StatusBadge as t };
