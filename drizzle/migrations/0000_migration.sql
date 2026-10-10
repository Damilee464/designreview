create type public.app_role as enum ('admin','reviewer','designer');
create type public.design_status as enum ('pending','approved','changes_requested');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text not null default '',
  created_at timestamptz not null default now()
);
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_by uuid,
  created_at timestamptz not null default now()
);
create table public.designs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  project_id uuid references public.projects(id) on delete set null,
  designer_id uuid not null references public.profiles(id) on delete cascade,
  status design_status not null default 'pending',
  current_version int not null default 1,
  approved_by uuid references public.profiles(id),
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.design_versions (
  id uuid primary key default gen_random_uuid(),
  design_id uuid not null references public.designs(id) on delete cascade,
  version_number int not null,
  file_path text,
  file_type text,
  figma_url text,
  notes text not null default '',
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  unique (design_id, version_number)
);
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  design_id uuid not null references public.designs(id) on delete cascade,
  version_id uuid not null references public.design_versions(id) on delete cascade,
  author_id uuid not null references public.profiles(id),
  parent_id uuid references public.comments(id) on delete cascade,
  body text not null,
  pin_x numeric,
  pin_y numeric,
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);
create table public.design_events (
  id uuid primary key default gen_random_uuid(),
  design_id uuid not null references public.designs(id) on delete cascade,
  actor_id uuid references public.profiles(id),
  kind text not null,
  detail text not null default '',
  created_at timestamptz not null default now()
);
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  design_id uuid references public.designs(id) on delete cascade,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

grant select on public.profiles, public.user_roles, public.projects, public.designs, public.design_versions, public.comments, public.design_events, public.notifications to authenticated;
grant insert, update on public.profiles to authenticated;
grant insert, update, delete on public.user_roles, public.projects to authenticated;
grant insert, update, delete on public.designs, public.design_versions, public.comments to authenticated;
grant update, delete on public.notifications to authenticated;
grant all on public.profiles, public.user_roles, public.projects, public.designs, public.design_versions, public.comments, public.design_events, public.notifications to service_role;

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.projects enable row level security;
alter table public.designs enable row level security;
alter table public.design_versions enable row level security;
alter table public.comments enable row level security;
alter table public.design_events enable row level security;
alter table public.notifications enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;
create or replace function public.is_staff(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role in ('admin','reviewer'))
$$;

-- policies
create policy "team reads profiles" on public.profiles for select to authenticated using (true);
create policy "own profile update" on public.profiles for update to authenticated using (auth.uid() = id);
create policy "team reads roles" on public.user_roles for select to authenticated using (true);
create policy "admin manages roles ins" on public.user_roles for insert to authenticated with check (public.has_role(auth.uid(),'admin'));
create policy "admin manages roles del" on public.user_roles for delete to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "team reads projects" on public.projects for select to authenticated using (true);
create policy "team creates projects" on public.projects for insert to authenticated with check (auth.uid() = created_by);
create policy "admin edits projects" on public.projects for update to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin deletes projects" on public.projects for delete to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "team reads designs" on public.designs for select to authenticated using (true);
create policy "designer creates design" on public.designs for insert to authenticated with check (auth.uid() = designer_id);
create policy "owner or staff updates design" on public.designs for update to authenticated using (auth.uid() = designer_id or public.is_staff(auth.uid()));
create policy "owner or admin deletes design" on public.designs for delete to authenticated using (auth.uid() = designer_id or public.has_role(auth.uid(),'admin'));
create policy "team reads versions" on public.design_versions for select to authenticated using (true);
create policy "owner adds version" on public.design_versions for insert to authenticated with check (
  auth.uid() = created_by and exists (select 1 from public.designs d where d.id = design_id and d.designer_id = auth.uid()));
create policy "team reads comments" on public.comments for select to authenticated using (true);
create policy "team writes comments" on public.comments for insert to authenticated with check (auth.uid() = author_id);
create policy "author or staff updates comment" on public.comments for update to authenticated using (auth.uid() = author_id or public.is_staff(auth.uid()));
create policy "author deletes comment" on public.comments for delete to authenticated using (auth.uid() = author_id);
create policy "team reads events" on public.design_events for select to authenticated using (true);
create policy "own notifications" on public.notifications for select to authenticated using (auth.uid() = user_id);
create policy "own notifications upd" on public.notifications for update to authenticated using (auth.uid() = user_id);
create policy "own notifications del" on public.notifications for delete to authenticated using (auth.uid() = user_id);

-- signup: profile + role (first user = admin)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email,'@',1)), coalesce(new.email,''));
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  else
    insert into public.user_roles (user_id, role) values (new.id, 'designer');
  end if;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- status guard + events + notifications
create or replace function public.designs_before_update()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.updated_at := now();
  if new.status is distinct from old.status then
    if new.status in ('approved','changes_requested') and not public.is_staff(auth.uid()) then
      raise exception 'Only reviewers can approve or request changes';
    end if;
    if new.status = 'approved' then
      new.approved_by := auth.uid(); new.approved_at := now();
    else
      new.approved_by := null; new.approved_at := null;
    end if;
  end if;
  if not public.is_staff(auth.uid()) and (new.approved_by is distinct from old.approved_by) and new.status = old.status then
    new.approved_by := old.approved_by; new.approved_at := old.approved_at;
  end if;
  return new;
end $$;
create trigger designs_bu before update on public.designs for each row execute function public.designs_before_update();

create or replace function public.designs_after_update()
returns trigger language plpgsql security definer set search_path = public as $$
declare actor text;
begin
  if new.status is distinct from old.status then
    select full_name into actor from public.profiles where id = auth.uid();
    insert into public.design_events (design_id, actor_id, kind, detail)
      values (new.id, auth.uid(), 'status', new.status::text);
    if auth.uid() is distinct from new.designer_id then
      insert into public.notifications (user_id, design_id, message) values (new.designer_id, new.id,
        coalesce(actor,'A reviewer') || case new.status when 'approved' then ' approved "' when 'changes_requested' then ' requested changes on "' else ' moved to pending "' end || new.title || '"');
    end if;
  end if;
  return new;
end $$;
create trigger designs_au after update on public.designs for each row execute function public.designs_after_update();

create or replace function public.designs_after_insert()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.design_events (design_id, actor_id, kind, detail) values (new.id, new.designer_id, 'submitted', '');
  insert into public.notifications (user_id, design_id, message)
    select distinct ur.user_id, new.id, 'New design submitted: "' || new.title || '"'
    from public.user_roles ur where ur.role in ('admin','reviewer') and ur.user_id <> new.designer_id;
  return new;
end $$;
create trigger designs_ai after insert on public.designs for each row execute function public.designs_after_insert();

create or replace function public.versions_after_insert()
returns trigger language plpgsql security definer set search_path = public as $$
declare d public.designs;
begin
  if new.version_number > 1 then
    update public.designs set current_version = new.version_number, status = 'pending' where id = new.design_id returning * into d;
    insert into public.design_events (design_id, actor_id, kind, detail) values (new.design_id, new.created_by, 'version', 'v' || new.version_number);
    insert into public.notifications (user_id, design_id, message)
      select distinct ur.user_id, d.id, 'v' || new.version_number || ' uploaded for "' || d.title || '"'
      from public.user_roles ur where ur.role in ('admin','reviewer') and ur.user_id <> new.created_by;
  end if;
  return new;
end $$;
create trigger versions_ai after insert on public.design_versions for each row execute function public.versions_after_insert();

create or replace function public.comments_after_insert()
returns trigger language plpgsql security definer set search_path = public as $$
declare d public.designs; actor text;
begin
  select * into d from public.designs where id = new.design_id;
  select full_name into actor from public.profiles where id = new.author_id;
  if new.author_id <> d.designer_id then
    insert into public.notifications (user_id, design_id, message) values (d.designer_id, d.id, coalesce(actor,'Someone') || ' commented on "' || d.title || '"');
  else
    insert into public.notifications (user_id, design_id, message)
      select distinct c.author_id, d.id, coalesce(actor,'The designer') || ' replied on "' || d.title || '"'
      from public.comments c where c.design_id = d.id and c.author_id <> new.author_id;
  end if;
  return new;
end $$;
create trigger comments_ai after insert on public.comments for each row execute function public.comments_after_insert();

alter publication supabase_realtime add table public.notifications;

-- storage policies (bucket created separately)
create policy "team reads design files" on storage.objects for select to authenticated using (bucket_id = 'designs');
create policy "users upload own design files" on storage.objects for insert to authenticated with check (bucket_id = 'designs' and (storage.foldername(name))[1] = auth.uid()::text);