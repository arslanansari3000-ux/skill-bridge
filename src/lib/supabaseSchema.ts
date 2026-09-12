export const SUPABASE_SQL_SCHEMA = `-- ==============================================================================
-- SkillBridge SIH 2024-2026: Production Supabase DDL Schema & Row Level Security
-- ==============================================================================

-- 1. PROFILES & USER ROLES
create type user_role as enum ('student', 'industry', 'faculty');
create type skill_level as enum ('beginner', 'intermediate', 'advanced');
create type work_mode as enum ('remote', 'hybrid', 'on-site');
create type application_status as enum ('applied', 'under_review', 'shortlisted', 'interviewing', 'accepted', 'rejected');

create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  role user_role not null,
  email text not null unique,
  full_name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. STUDENT PROFILES
create table public.student_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade unique not null,
  college text not null,
  degree text not null,
  branch text not null,
  year text not null,
  cgpa numeric(3,2) check (cgpa >= 0.0 and cgpa <= 10.0),
  target_career_id text,
  resume_url text,
  bio text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. INDUSTRY RECRUITER PROFILES
create table public.industry_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade unique not null,
  company_name text not null,
  tagline text,
  industry_type text not null,
  location text not null,
  website text,
  is_verified boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. MASTER SKILLS CATALOG
create table public.skills (
  id text primary key,
  name text not null unique,
  category text not null,
  description text
);

-- 5. STUDENT SKILLS (Proficiency ratings)
create table public.student_skills (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references public.student_profiles(id) on delete cascade not null,
  skill_id text references public.skills(id) on delete cascade not null,
  level skill_level not null default 'beginner',
  unique(student_id, skill_id)
);

-- 6. CAREERS & BENCHMARKS
create table public.careers (
  id text primary key,
  title text not null,
  category text not null,
  description text not null,
  average_salary text,
  demand_trend text
);

create table public.career_skills (
  id uuid default gen_random_uuid() primary key,
  career_id text references public.careers(id) on delete cascade not null,
  skill_id text references public.skills(id) on delete cascade not null,
  required_level skill_level not null,
  weight integer default 1 check (weight between 1 and 3),
  unique(career_id, skill_id)
);

-- 7. INTERNSHIP LISTINGS
create table public.internships (
  id uuid default gen_random_uuid() primary key,
  company_id uuid references public.industry_profiles(id) on delete cascade not null,
  title text not null,
  location text not null,
  work_mode work_mode not null default 'hybrid',
  duration text not null,
  stipend text not null,
  eligibility text not null,
  deadline date not null,
  description text not null,
  openings integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.internship_skills (
  id uuid default gen_random_uuid() primary key,
  internship_id uuid references public.internships(id) on delete cascade not null,
  skill_id text references public.skills(id) on delete cascade not null,
  minimum_level skill_level not null default 'beginner',
  unique(internship_id, skill_id)
);

-- 8. APPLICATIONS & CANDIDATE EVALUATION
create table public.applications (
  id uuid default gen_random_uuid() primary key,
  internship_id uuid references public.internships(id) on delete cascade not null,
  student_id uuid references public.student_profiles(id) on delete cascade not null,
  match_score integer check (match_score between 0 and 100),
  status application_status default 'applied' not null,
  cover_note text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(internship_id, student_id)
);

-- 9. SAVED INTERNSHIPS
create table public.saved_internships (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references public.student_profiles(id) on delete cascade not null,
  internship_id uuid references public.internships(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(student_id, internship_id)
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
alter table public.student_profiles enable row level security;
alter table public.industry_profiles enable row level security;
alter table public.student_skills enable row level security;
alter table public.internships enable row level security;
alter table public.applications enable row level security;

-- Student RLS: Students can view/edit only their own profile
create policy "Students can update own profile"
  on public.student_profiles for all
  using (auth.uid() = user_id);

-- Industry RLS: Recruiters manage only their own internship listings
create policy "Companies can manage own postings"
  on public.internships for all
  using (company_id in (select id from public.industry_profiles where user_id = auth.uid()));

-- Applications RLS: Students can view their own, Recruiters can view applicants for their postings
create policy "Students view own applications"
  on public.applications for select
  using (student_id in (select id from public.student_profiles where user_id = auth.uid()));

create policy "Recruiters view applicants to their jobs"
  on public.applications for select
  using (internship_id in (
    select i.id from public.internships i
    join public.industry_profiles p on i.company_id = p.id
    where p.user_id = auth.uid()
  ));
`;
