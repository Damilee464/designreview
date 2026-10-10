import { t as supabase } from "./client-BJ-v0RHx.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-BHbNCdDF.js
var STATUS_LABEL = {
	pending: "Pending",
	approved: "Approved",
	changes_requested: "Changes requested"
};
var meQuery = {
	queryKey: ["me"],
	queryFn: async () => {
		const { data: u } = await supabase.auth.getUser();
		if (!u.user) return null;
		const [{ data: profile }, { data: roles }] = await Promise.all([supabase.from("profiles").select("*").eq("id", u.user.id).maybeSingle(), supabase.from("user_roles").select("role").eq("user_id", u.user.id)]);
		const r = (roles ?? []).map((x) => x.role);
		return {
			id: u.user.id,
			email: u.user.email ?? "",
			name: profile?.full_name || u.user.email || "",
			roles: r,
			isAdmin: r.includes("admin"),
			isStaff: r.includes("admin") || r.includes("reviewer")
		};
	}
};
function useMe() {
	return useQuery(meQuery);
}
function useSignedUrl(path) {
	return useQuery({
		queryKey: ["signed", path],
		enabled: !!path,
		staleTime: 3e6,
		queryFn: async () => {
			const { data, error } = await supabase.storage.from("designs").createSignedUrl(path, 3600);
			if (error) throw error;
			return data.signedUrl;
		}
	});
}
function initials(name) {
	return name.split(/\s+/).filter(Boolean).slice(0, 2).map((s) => s[0]?.toUpperCase()).join("");
}
//#endregion
export { useSignedUrl as i, initials as n, useMe as r, STATUS_LABEL as t };
