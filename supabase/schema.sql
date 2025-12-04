-- =============================================
-- MEDIFLY AI CONCIERGE - SUPABASE DATABASE SCHEMA
-- =============================================
-- Version: 1.0.0
-- Created: 2025-12-04
-- Description: Complete database schema for medical tourism platform
-- =============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search
CREATE EXTENSION IF NOT EXISTS "postgis"; -- For geospatial queries (optional but recommended)

-- =============================================
-- 1. ENUM TYPES
-- =============================================

CREATE TYPE user_role AS ENUM ('patient', 'admin', 'hospital_admin', 'doctor');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed', 'no_show');
CREATE TYPE entity_type AS ENUM ('hospital', 'doctor', 'package', 'article', 'research', 'treatment');
CREATE TYPE message_role AS ENUM ('user', 'assistant', 'system');
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');
CREATE TYPE price_range_type AS ENUM ('$', '$$', '$$$');

-- =============================================
-- 2. CORE TABLES - USERS & AUTH
-- =============================================

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    phone TEXT,
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    country_of_origin TEXT,
    city TEXT,
    preferred_language TEXT DEFAULT 'en',
    role user_role DEFAULT 'patient',
    is_verified BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
);

-- =============================================
-- 3. CORE TABLES - HOSPITALS
-- =============================================

-- Countries table
CREATE TABLE public.countries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    code TEXT UNIQUE NOT NULL, -- ISO 3166-1 alpha-2
    flag_emoji TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cities table
CREATE TABLE public.cities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    country_id UUID REFERENCES public.countries(id) ON DELETE CASCADE,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    timezone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(name, country_id)
);

-- Specializations/Medical Departments
CREATE TABLE public.specializations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon_name TEXT, -- Lucide icon name for UI
    semantic_keywords TEXT[], -- For AI semantic search
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Accreditations
CREATE TABLE public.accreditations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL, -- JCI, GHA, MSQH, etc.
    full_name TEXT,
    description TEXT,
    logo_url TEXT,
    website_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Languages
CREATE TABLE public.languages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL, -- English, Mandarin, etc.
    code TEXT UNIQUE NOT NULL, -- en, zh, th, etc.
    native_name TEXT, -- 中文, ภาษาไทย, etc.
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hospitals
CREATE TABLE public.hospitals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    city_id UUID REFERENCES public.cities(id),
    country_id UUID REFERENCES public.countries(id),
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    rating DECIMAL(2, 1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER DEFAULT 0,
    price_range price_range_type DEFAULT '$$',
    bed_count INTEGER,
    specialist_count INTEGER,
    patient_count_annual INTEGER,
    established_year INTEGER,
    image_url TEXT,
    logo_url TEXT,
    website_url TEXT,
    phone TEXT,
    email TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}', -- For additional flexible data
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hospital Images Gallery
CREATE TABLE public.hospital_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    category TEXT, -- 'exterior', 'room', 'facility', 'equipment', etc.
    display_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hospital Specializations (Many-to-Many)
CREATE TABLE public.hospital_specializations (
    hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE,
    specialization_id UUID REFERENCES public.specializations(id) ON DELETE CASCADE,
    is_center_of_excellence BOOLEAN DEFAULT FALSE,
    description TEXT,
    PRIMARY KEY (hospital_id, specialization_id)
);

-- Hospital Accreditations (Many-to-Many)
CREATE TABLE public.hospital_accreditations (
    hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE,
    accreditation_id UUID REFERENCES public.accreditations(id) ON DELETE CASCADE,
    certified_date DATE,
    expiry_date DATE,
    certificate_url TEXT,
    PRIMARY KEY (hospital_id, accreditation_id)
);

-- Hospital Languages (Many-to-Many)
CREATE TABLE public.hospital_languages (
    hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE,
    language_id UUID REFERENCES public.languages(id) ON DELETE CASCADE,
    PRIMARY KEY (hospital_id, language_id)
);

-- Hospital Awards
CREATE TABLE public.hospital_awards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    organization TEXT,
    year INTEGER,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hospital Facilities
CREATE TABLE public.hospital_facilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE,
    category TEXT NOT NULL, -- 'Medical Centre', 'Technology', 'Patient Care', 'Amenities'
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hospital Insurance Partners
CREATE TABLE public.insurance_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.hospital_insurance (
    hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE,
    insurance_id UUID REFERENCES public.insurance_providers(id) ON DELETE CASCADE,
    supports_direct_billing BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (hospital_id, insurance_id)
);

-- =============================================
-- 4. CORE TABLES - DOCTORS
-- =============================================

CREATE TABLE public.doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    title TEXT, -- Dr., Prof., etc.
    gender gender_type,
    hospital_id UUID REFERENCES public.hospitals(id) ON DELETE SET NULL,
    specialization_id UUID REFERENCES public.specializations(id),
    sub_specialization TEXT,
    description TEXT,
    image_url TEXT,
    experience_years INTEGER,
    rating DECIMAL(2, 1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER DEFAULT 0,
    consultation_fee_min DECIMAL(12, 2),
    consultation_fee_max DECIMAL(12, 2),
    currency TEXT DEFAULT 'USD',
    education JSONB DEFAULT '[]', -- [{degree, institution, year}]
    certifications JSONB DEFAULT '[]', -- [{name, issuer, year}]
    publications_count INTEGER DEFAULT 0,
    is_accepting_patients BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Doctor Languages (Many-to-Many)
CREATE TABLE public.doctor_languages (
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
    language_id UUID REFERENCES public.languages(id) ON DELETE CASCADE,
    proficiency TEXT, -- 'native', 'fluent', 'conversational'
    PRIMARY KEY (doctor_id, language_id)
);

-- Doctor Procedures
CREATE TABLE public.doctor_procedures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    typical_duration TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Doctor Availability (for scheduling)
CREATE TABLE public.doctor_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
    day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday
    start_time TIME,
    end_time TIME,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 5. CORE TABLES - MEDICAL PACKAGES
-- =============================================

CREATE TABLE public.package_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon_name TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.medical_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.package_categories(id),
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    price DECIMAL(12, 2) NOT NULL,
    original_price DECIMAL(12, 2),
    currency TEXT DEFAULT 'IDR',
    discount_percentage INTEGER,
    valid_from DATE,
    valid_until DATE,
    inclusions JSONB DEFAULT '[]', -- List of what's included
    exclusions JSONB DEFAULT '[]', -- List of what's not included
    preparation_instructions TEXT,
    duration_hours DECIMAL(4, 1),
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    booking_count INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(hospital_id, slug)
);

-- Package Tags
CREATE TABLE public.package_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    package_id UUID REFERENCES public.medical_packages(id) ON DELETE CASCADE,
    tag TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 6. CHAT & AI CONVERSATION TABLES
-- =============================================

CREATE TABLE public.chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT, -- Auto-generated from first message
    message_count INTEGER DEFAULT 0,
    last_filters JSONB DEFAULT '{}', -- Persisted filter state
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    role message_role NOT NULL,
    content TEXT NOT NULL,
    thinking TEXT, -- AI reasoning process

    -- Attachment data
    attachment_name TEXT,
    attachment_type TEXT,
    attachment_url TEXT,

    -- AI response metadata
    suggested_filters JSONB, -- Filter suggestions from AI
    suggested_actions JSONB DEFAULT '[]', -- Action buttons
    follow_up_questions JSONB DEFAULT '[]',
    inline_results JSONB DEFAULT '[]', -- Hospital/Doctor cards
    inline_result_total_count INTEGER,
    sources JSONB DEFAULT '[]', -- Web citations
    search_queries TEXT[],

    -- Artifact data (charts, comparisons)
    artifact_type TEXT, -- 'comparison', 'chart', etc.
    artifact_data JSONB,

    tokens_used INTEGER,
    model_used TEXT,
    latency_ms INTEGER,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 7. USER PREFERENCES & INTERACTIONS
-- =============================================

-- User Favorites
CREATE TABLE public.user_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    entity_type entity_type NOT NULL,
    entity_id UUID NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, entity_type, entity_id)
);

-- User Comparisons (saved comparison lists)
CREATE TABLE public.user_comparisons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    entity_type entity_type NOT NULL, -- 'hospital' or 'doctor'
    entity_ids UUID[] NOT NULL, -- Array of up to 3 IDs
    title TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Search History
CREATE TABLE public.user_search_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    filters JSONB,
    result_count INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Recently Viewed
CREATE TABLE public.user_recently_viewed (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    entity_type entity_type NOT NULL,
    entity_id UUID NOT NULL,
    viewed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, entity_type, entity_id)
);

-- =============================================
-- 8. BOOKINGS & APPOINTMENTS
-- =============================================

CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    hospital_id UUID REFERENCES public.hospitals(id),
    doctor_id UUID REFERENCES public.doctors(id),
    package_id UUID REFERENCES public.medical_packages(id),

    booking_type TEXT NOT NULL, -- 'consultation', 'package', 'treatment'
    status booking_status DEFAULT 'pending',

    -- Patient Info (can be different from user)
    patient_name TEXT NOT NULL,
    patient_email TEXT,
    patient_phone TEXT,
    patient_dob DATE,
    patient_nationality TEXT,

    -- Appointment Details
    preferred_date DATE,
    preferred_time TIME,
    confirmed_date DATE,
    confirmed_time TIME,
    duration_minutes INTEGER,

    -- Medical Details
    chief_complaint TEXT,
    medical_history TEXT,
    attachments JSONB DEFAULT '[]', -- [{name, url, type}]

    -- Pricing
    estimated_cost DECIMAL(12, 2),
    final_cost DECIMAL(12, 2),
    currency TEXT DEFAULT 'USD',
    payment_status TEXT DEFAULT 'unpaid',

    -- Notes
    patient_notes TEXT,
    hospital_notes TEXT,
    internal_notes TEXT,

    -- Tracking
    source TEXT, -- 'website', 'chat', 'phone'
    referral_code TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT
);

-- Booking Status History
CREATE TABLE public.booking_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    old_status booking_status,
    new_status booking_status NOT NULL,
    changed_by UUID REFERENCES public.users(id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 9. REVIEWS & RATINGS
-- =============================================

CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    entity_type entity_type NOT NULL,
    entity_id UUID NOT NULL,
    booking_id UUID REFERENCES public.bookings(id), -- Link to actual visit

    rating DECIMAL(2, 1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    content TEXT,

    -- Detailed ratings
    rating_service DECIMAL(2, 1),
    rating_facility DECIMAL(2, 1),
    rating_cleanliness DECIMAL(2, 1),
    rating_value DECIMAL(2, 1),
    rating_communication DECIMAL(2, 1),

    pros TEXT[],
    cons TEXT[],

    is_verified BOOLEAN DEFAULT FALSE, -- Verified patient
    is_anonymous BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE, -- Moderation

    helpful_count INTEGER DEFAULT 0,
    report_count INTEGER DEFAULT 0,

    response_text TEXT, -- Hospital/Doctor response
    response_by UUID REFERENCES public.users(id),
    response_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Review Helpful Votes
CREATE TABLE public.review_votes (
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    review_id UUID REFERENCES public.reviews(id) ON DELETE CASCADE,
    is_helpful BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, review_id)
);

-- =============================================
-- 10. CONTENT TABLES - ARTICLES & TREATMENTS
-- =============================================

CREATE TABLE public.articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    hero_image_url TEXT,

    author_name TEXT,
    author_title TEXT,
    author_image_url TEXT,

    category TEXT,
    tags TEXT[],

    hospital_id UUID REFERENCES public.hospitals(id), -- Related hospital
    specialization_id UUID REFERENCES public.specializations(id),

    read_time_minutes INTEGER,
    view_count INTEGER DEFAULT 0,

    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMPTZ,

    seo_title TEXT,
    seo_description TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.treatments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    specialization_id UUID REFERENCES public.specializations(id),

    overview TEXT,
    why_performed TEXT[], -- Reasons
    what_to_expect TEXT[], -- Expectations
    preparation TEXT,
    recovery TEXT,
    risks TEXT[],

    image_url TEXT,
    video_url TEXT,

    typical_duration TEXT,
    typical_cost_min DECIMAL(12, 2),
    typical_cost_max DECIMAL(12, 2),
    currency TEXT DEFAULT 'USD',

    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Treatments offered by hospitals
CREATE TABLE public.hospital_treatments (
    hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE,
    treatment_id UUID REFERENCES public.treatments(id) ON DELETE CASCADE,
    price_min DECIMAL(12, 2),
    price_max DECIMAL(12, 2),
    currency TEXT DEFAULT 'USD',
    PRIMARY KEY (hospital_id, treatment_id)
);

-- Research/Publications
CREATE TABLE public.research (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    abstract TEXT,
    hospital_id UUID REFERENCES public.hospitals(id),
    doctor_id UUID REFERENCES public.doctors(id),

    authors TEXT[],
    journal TEXT,
    publication_date DATE,
    doi TEXT,
    source_url TEXT,
    pdf_url TEXT,

    keywords TEXT[],
    specialization_id UUID REFERENCES public.specializations(id),

    citation_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 11. TESTIMONIALS
-- =============================================

CREATE TABLE public.testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT, -- 'Patient', 'Member', etc.
    country TEXT,
    thumbnail_url TEXT,
    video_url TEXT,
    quote TEXT,

    hospital_id UUID REFERENCES public.hospitals(id),
    doctor_id UUID REFERENCES public.doctors(id),
    treatment_received TEXT,

    rating DECIMAL(2, 1),
    is_featured BOOLEAN DEFAULT FALSE,
    is_video BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 12. NOTIFICATIONS
-- =============================================

CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,

    type TEXT NOT NULL, -- 'booking_confirmed', 'reminder', 'promotion', etc.
    title TEXT NOT NULL,
    message TEXT NOT NULL,

    entity_type entity_type,
    entity_id UUID,
    action_url TEXT,

    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 13. ANALYTICS & TRACKING
-- =============================================

CREATE TABLE public.page_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id),
    session_id TEXT,

    page_type TEXT NOT NULL, -- 'hospital', 'doctor', 'package', 'home', etc.
    page_id UUID, -- ID of the entity if applicable
    page_url TEXT,
    referrer TEXT,

    user_agent TEXT,
    ip_address INET,
    country TEXT,
    city TEXT,

    duration_seconds INTEGER,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.search_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id),
    session_id TEXT,

    query TEXT,
    filters JSONB,
    result_count INTEGER,
    clicked_result_id UUID,
    clicked_result_type entity_type,
    clicked_position INTEGER,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 14. SYSTEM TABLES
-- =============================================

-- Feature Flags
CREATE TABLE public.feature_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    enabled BOOLEAN DEFAULT FALSE,
    description TEXT,
    conditions JSONB, -- For conditional rollouts
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- System Settings
CREATE TABLE public.system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Log
CREATE TABLE public.audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id),
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 15. INDEXES FOR PERFORMANCE
-- =============================================

-- Hospitals
CREATE INDEX idx_hospitals_country ON public.hospitals(country_id);
CREATE INDEX idx_hospitals_city ON public.hospitals(city_id);
CREATE INDEX idx_hospitals_rating ON public.hospitals(rating DESC);
CREATE INDEX idx_hospitals_price_range ON public.hospitals(price_range);
CREATE INDEX idx_hospitals_is_active ON public.hospitals(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_hospitals_is_featured ON public.hospitals(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_hospitals_location ON public.hospitals(latitude, longitude);
CREATE INDEX idx_hospitals_name_trgm ON public.hospitals USING gin(name gin_trgm_ops);

-- Doctors
CREATE INDEX idx_doctors_hospital ON public.doctors(hospital_id);
CREATE INDEX idx_doctors_specialization ON public.doctors(specialization_id);
CREATE INDEX idx_doctors_rating ON public.doctors(rating DESC);
CREATE INDEX idx_doctors_is_active ON public.doctors(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_doctors_name_trgm ON public.doctors USING gin(name gin_trgm_ops);

-- Packages
CREATE INDEX idx_packages_hospital ON public.medical_packages(hospital_id);
CREATE INDEX idx_packages_category ON public.medical_packages(category_id);
CREATE INDEX idx_packages_price ON public.medical_packages(price);
CREATE INDEX idx_packages_is_active ON public.medical_packages(is_active) WHERE is_active = TRUE;

-- Chat
CREATE INDEX idx_chat_sessions_user ON public.chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_updated ON public.chat_sessions(updated_at DESC);
CREATE INDEX idx_chat_messages_session ON public.chat_messages(session_id);
CREATE INDEX idx_chat_messages_created ON public.chat_messages(created_at DESC);

-- User interactions
CREATE INDEX idx_favorites_user ON public.user_favorites(user_id);
CREATE INDEX idx_favorites_entity ON public.user_favorites(entity_type, entity_id);
CREATE INDEX idx_recently_viewed_user ON public.user_recently_viewed(user_id);
CREATE INDEX idx_search_history_user ON public.user_search_history(user_id);

-- Bookings
CREATE INDEX idx_bookings_user ON public.bookings(user_id);
CREATE INDEX idx_bookings_hospital ON public.bookings(hospital_id);
CREATE INDEX idx_bookings_doctor ON public.bookings(doctor_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_date ON public.bookings(preferred_date);

-- Reviews
CREATE INDEX idx_reviews_entity ON public.reviews(entity_type, entity_id);
CREATE INDEX idx_reviews_user ON public.reviews(user_id);
CREATE INDEX idx_reviews_rating ON public.reviews(rating DESC);
CREATE INDEX idx_reviews_approved ON public.reviews(is_approved) WHERE is_approved = TRUE;

-- Content
CREATE INDEX idx_articles_slug ON public.articles(slug);
CREATE INDEX idx_articles_published ON public.articles(is_published, published_at DESC);
CREATE INDEX idx_treatments_specialization ON public.treatments(specialization_id);

-- Analytics
CREATE INDEX idx_page_views_user ON public.page_views(user_id);
CREATE INDEX idx_page_views_created ON public.page_views(created_at DESC);
CREATE INDEX idx_search_analytics_created ON public.search_analytics(created_at DESC);

-- Notifications
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, is_read) WHERE is_read = FALSE;

-- =============================================
-- 16. ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on user-specific tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_recently_viewed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see/edit their own profile
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Chat sessions - users can only access their own
CREATE POLICY "Users can view own chat sessions" ON public.chat_sessions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own chat messages" ON public.chat_messages
    FOR ALL USING (
        session_id IN (
            SELECT id FROM public.chat_sessions WHERE user_id = auth.uid()
        )
    );

-- Favorites - users can only manage their own
CREATE POLICY "Users can manage own favorites" ON public.user_favorites
    FOR ALL USING (auth.uid() = user_id);

-- Comparisons - users can only manage their own
CREATE POLICY "Users can manage own comparisons" ON public.user_comparisons
    FOR ALL USING (auth.uid() = user_id);

-- Search history - users can only see their own
CREATE POLICY "Users can view own search history" ON public.user_search_history
    FOR ALL USING (auth.uid() = user_id);

-- Recently viewed - users can only see their own
CREATE POLICY "Users can view own recently viewed" ON public.user_recently_viewed
    FOR ALL USING (auth.uid() = user_id);

-- Bookings - users can view/create their own, admins can see all
CREATE POLICY "Users can view own bookings" ON public.bookings
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create bookings" ON public.bookings
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bookings" ON public.bookings
    FOR UPDATE USING (auth.uid() = user_id);

-- Reviews - public read, authenticated write own
CREATE POLICY "Anyone can view approved reviews" ON public.reviews
    FOR SELECT USING (is_approved = TRUE);
CREATE POLICY "Users can create reviews" ON public.reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.reviews
    FOR UPDATE USING (auth.uid() = user_id);

-- Notifications - users can only see their own
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Public tables (no RLS needed, everyone can read)
-- hospitals, doctors, medical_packages, specializations, etc.

-- =============================================
-- 17. FUNCTIONS & TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hospitals_updated_at
    BEFORE UPDATE ON public.hospitals
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at
    BEFORE UPDATE ON public.doctors
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_packages_updated_at
    BEFORE UPDATE ON public.medical_packages
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at
    BEFORE UPDATE ON public.chat_sessions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update hospital rating when review is added
CREATE OR REPLACE FUNCTION public.update_hospital_rating()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.entity_type = 'hospital' AND NEW.is_approved = TRUE THEN
        UPDATE public.hospitals
        SET
            rating = (
                SELECT ROUND(AVG(rating)::numeric, 1)
                FROM public.reviews
                WHERE entity_type = 'hospital'
                AND entity_id = NEW.entity_id
                AND is_approved = TRUE
            ),
            review_count = (
                SELECT COUNT(*)
                FROM public.reviews
                WHERE entity_type = 'hospital'
                AND entity_id = NEW.entity_id
                AND is_approved = TRUE
            )
        WHERE id = NEW.entity_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_hospital_rating_on_review
    AFTER INSERT OR UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.update_hospital_rating();

-- Function to update doctor rating when review is added
CREATE OR REPLACE FUNCTION public.update_doctor_rating()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.entity_type = 'doctor' AND NEW.is_approved = TRUE THEN
        UPDATE public.doctors
        SET
            rating = (
                SELECT ROUND(AVG(rating)::numeric, 1)
                FROM public.reviews
                WHERE entity_type = 'doctor'
                AND entity_id = NEW.entity_id
                AND is_approved = TRUE
            ),
            review_count = (
                SELECT COUNT(*)
                FROM public.reviews
                WHERE entity_type = 'doctor'
                AND entity_id = NEW.entity_id
                AND is_approved = TRUE
            )
        WHERE id = NEW.entity_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_doctor_rating_on_review
    AFTER INSERT OR UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.update_doctor_rating();

-- Function to increment message count in chat session
CREATE OR REPLACE FUNCTION public.increment_message_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.chat_sessions
    SET message_count = message_count + 1
    WHERE id = NEW.session_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_chat_message_count
    AFTER INSERT ON public.chat_messages
    FOR EACH ROW EXECUTE FUNCTION public.increment_message_count();

-- Function to log booking status changes
CREATE OR REPLACE FUNCTION public.log_booking_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO public.booking_status_history (booking_id, old_status, new_status)
        VALUES (NEW.id, OLD.status, NEW.status);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_booking_status
    AFTER UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION public.log_booking_status_change();

-- =============================================
-- 18. VIEWS FOR COMMON QUERIES
-- =============================================

-- Hospital summary view with all related data
CREATE OR REPLACE VIEW public.v_hospitals_summary AS
SELECT
    h.*,
    c.name as city_name,
    co.name as country_name,
    co.code as country_code,
    co.flag_emoji as country_flag,
    COALESCE(
        (SELECT array_agg(s.name ORDER BY hs.is_center_of_excellence DESC)
         FROM public.hospital_specializations hs
         JOIN public.specializations s ON s.id = hs.specialization_id
         WHERE hs.hospital_id = h.id),
        ARRAY[]::text[]
    ) as specialties,
    COALESCE(
        (SELECT array_agg(a.name)
         FROM public.hospital_accreditations ha
         JOIN public.accreditations a ON a.id = ha.accreditation_id
         WHERE ha.hospital_id = h.id),
        ARRAY[]::text[]
    ) as accreditations,
    COALESCE(
        (SELECT array_agg(l.name)
         FROM public.hospital_languages hl
         JOIN public.languages l ON l.id = hl.language_id
         WHERE hl.hospital_id = h.id),
        ARRAY[]::text[]
    ) as languages,
    COALESCE(
        (SELECT array_agg(hi.image_url ORDER BY hi.display_order)
         FROM public.hospital_images hi
         WHERE hi.hospital_id = h.id),
        ARRAY[]::text[]
    ) as images
FROM public.hospitals h
LEFT JOIN public.cities c ON c.id = h.city_id
LEFT JOIN public.countries co ON co.id = h.country_id
WHERE h.is_active = TRUE;

-- Doctor summary view
CREATE OR REPLACE VIEW public.v_doctors_summary AS
SELECT
    d.*,
    h.name as hospital_name,
    h.slug as hospital_slug,
    co.name as country_name,
    co.flag_emoji as country_flag,
    s.name as specialization_name,
    COALESCE(
        (SELECT array_agg(l.name)
         FROM public.doctor_languages dl
         JOIN public.languages l ON l.id = dl.language_id
         WHERE dl.doctor_id = d.id),
        ARRAY[]::text[]
    ) as languages,
    COALESCE(
        (SELECT array_agg(dp.name)
         FROM public.doctor_procedures dp
         WHERE dp.doctor_id = d.id),
        ARRAY[]::text[]
    ) as procedures
FROM public.doctors d
LEFT JOIN public.hospitals h ON h.id = d.hospital_id
LEFT JOIN public.countries co ON co.id = h.country_id
LEFT JOIN public.specializations s ON s.id = d.specialization_id
WHERE d.is_active = TRUE;

-- Package summary view
CREATE OR REPLACE VIEW public.v_packages_summary AS
SELECT
    p.*,
    h.name as hospital_name,
    h.slug as hospital_slug,
    c.name as city_name,
    co.name as country_name,
    pc.name as category_name,
    COALESCE(
        (SELECT array_agg(pt.tag)
         FROM public.package_tags pt
         WHERE pt.package_id = p.id),
        ARRAY[]::text[]
    ) as tags
FROM public.medical_packages p
LEFT JOIN public.hospitals h ON h.id = p.hospital_id
LEFT JOIN public.cities c ON c.id = h.city_id
LEFT JOIN public.countries co ON co.id = h.country_id
LEFT JOIN public.package_categories pc ON pc.id = p.category_id
WHERE p.is_active = TRUE;

-- =============================================
-- 19. INITIAL SEED DATA
-- =============================================

-- Countries
INSERT INTO public.countries (name, code, flag_emoji) VALUES
    ('Thailand', 'TH', '🇹🇭'),
    ('Malaysia', 'MY', '🇲🇾'),
    ('Singapore', 'SG', '🇸🇬'),
    ('South Korea', 'KR', '🇰🇷'),
    ('Indonesia', 'ID', '🇮🇩'),
    ('India', 'IN', '🇮🇳'),
    ('Turkey', 'TR', '🇹🇷'),
    ('United Arab Emirates', 'AE', '🇦🇪'),
    ('Japan', 'JP', '🇯🇵'),
    ('Taiwan', 'TW', '🇹🇼');

-- Languages
INSERT INTO public.languages (name, code, native_name) VALUES
    ('English', 'en', 'English'),
    ('Mandarin', 'zh', '中文'),
    ('Thai', 'th', 'ภาษาไทย'),
    ('Bahasa Melayu', 'ms', 'Bahasa Melayu'),
    ('Bahasa Indonesia', 'id', 'Bahasa Indonesia'),
    ('Korean', 'ko', '한국어'),
    ('Japanese', 'ja', '日本語'),
    ('Arabic', 'ar', 'العربية'),
    ('Hindi', 'hi', 'हिन्दी'),
    ('Tamil', 'ta', 'தமிழ்'),
    ('Cantonese', 'yue', '粵語'),
    ('Hokkien', 'nan', '閩南語'),
    ('Vietnamese', 'vi', 'Tiếng Việt'),
    ('French', 'fr', 'Français'),
    ('German', 'de', 'Deutsch'),
    ('Russian', 'ru', 'Русский'),
    ('Spanish', 'es', 'Español');

-- Accreditations
INSERT INTO public.accreditations (name, full_name, description) VALUES
    ('JCI', 'Joint Commission International', 'Gold standard for global healthcare quality'),
    ('GHA', 'Global Healthcare Accreditation', 'Medical travel and health tourism accreditation'),
    ('MSQH', 'Malaysian Society for Quality in Health', 'Malaysian healthcare quality standards'),
    ('KOHC', 'Korean Healthcare Accreditation', 'South Korean healthcare standards'),
    ('NABH', 'National Accreditation Board for Hospitals', 'Indian healthcare accreditation'),
    ('ACHSI', 'Australian Council on Healthcare Standards International', 'Australian healthcare standards'),
    ('ISO', 'International Organization for Standardization', 'International quality standards');

-- Specializations
INSERT INTO public.specializations (name, slug, description, icon_name, semantic_keywords) VALUES
    ('Cardiology', 'cardiology', 'Heart and cardiovascular system care', 'HeartPulse', ARRAY['heart', 'cardiac', 'cardiovascular', 'chest pain', 'heart attack', 'bypass', 'angioplasty']),
    ('Orthopedics', 'orthopedics', 'Bone, joint, and musculoskeletal care', 'Bone', ARRAY['bone', 'joint', 'knee', 'hip', 'spine', 'fracture', 'arthritis', 'replacement']),
    ('Oncology', 'oncology', 'Cancer diagnosis and treatment', 'Microscope', ARRAY['cancer', 'tumor', 'chemotherapy', 'radiation', 'oncologist', 'biopsy', 'malignant']),
    ('Neurology', 'neurology', 'Brain and nervous system care', 'Brain', ARRAY['brain', 'nerve', 'stroke', 'epilepsy', 'headache', 'migraine', 'parkinsons', 'alzheimers']),
    ('Gastroenterology', 'gastroenterology', 'Digestive system care', 'Stethoscope', ARRAY['stomach', 'digestive', 'liver', 'intestine', 'colon', 'endoscopy', 'gastric']),
    ('Fertility & IVF', 'fertility-ivf', 'Reproductive health and fertility treatments', 'Baby', ARRAY['fertility', 'ivf', 'pregnancy', 'infertility', 'reproductive', 'egg', 'sperm']),
    ('Dermatology', 'dermatology', 'Skin, hair, and nail care', 'Scan', ARRAY['skin', 'acne', 'eczema', 'psoriasis', 'dermatologist', 'rash', 'mole']),
    ('Ophthalmology', 'ophthalmology', 'Eye and vision care', 'Eye', ARRAY['eye', 'vision', 'cataract', 'lasik', 'glaucoma', 'retina', 'cornea']),
    ('ENT', 'ent', 'Ear, nose, and throat care', 'Ear', ARRAY['ear', 'nose', 'throat', 'hearing', 'sinus', 'tonsil', 'adenoid']),
    ('Dental Care', 'dental-care', 'Oral and dental health', 'Smile', ARRAY['teeth', 'dental', 'dentist', 'implant', 'crown', 'root canal', 'orthodontics']),
    ('Aesthetics', 'aesthetics', 'Cosmetic and aesthetic procedures', 'Sparkles', ARRAY['cosmetic', 'plastic surgery', 'botox', 'filler', 'liposuction', 'facelift', 'rhinoplasty']),
    ('General Surgery', 'general-surgery', 'Surgical procedures', 'Scissors', ARRAY['surgery', 'operation', 'laparoscopic', 'hernia', 'appendix', 'gallbladder']);

-- Package Categories
INSERT INTO public.package_categories (name, slug, description, display_order) VALUES
    ('Medical Check-Up', 'medical-checkup', 'Comprehensive health screening packages', 1),
    ('Heart Screening', 'heart-screening', 'Cardiovascular health assessments', 2),
    ('Cancer Screening', 'cancer-screening', 'Early cancer detection packages', 3),
    ('Women Health', 'women-health', 'Women-specific health packages', 4),
    ('Men Health', 'men-health', 'Men-specific health packages', 5),
    ('MRI & Imaging', 'mri-imaging', 'Advanced imaging packages', 6),
    ('Beauty & Wellness', 'beauty-wellness', 'Aesthetic and wellness treatments', 7),
    ('Recovery & Rehabilitation', 'recovery-rehab', 'Post-treatment recovery programs', 8),
    ('Dental Packages', 'dental-packages', 'Comprehensive dental care packages', 9),
    ('Fertility Packages', 'fertility-packages', 'IVF and fertility treatment packages', 10);

-- Insurance Providers
INSERT INTO public.insurance_providers (name, logo_url, website_url) VALUES
    ('AIA', 'https://logo.clearbit.com/aia.com', 'https://www.aia.com'),
    ('Allianz', 'https://logo.clearbit.com/allianz.com', 'https://www.allianz.com'),
    ('Prudential', 'https://logo.clearbit.com/prudential.com', 'https://www.prudential.com'),
    ('Great Eastern', 'https://logo.clearbit.com/greateasternlife.com', 'https://www.greateasternlife.com'),
    ('Cigna', 'https://logo.clearbit.com/cigna.com', 'https://www.cigna.com'),
    ('AXA', 'https://logo.clearbit.com/axa.com', 'https://www.axa.com'),
    ('Manulife', 'https://logo.clearbit.com/manulife.com', 'https://www.manulife.com'),
    ('Tokio Marine', 'https://logo.clearbit.com/tokiomarine.com', 'https://www.tokiomarine.com'),
    ('BUPA', 'https://logo.clearbit.com/bupa.com', 'https://www.bupa.com'),
    ('Aetna', 'https://logo.clearbit.com/aetna.com', 'https://www.aetna.com');

-- System Settings
INSERT INTO public.system_settings (key, value, description) VALUES
    ('max_comparison_count', '3', 'Maximum items in comparison'),
    ('supported_currencies', '["USD", "IDR", "SGD", "MYR", "THB", "KRW"]', 'Supported currencies'),
    ('default_language', '"en"', 'Default system language'),
    ('booking_lead_time_days', '2', 'Minimum days before appointment'),
    ('chat_message_limit', '100', 'Max messages per session'),
    ('featured_hospitals_count', '6', 'Number of featured hospitals on homepage');

-- Feature Flags
INSERT INTO public.feature_flags (key, enabled, description) VALUES
    ('ai_chat', TRUE, 'Enable AI chat assistant'),
    ('online_booking', TRUE, 'Enable online booking'),
    ('video_consultation', FALSE, 'Enable video consultations'),
    ('multi_language', TRUE, 'Enable multi-language support'),
    ('reviews', TRUE, 'Enable user reviews'),
    ('comparisons', TRUE, 'Enable hospital/doctor comparisons'),
    ('favorites', TRUE, 'Enable favorites feature'),
    ('push_notifications', FALSE, 'Enable push notifications');

-- =============================================
-- 20. STORAGE BUCKETS (Run in Supabase Dashboard)
-- =============================================

-- Note: Run these in Supabase Dashboard > Storage
--
-- Buckets to create:
-- 1. hospital-images (public)
-- 2. doctor-images (public)
-- 3. package-images (public)
-- 4. user-avatars (public)
-- 5. chat-attachments (private)
-- 6. booking-documents (private)
-- 7. review-images (public)

-- =============================================
-- SCHEMA COMPLETE
-- =============================================
