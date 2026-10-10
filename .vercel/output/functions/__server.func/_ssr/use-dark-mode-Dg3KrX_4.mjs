import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-dark-mode-Dg3KrX_4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function useDarkMode() {
	const [dark, setDark] = (0, import_react.useState)(() => {
		if (typeof window === "undefined") return false;
		const stored = localStorage.getItem("theme");
		if (stored) return stored === "dark";
		return window.matchMedia("(prefers-color-scheme: dark)").matches;
	});
	(0, import_react.useEffect)(() => {
		const root = document.documentElement;
		if (dark) {
			root.classList.add("dark");
			localStorage.setItem("theme", "dark");
		} else {
			root.classList.remove("dark");
			localStorage.setItem("theme", "light");
		}
	}, [dark]);
	return [dark, setDark];
}
//#endregion
export { useDarkMode as t };
