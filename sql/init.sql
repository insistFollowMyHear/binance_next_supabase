-- Create binance_users table
create table if not exists public.binance_users (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  api_key text not null,
  secret_key text not null,
  nickname text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- Set up RLS (Row Level Security)
alter table public.binance_users enable row level security;

-- Create policies
create policy "Users can view their own binance keys"
  on public.binance_users for select
  using (auth.uid() = user_id);

create policy "Users can insert their own binance keys"
  on public.binance_users for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own binance keys"
  on public.binance_users for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Grant access to authenticated users
grant select, insert, update on public.binance_users to authenticated;