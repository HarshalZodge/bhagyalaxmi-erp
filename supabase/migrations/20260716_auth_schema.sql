-- Create profiles table linked to auth.users
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null unique,
  name text,
  avatar_url text,
  role text check (role in ('Super Admin', 'Owner', 'Manager', 'Accountant', 'Staff', 'Client')) default 'Client',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Create Security Policies
-- 1. Profiles read access is permitted for anyone authenticated
create policy "Allow profile viewing for authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

-- 2. Profiles self updates allowed
create policy "Allow individual profile updates"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 3. Super Admin & Owner have write control over all user roles
create policy "Allow owners/admins to update roles"
  on public.profiles for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('Super Admin', 'Owner')
    )
  );

-- Create a trigger that automatically inserts profile logs on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, avatar_url, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    -- Default first signup or specific emails to Owner, else Client
    CASE 
      WHEN lower(NEW.email) IN ('owner@bhagyalaxmi.com', 'admin@bhagyalaxmi.com', 'harshalzodge123@gmail.com', 'deepakzodge455@gmail.com', 'kiranzodge123@gmail.com') THEN 'Owner'::text
      ELSE 'Client'::text
    END
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
