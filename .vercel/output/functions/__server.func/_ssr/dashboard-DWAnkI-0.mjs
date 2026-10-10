import { t as supabase } from "./client-BJ-v0RHx.mjs";
import { _ as createFileRoute, g as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-DWAnkI-0.js
var $$splitComponentImporter = () => import("./dashboard-CIa4uW5w.mjs");
var Route = createFileRoute("/_authenticated/dashboard")({
	head: () => ({ meta: [{ title: "Dashboard — DesignReview" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var designsQuery = {
	queryKey: ["designs"],
	queryFn: async () => {
		const { data, error } = await supabase.from("designs").select("*, projects(name), designer:profiles!designs_designer_id_fkey(full_name)").order("updated_at", { ascending: false });
		if (error) throw error;
		return data;
	}
};
//#endregion
export { designsQuery as n, Route as t };
