-- Create ERP Database Tables for Bhagyalaxmi lawns

-- 1. Bookings Table
create table if not exists public.bookings (
  id text primary key,
  customer_name text not null,
  customer_photo text,
  email text not null,
  phone_number text not null,
  venue_name text not null,
  booking_date text not null,
  guest_count integer not null,
  amount integer not null,
  advance_paid integer not null,
  status text not null,
  progress integer not null,
  package_selected text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Booking Requests Table
create table if not exists public.booking_requests (
  id text primary key,
  customer_name text not null,
  phone_number text not null,
  email text not null,
  venue text not null,
  event_type text not null,
  event_date text not null,
  event_session text not null,
  guests integer not null,
  package_selected text not null,
  vendors jsonb not null default '{}'::jsonb,
  additional_services text[] not null default '{}'::text[],
  pricing_breakdown jsonb not null default '{}'::jsonb,
  status text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Vendors Table
create table if not exists public.vendors (
  id text primary key,
  name text not null,
  category text not null,
  logo text,
  cover_image text,
  price integer not null,
  location text not null,
  phone text not null,
  email text not null,
  instagram text,
  whatsapp text,
  commission_percentage integer not null,
  rating numeric not null default 4.8,
  completed_weddings integer not null default 0,
  featured boolean not null default false,
  gallery text[] not null default '{}'::text[],
  menu_items jsonb default '[]'::jsonb,
  photography_portfolio jsonb default '[]'::jsonb
);

-- 4. Invoices Table
create table if not exists public.invoices (
  id text primary key,
  booking_id text not null,
  client_name text not null,
  date text not null,
  amount integer not null,
  status text not null,
  gst_number text
);

-- 5. Expenses Table
create table if not exists public.expenses (
  id text primary key,
  category text not null,
  amount integer not null,
  date text not null,
  description text,
  logged_by text not null
);

-- 6. Generator Logs Table
create table if not exists public.generator_logs (
  id text primary key,
  date text not null,
  generator_name text not null,
  fuel_added integer not null,
  runtime_hours integer not null,
  operator_name text not null,
  notes text
);

-- 7. Kanban Tasks Table
create table if not exists public.kanban_tasks (
  id text primary key,
  title text not null,
  assignee text not null,
  due_date text not null,
  status text not null,
  priority text not null
);

-- 8. Audit Logs Table
create table if not exists public.audit_logs (
  id text primary key,
  timestamp text not null,
  "user" text not null,
  action text not null,
  ip_address text not null,
  status text not null
);

-- Enable RLS for all tables (for public dashboard viewing under sandbox bypass, or role-based read/write checks)
alter table public.bookings enable row level security;
alter table public.booking_requests enable row level security;
alter table public.vendors enable row level security;
alter table public.invoices enable row level security;
alter table public.expenses enable row level security;
alter table public.generator_logs enable row level security;
alter table public.kanban_tasks enable row level security;
alter table public.audit_logs enable row level security;

-- Create basic policies allowing all actions for authenticated users (Owner, Accountant, Manager, Staff, etc.)
create policy "Allow all actions for authenticated users on bookings" on public.bookings for all to authenticated using (true);
create policy "Allow all actions for authenticated users on requests" on public.booking_requests for all to authenticated using (true);
create policy "Allow all actions for authenticated users on vendors" on public.vendors for all to authenticated using (true);
create policy "Allow all actions for authenticated users on invoices" on public.invoices for all to authenticated using (true);
create policy "Allow all actions for authenticated users on expenses" on public.expenses for all to authenticated using (true);
create policy "Allow all actions for authenticated users on generator_logs" on public.generator_logs for all to authenticated using (true);
create policy "Allow all actions for authenticated users on kanban_tasks" on public.kanban_tasks for all to authenticated using (true);
create policy "Allow all actions for authenticated users on audit_logs" on public.audit_logs for all to authenticated using (true);

-- Seed default vegetarian vendors into cloud database
insert into public.vendors (id, name, category, logo, cover_image, price, location, phone, email, instagram, whatsapp, commission_percentage, rating, completed_weddings, featured, gallery, menu_items, photography_portfolio)
values 
  ('v-decor-1', 'Ahilya Florists & Decorators', 'Decoration', 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=200', 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=600', 35000, 'Ahilyanagar, Maharashtra', '+91 98500 12345', 'ahilya.decor@gmail.com', 'https://instagram.com/ahilya_decor', 'https://wa.me/919850012345', 10, 4.9, 142, true, '{"https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=600", "https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&q=80&w=600"}', '[]'::jsonb, '[]'::jsonb),
  ('v-catering-1', 'Bhagyalaxmi Pure Veg Caterers', 'Food Catering', 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=200', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600', 45000, 'Bhingar, Ahilyanagar', '+91 98909 07454', 'bhagyalaxmicatering@gmail.com', 'https://instagram.com/bhagyalaxmi_veg', 'https://wa.me/919890907454', 15, 4.8, 385, true, '{"https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=600"}', '[{"name": "Paneer Makhanwala", "description": "Rich tomato gravy paneer with real butter topping"}, {"name": "Maharashtrian Puran Poli", "description": "Authentic wheat flatbread stuffed with sweet lentil filling"}]'::jsonb, '[]'::jsonb),
  ('v-photo-1', 'Ahilya Wedding Studio', 'Photography', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=200', 'https://images.unsplash.com/photo-1520854221256-17451cc35953?auto=format&fit=crop&q=80&w=600', 25000, 'Ahilyanagar Main Market', '+91 94220 54321', 'ahilya.studio@gmail.com', 'https://instagram.com/ahilya_studio', 'https://wa.me/919422054321', 10, 4.7, 98, false, '{"https://images.unsplash.com/photo-1520854221256-17451cc35953?auto=format&fit=crop&q=80&w=600"}', '[]'::jsonb, '[{"name": "Drone Pre-Wedding Shoot", "image": "https://images.unsplash.com/photo-1520854221256-17451cc35953?auto=format&fit=crop&q=80&w=600"}]'::jsonb)
on conflict (id) do nothing;
