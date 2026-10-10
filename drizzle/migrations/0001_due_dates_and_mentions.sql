alter table public.designs add column due_date date;
alter table public.comments add column mentions uuid[] not null default '{}';

CREATE OR REPLACE FUNCTION public.comments_after_insert()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
declare d public.designs; actor text;
begin
  select * into d from public.designs where id = new.design_id;
  select full_name into actor from public.profiles where id = new.author_id;
  insert into public.notifications (user_id, design_id, message)
    select distinct m, d.id, coalesce(actor,'Someone') || ' mentioned you on "' || d.title || '"'
    from unnest(new.mentions) as m
    where m <> new.author_id and exists (select 1 from public.profiles p where p.id = m);
  if new.author_id <> d.designer_id then
    if not (d.designer_id = any(new.mentions)) then
      insert into public.notifications (user_id, design_id, message) values (d.designer_id, d.id, coalesce(actor,'Someone') || ' commented on "' || d.title || '"');
    end if;
  else
    insert into public.notifications (user_id, design_id, message)
      select distinct c.author_id, d.id, coalesce(actor,'The designer') || ' replied on "' || d.title || '"'
      from public.comments c where c.design_id = d.id and c.author_id <> new.author_id and not (c.author_id = any(new.mentions));
  end if;
  return new;
end $function$;