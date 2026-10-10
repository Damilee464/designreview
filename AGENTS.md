<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Data access goes through the browser Cloud client with RLS; workflow side effects (status guards, history events, notifications) live in database triggers so they can't be bypassed from the client.
- Signed-in pages live under src/routes/_authenticated (client-only gate); roles come from the user_roles table, first signup becomes admin.
