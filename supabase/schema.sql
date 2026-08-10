create table if not exists public.birthday_configs (
    id uuid primary key default gen_random_uuid(),

    
    name text not null,
    slug text not null unique,

   
    birthday_date date not null,
    birthday_time time not null default '00:00:00',
    timezone text not null default 'Europe/Bucharest',

    
    title text,
    message text,

    
    theme text not null default 'default',

    
    enable_confetti boolean not null default true,
    enable_music boolean not null default false,

    
    is_primary boolean not null default false,

    
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);



create index if not exists birthday_configs_slug_idx
on public.birthday_configs(slug);

create index if not exists birthday_configs_primary_idx
on public.birthday_configs(is_primary);




alter table public.birthday_configs enable row level security;



drop policy if exists "Anyone can view birthdays"
on public.birthday_configs;

create policy "Anyone can view birthdays"
on public.birthday_configs
for select
to anon, authenticated
using (true);




drop policy if exists "Authenticated users can insert birthdays"
on public.birthday_configs;

create policy "Authenticated users can insert birthdays"
on public.birthday_configs
for insert
to authenticated
with check (true);




drop policy if exists "Authenticated users can update birthdays"
on public.birthday_configs;

create policy "Authenticated users can update birthdays"
on public.birthday_configs
for update
to authenticated
using (true)
with check (true);




drop policy if exists "Authenticated users can delete birthdays"
on public.birthday_configs;

create policy "Authenticated users can delete birthdays"
on public.birthday_configs
for delete
to authenticated
using (true);


create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;


drop trigger if exists birthday_configs_updated_at
on public.birthday_configs;

create trigger birthday_configs_updated_at
before update on public.birthday_configs
for each row
execute function public.update_updated_at();




create unique index if not exists one_primary_birthday
on public.birthday_configs(is_primary)
where is_primary = true;