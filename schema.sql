-- SoulVault AI Database Schema
-- Run this in your Supabase SQL Editor

-- Create Beneficiaries table
CREATE TABLE public.beneficiaries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    relationship TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Assets table
CREATE TABLE public.assets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    beneficiary_id UUID REFERENCES public.beneficiaries(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Memories table
CREATE TABLE public.memories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    beneficiary_id UUID REFERENCES public.beneficiaries(id) ON DELETE CASCADE NOT NULL,
    message TEXT NOT NULL,
    optional_audio_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Turn on Row Level Security (RLS)
ALTER TABLE public.beneficiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

-- Allow users to see and manage only their own data
CREATE POLICY "Users can manage their own beneficiaries" ON public.beneficiaries
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own assets" ON public.assets
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own memories" ON public.memories
    FOR ALL USING (auth.uid() = user_id);
