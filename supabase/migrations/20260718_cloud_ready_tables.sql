-- 1. Create Customers Table
create table if not exists public.customers (
  id text primary key,
  name text not null,
  photo text,
  phone text not null,
  email text not null,
  address text,
  total_spent integer not null default 0,
  booking_count integer not null default 0,
  notes jsonb not null default '[]'::jsonb,
  whatsapp_history jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create ERP Config Table
create table if not exists public.erp_config (
  id text primary key default 'default',
  hall_price integer not null default 90000,
  hall_lawn_price integer not null default 130000,
  generator_cost_per_hour integer not null default 2500,
  electricity_cost_per_unit integer not null default 12,
  gst_percentage integer not null default 18,
  discount_default integer not null default 0,
  invoice_template text not null default 'Luxury Royal Theme',
  vendor_categories text[] not null default '{Decoration, "Food Catering", Photography, Videography, DJ, Lighting, Security, Generator, Cleaning, "Welcome Band", Pandit, "Luxury Cars", "Horse Entry", "Makeup Artist", "Invitation Cards", "Live Counter", Cake}'::text[],
  package_templates jsonb not null default '[
    {"name": "Silver", "pricePerGuest": 180, "decorationLevel": "Basic", "lighting": "Standard", "stage": "Basic Layout", "flowerWork": "Minimal Marigold", "bridalRoom": "Non-AC Standard", "description": "Essential package for intimate gatherings"},
    {"name": "Gold", "pricePerGuest": 300, "decorationLevel": "Premium", "lighting": "Ambiance LED", "stage": "Grand Backdrop", "flowerWork": "Marigold Arches + Roses", "bridalRoom": "Centrally AC", "description": "Elegant features with enhanced decorations"},
    {"name": "Royal", "pricePerGuest": 450, "decorationLevel": "Luxury Theme", "lighting": "Intelligent moving heads", "stage": "Maharajah Theme Stage", "flowerWork": "Exotic Orchids & Lilies", "bridalRoom": "AC Suite with Lounge", "description": "Royal theme setting for grand Indian weddings"},
    {"name": "Luxury", "pricePerGuest": 650, "decorationLevel": "Ultra Luxury Custom", "lighting": "Laser and spotlight grids", "stage": "Royal Palace Replica", "flowerWork": "Imported Carnations & Orchids", "bridalRoom": "VIP Suite + Extra Guest Rooms", "description": "The ultimate luxury statement with custom layouts"}
  ]'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Enable RLS
alter table public.customers enable row level security;
alter table public.erp_config enable row level security;

-- 4. Policies for Authenticated Users
create policy "Allow all actions for authenticated users on customers" on public.customers for all to authenticated using (true);
create policy "Allow all actions for authenticated users on erp_config" on public.erp_config for all to authenticated using (true);

-- 5. Seed default configurations
insert into public.erp_config (id, hall_price, hall_lawn_price, generator_cost_per_hour, electricity_cost_per_unit, gst_percentage, discount_default, invoice_template)
values ('default', 90000, 130000, 2500, 12, 18, 0, 'Luxury Royal Theme')
on conflict (id) do nothing;
