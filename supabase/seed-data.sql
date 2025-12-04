-- =============================================
-- MEDIFLY AI CONCIERGE - SEED DATA
-- =============================================
-- This file contains sample data based on your constants.ts
-- Run this after the schema.sql
-- =============================================

-- =============================================
-- CITIES (Sample data for main medical tourism destinations)
-- =============================================

INSERT INTO public.cities (name, country_id, latitude, longitude, timezone) VALUES
-- Thailand
('Bangkok', (SELECT id FROM public.countries WHERE code = 'TH'), 13.7563, 100.5018, 'Asia/Bangkok'),
('Phuket', (SELECT id FROM public.countries WHERE code = 'TH'), 7.8804, 98.3923, 'Asia/Bangkok'),
('Chiang Mai', (SELECT id FROM public.countries WHERE code = 'TH'), 18.7883, 98.9853, 'Asia/Bangkok'),
('Pattaya', (SELECT id FROM public.countries WHERE code = 'TH'), 12.9236, 100.8825, 'Asia/Bangkok'),

-- Malaysia
('Kuala Lumpur', (SELECT id FROM public.countries WHERE code = 'MY'), 3.1390, 101.6869, 'Asia/Kuala_Lumpur'),
('Penang', (SELECT id FROM public.countries WHERE code = 'MY'), 5.4164, 100.3327, 'Asia/Kuala_Lumpur'),
('Johor Bahru', (SELECT id FROM public.countries WHERE code = 'MY'), 1.4927, 103.7414, 'Asia/Kuala_Lumpur'),
('Melaka', (SELECT id FROM public.countries WHERE code = 'MY'), 2.1896, 102.2501, 'Asia/Kuala_Lumpur'),

-- Singapore
('Singapore', (SELECT id FROM public.countries WHERE code = 'SG'), 1.3521, 103.8198, 'Asia/Singapore'),

-- South Korea
('Seoul', (SELECT id FROM public.countries WHERE code = 'KR'), 37.5665, 126.9780, 'Asia/Seoul'),
('Busan', (SELECT id FROM public.countries WHERE code = 'KR'), 35.1796, 129.0756, 'Asia/Seoul'),
('Incheon', (SELECT id FROM public.countries WHERE code = 'KR'), 37.4563, 126.7052, 'Asia/Seoul'),

-- Indonesia
('Jakarta', (SELECT id FROM public.countries WHERE code = 'ID'), -6.2088, 106.8456, 'Asia/Jakarta'),
('Surabaya', (SELECT id FROM public.countries WHERE code = 'ID'), -7.2575, 112.7521, 'Asia/Jakarta'),
('Bali', (SELECT id FROM public.countries WHERE code = 'ID'), -8.3405, 115.0920, 'Asia/Makassar'),
('Bandung', (SELECT id FROM public.countries WHERE code = 'ID'), -6.9175, 107.6191, 'Asia/Jakarta'),

-- India
('Mumbai', (SELECT id FROM public.countries WHERE code = 'IN'), 19.0760, 72.8777, 'Asia/Kolkata'),
('Delhi', (SELECT id FROM public.countries WHERE code = 'IN'), 28.6139, 77.2090, 'Asia/Kolkata'),
('Chennai', (SELECT id FROM public.countries WHERE code = 'IN'), 13.0827, 80.2707, 'Asia/Kolkata'),
('Bangalore', (SELECT id FROM public.countries WHERE code = 'IN'), 12.9716, 77.5946, 'Asia/Kolkata'),

-- UAE
('Dubai', (SELECT id FROM public.countries WHERE code = 'AE'), 25.2048, 55.2708, 'Asia/Dubai'),
('Abu Dhabi', (SELECT id FROM public.countries WHERE code = 'AE'), 24.4539, 54.3773, 'Asia/Dubai'),

-- Turkey
('Istanbul', (SELECT id FROM public.countries WHERE code = 'TR'), 41.0082, 28.9784, 'Europe/Istanbul'),
('Ankara', (SELECT id FROM public.countries WHERE code = 'TR'), 39.9334, 32.8597, 'Europe/Istanbul');

-- =============================================
-- SAMPLE HOSPITALS
-- =============================================

-- Thailand Hospitals
INSERT INTO public.hospitals (
    name, slug, description, city_id, country_id, address,
    latitude, longitude, rating, review_count, price_range,
    bed_count, specialist_count, patient_count_annual,
    image_url, is_featured, is_verified, is_active
) VALUES
(
    'Bumrungrad International Hospital',
    'bumrungrad-international-hospital',
    'Bumrungrad International Hospital is a world-renowned healthcare facility in Bangkok, Thailand. As a pioneer in medical tourism, it has been serving international patients for over four decades.',
    (SELECT id FROM public.cities WHERE name = 'Bangkok'),
    (SELECT id FROM public.countries WHERE code = 'TH'),
    '33 Sukhumvit 3, Wattana, Bangkok 10110, Thailand',
    13.7467, 100.5551,
    4.8, 15420, '$$$',
    580, 1200, 1100000,
    'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800',
    TRUE, TRUE, TRUE
),
(
    'Bangkok Hospital',
    'bangkok-hospital',
    'Bangkok Hospital is one of the largest private hospital networks in Southeast Asia, offering comprehensive medical services with state-of-the-art technology.',
    (SELECT id FROM public.cities WHERE name = 'Bangkok'),
    (SELECT id FROM public.countries WHERE code = 'TH'),
    '2 Soi Soonvijai 7, New Petchburi Road, Bangkok 10310, Thailand',
    13.7459, 100.5682,
    4.7, 12350, '$$$',
    425, 900, 850000,
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
    TRUE, TRUE, TRUE
),
(
    'Samitivej Hospital',
    'samitivej-hospital',
    'Samitivej Hospital is a leading private hospital group in Thailand known for its excellence in pediatrics, obstetrics, and specialized medical care.',
    (SELECT id FROM public.cities WHERE name = 'Bangkok'),
    (SELECT id FROM public.countries WHERE code = 'TH'),
    '133 Sukhumvit 49, Klongtan Nua, Vadhana, Bangkok 10110',
    13.7369, 100.5784,
    4.6, 8920, '$$',
    275, 450, 520000,
    'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=800',
    FALSE, TRUE, TRUE
),

-- Malaysia Hospitals
(
    'Prince Court Medical Centre',
    'prince-court-medical-centre',
    'Prince Court Medical Centre is a premier private hospital in Kuala Lumpur offering world-class healthcare services with cutting-edge medical technology.',
    (SELECT id FROM public.cities WHERE name = 'Kuala Lumpur'),
    (SELECT id FROM public.countries WHERE code = 'MY'),
    '39 Jalan Kia Peng, Kuala Lumpur 50450, Malaysia',
    3.1530, 101.7200,
    4.7, 6840, '$$$',
    300, 200, 450000,
    'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=80&w=800',
    TRUE, TRUE, TRUE
),
(
    'Gleneagles Hospital Kuala Lumpur',
    'gleneagles-hospital-kuala-lumpur',
    'Gleneagles Hospital Kuala Lumpur is part of the renowned IHH Healthcare network, providing comprehensive medical services.',
    (SELECT id FROM public.cities WHERE name = 'Kuala Lumpur'),
    (SELECT id FROM public.countries WHERE code = 'MY'),
    '286 & 288, Jalan Ampang, Kuala Lumpur 50450, Malaysia',
    3.1607, 101.7350,
    4.6, 5230, '$$$',
    330, 180, 380000,
    'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&q=80&w=800',
    FALSE, TRUE, TRUE
),
(
    'Island Hospital Penang',
    'island-hospital-penang',
    'Island Hospital is a leading multi-specialty hospital in Penang, Malaysia, known for its expertise in cardiology and oncology.',
    (SELECT id FROM public.cities WHERE name = 'Penang'),
    (SELECT id FROM public.countries WHERE code = 'MY'),
    '308 Macalister Road, 10450 Penang, Malaysia',
    5.4200, 100.3200,
    4.5, 4120, '$$',
    220, 120, 280000,
    'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
    FALSE, TRUE, TRUE
),

-- Singapore Hospitals
(
    'Mount Elizabeth Hospital',
    'mount-elizabeth-hospital',
    'Mount Elizabeth Hospital is Singapore''s flagship private hospital, renowned for its cardiac, cancer, and neuroscience services.',
    (SELECT id FROM public.cities WHERE name = 'Singapore'),
    (SELECT id FROM public.countries WHERE code = 'SG'),
    '3 Mount Elizabeth, Singapore 228510',
    1.3069, 103.8352,
    4.9, 18650, '$$$',
    345, 450, 620000,
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
    TRUE, TRUE, TRUE
),
(
    'Raffles Hospital',
    'raffles-hospital',
    'Raffles Hospital is a tertiary care hospital providing comprehensive specialist services and health screening packages.',
    (SELECT id FROM public.cities WHERE name = 'Singapore'),
    (SELECT id FROM public.countries WHERE code = 'SG'),
    '585 North Bridge Road, Singapore 188770',
    1.2984, 103.8556,
    4.7, 9870, '$$$',
    380, 350, 480000,
    'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800',
    FALSE, TRUE, TRUE
),

-- South Korea Hospitals
(
    'Asan Medical Center',
    'asan-medical-center',
    'Asan Medical Center is one of the largest and most advanced hospitals in South Korea, leading in organ transplants and cancer treatment.',
    (SELECT id FROM public.cities WHERE name = 'Seoul'),
    (SELECT id FROM public.countries WHERE code = 'KR'),
    '88 Olympic-ro 43-gil, Songpa-gu, Seoul, South Korea',
    37.5267, 127.1081,
    4.9, 22340, '$$$',
    2700, 1500, 2100000,
    'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=800',
    TRUE, TRUE, TRUE
),
(
    'Samsung Medical Center',
    'samsung-medical-center',
    'Samsung Medical Center is a leading research and teaching hospital in South Korea, known for its advanced cancer treatment.',
    (SELECT id FROM public.cities WHERE name = 'Seoul'),
    (SELECT id FROM public.countries WHERE code = 'KR'),
    '81 Irwon-ro, Gangnam-gu, Seoul, South Korea',
    37.4886, 127.0855,
    4.8, 19870, '$$$',
    1989, 1200, 1800000,
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
    TRUE, TRUE, TRUE
),

-- Indonesia Hospitals
(
    'Siloam Hospitals',
    'siloam-hospitals',
    'Siloam Hospitals is Indonesia''s leading private hospital chain, providing comprehensive healthcare services.',
    (SELECT id FROM public.cities WHERE name = 'Jakarta'),
    (SELECT id FROM public.countries WHERE code = 'ID'),
    'Jl. Gatot Subroto Kav. 36, Jakarta 12930, Indonesia',
    -6.2297, 106.8295,
    4.5, 8760, '$$',
    300, 350, 520000,
    'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=80&w=800',
    TRUE, TRUE, TRUE
),
(
    'RS Pondok Indah',
    'rs-pondok-indah',
    'RS Pondok Indah is a premium private hospital in South Jakarta, known for its modern facilities and specialist care.',
    (SELECT id FROM public.cities WHERE name = 'Jakarta'),
    (SELECT id FROM public.countries WHERE code = 'ID'),
    'Jl. Metro Duta Kav. UE, Pondok Indah, Jakarta 12310',
    -6.2775, 106.7847,
    4.4, 6540, '$$',
    250, 280, 380000,
    'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&q=80&w=800',
    FALSE, TRUE, TRUE
);

-- =============================================
-- HOSPITAL SPECIALIZATIONS (Link hospitals to specializations)
-- =============================================

-- Bumrungrad - All specializations
INSERT INTO public.hospital_specializations (hospital_id, specialization_id, is_center_of_excellence)
SELECT h.id, s.id,
    CASE WHEN s.slug IN ('cardiology', 'oncology', 'orthopedics') THEN TRUE ELSE FALSE END
FROM public.hospitals h, public.specializations s
WHERE h.slug = 'bumrungrad-international-hospital';

-- Bangkok Hospital - Key specializations
INSERT INTO public.hospital_specializations (hospital_id, specialization_id, is_center_of_excellence)
SELECT h.id, s.id,
    CASE WHEN s.slug IN ('cardiology', 'neurology') THEN TRUE ELSE FALSE END
FROM public.hospitals h, public.specializations s
WHERE h.slug = 'bangkok-hospital'
AND s.slug IN ('cardiology', 'neurology', 'orthopedics', 'oncology', 'gastroenterology');

-- Mount Elizabeth - Key specializations
INSERT INTO public.hospital_specializations (hospital_id, specialization_id, is_center_of_excellence)
SELECT h.id, s.id,
    CASE WHEN s.slug IN ('cardiology', 'oncology') THEN TRUE ELSE FALSE END
FROM public.hospitals h, public.specializations s
WHERE h.slug = 'mount-elizabeth-hospital'
AND s.slug IN ('cardiology', 'oncology', 'neurology', 'orthopedics', 'fertility-ivf');

-- Asan Medical Center - All specializations (major hospital)
INSERT INTO public.hospital_specializations (hospital_id, specialization_id, is_center_of_excellence)
SELECT h.id, s.id,
    CASE WHEN s.slug IN ('oncology', 'cardiology', 'gastroenterology') THEN TRUE ELSE FALSE END
FROM public.hospitals h, public.specializations s
WHERE h.slug = 'asan-medical-center';

-- =============================================
-- HOSPITAL ACCREDITATIONS
-- =============================================

-- JCI Accredited hospitals
INSERT INTO public.hospital_accreditations (hospital_id, accreditation_id, certified_date)
SELECT h.id, a.id, '2023-01-15'::date
FROM public.hospitals h, public.accreditations a
WHERE h.slug IN (
    'bumrungrad-international-hospital',
    'bangkok-hospital',
    'mount-elizabeth-hospital',
    'prince-court-medical-centre',
    'asan-medical-center',
    'samsung-medical-center'
)
AND a.name = 'JCI';

-- GHA Accredited hospitals
INSERT INTO public.hospital_accreditations (hospital_id, accreditation_id, certified_date)
SELECT h.id, a.id, '2023-06-01'::date
FROM public.hospitals h, public.accreditations a
WHERE h.slug IN (
    'bumrungrad-international-hospital',
    'prince-court-medical-centre'
)
AND a.name = 'GHA';

-- =============================================
-- HOSPITAL LANGUAGES
-- =============================================

-- All hospitals support English
INSERT INTO public.hospital_languages (hospital_id, language_id)
SELECT h.id, l.id
FROM public.hospitals h, public.languages l
WHERE l.code = 'en';

-- Thai hospitals support Thai and Mandarin
INSERT INTO public.hospital_languages (hospital_id, language_id)
SELECT h.id, l.id
FROM public.hospitals h, public.languages l
WHERE h.country_id = (SELECT id FROM public.countries WHERE code = 'TH')
AND l.code IN ('th', 'zh');

-- Malaysia hospitals support Malay, Mandarin
INSERT INTO public.hospital_languages (hospital_id, language_id)
SELECT h.id, l.id
FROM public.hospitals h, public.languages l
WHERE h.country_id = (SELECT id FROM public.countries WHERE code = 'MY')
AND l.code IN ('ms', 'zh');

-- Singapore hospitals support Mandarin, Malay, Tamil
INSERT INTO public.hospital_languages (hospital_id, language_id)
SELECT h.id, l.id
FROM public.hospitals h, public.languages l
WHERE h.country_id = (SELECT id FROM public.countries WHERE code = 'SG')
AND l.code IN ('zh', 'ms', 'ta');

-- Korean hospitals support Korean
INSERT INTO public.hospital_languages (hospital_id, language_id)
SELECT h.id, l.id
FROM public.hospitals h, public.languages l
WHERE h.country_id = (SELECT id FROM public.countries WHERE code = 'KR')
AND l.code = 'ko';

-- Indonesian hospitals support Indonesian
INSERT INTO public.hospital_languages (hospital_id, language_id)
SELECT h.id, l.id
FROM public.hospitals h, public.languages l
WHERE h.country_id = (SELECT id FROM public.countries WHERE code = 'ID')
AND l.code = 'id';

-- =============================================
-- SAMPLE DOCTORS
-- =============================================

INSERT INTO public.doctors (
    name, slug, title, gender, hospital_id, specialization_id,
    description, image_url, experience_years, rating, review_count,
    consultation_fee_min, consultation_fee_max, currency,
    is_accepting_patients, is_featured, is_active
) VALUES
-- Bumrungrad Doctors
(
    'Dr. Somchai Wattanasirichaigoon',
    'dr-somchai-wattanasirichaigoon',
    'Prof.',
    'male',
    (SELECT id FROM public.hospitals WHERE slug = 'bumrungrad-international-hospital'),
    (SELECT id FROM public.specializations WHERE slug = 'cardiology'),
    'Professor Somchai is a renowned interventional cardiologist with over 25 years of experience in complex cardiac procedures.',
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
    25, 4.9, 1250,
    150, 300, 'USD',
    TRUE, TRUE, TRUE
),
(
    'Dr. Nalinee Kovitwanawong',
    'dr-nalinee-kovitwanawong',
    'Dr.',
    'female',
    (SELECT id FROM public.hospitals WHERE slug = 'bumrungrad-international-hospital'),
    (SELECT id FROM public.specializations WHERE slug = 'oncology'),
    'Dr. Nalinee specializes in breast cancer surgery and oncoplastic reconstruction with extensive experience in minimally invasive techniques.',
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    18, 4.8, 890,
    200, 350, 'USD',
    TRUE, TRUE, TRUE
),

-- Mount Elizabeth Doctors
(
    'Dr. Tan Wei Ming',
    'dr-tan-wei-ming',
    'Dr.',
    'male',
    (SELECT id FROM public.hospitals WHERE slug = 'mount-elizabeth-hospital'),
    (SELECT id FROM public.specializations WHERE slug = 'orthopedics'),
    'Dr. Tan is a leading orthopedic surgeon specializing in sports injuries and joint replacements.',
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    20, 4.9, 1560,
    250, 400, 'USD',
    TRUE, TRUE, TRUE
),
(
    'Dr. Lee Siew Ling',
    'dr-lee-siew-ling',
    'Dr.',
    'female',
    (SELECT id FROM public.hospitals WHERE slug = 'mount-elizabeth-hospital'),
    (SELECT id FROM public.specializations WHERE slug = 'fertility-ivf'),
    'Dr. Lee is a fertility specialist with expertise in IVF and reproductive medicine.',
    'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400',
    15, 4.7, 720,
    300, 500, 'USD',
    TRUE, FALSE, TRUE
),

-- Asan Medical Center Doctors
(
    'Dr. Kim Hyun-Soo',
    'dr-kim-hyun-soo',
    'Prof.',
    'male',
    (SELECT id FROM public.hospitals WHERE slug = 'asan-medical-center'),
    (SELECT id FROM public.specializations WHERE slug = 'gastroenterology'),
    'Professor Kim is internationally recognized for his expertise in advanced endoscopic procedures and liver transplantation.',
    'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
    28, 4.9, 2340,
    200, 400, 'USD',
    TRUE, TRUE, TRUE
),
(
    'Dr. Park Min-Ji',
    'dr-park-min-ji',
    'Dr.',
    'female',
    (SELECT id FROM public.hospitals WHERE slug = 'asan-medical-center'),
    (SELECT id FROM public.specializations WHERE slug = 'neurology'),
    'Dr. Park specializes in movement disorders and deep brain stimulation surgery.',
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    12, 4.8, 680,
    180, 320, 'USD',
    TRUE, FALSE, TRUE
);

-- =============================================
-- DOCTOR LANGUAGES
-- =============================================

-- All doctors speak English
INSERT INTO public.doctor_languages (doctor_id, language_id, proficiency)
SELECT d.id, l.id, 'fluent'
FROM public.doctors d, public.languages l
WHERE l.code = 'en';

-- Thai doctors speak Thai
INSERT INTO public.doctor_languages (doctor_id, language_id, proficiency)
SELECT d.id, l.id, 'native'
FROM public.doctors d
JOIN public.hospitals h ON h.id = d.hospital_id
JOIN public.countries c ON c.id = h.country_id
JOIN public.languages l ON l.code = 'th'
WHERE c.code = 'TH';

-- Korean doctors speak Korean
INSERT INTO public.doctor_languages (doctor_id, language_id, proficiency)
SELECT d.id, l.id, 'native'
FROM public.doctors d
JOIN public.hospitals h ON h.id = d.hospital_id
JOIN public.countries c ON c.id = h.country_id
JOIN public.languages l ON l.code = 'ko'
WHERE c.code = 'KR';

-- =============================================
-- SAMPLE MEDICAL PACKAGES
-- =============================================

INSERT INTO public.medical_packages (
    hospital_id, category_id, title, slug, description,
    image_url, price, original_price, currency, discount_percentage,
    valid_until, is_featured, is_active
) VALUES
-- Health Check-up Packages
(
    (SELECT id FROM public.hospitals WHERE slug = 'bumrungrad-international-hospital'),
    (SELECT id FROM public.package_categories WHERE slug = 'medical-checkup'),
    'Executive Health Checkup',
    'executive-health-checkup',
    'Comprehensive health screening including blood tests, cardiac assessment, and imaging studies.',
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400',
    850.00, 1000.00, 'USD', 15,
    '2025-12-31',
    TRUE, TRUE
),
(
    (SELECT id FROM public.hospitals WHERE slug = 'bumrungrad-international-hospital'),
    (SELECT id FROM public.package_categories WHERE slug = 'heart-screening'),
    'Cardiac Health Package',
    'cardiac-health-package',
    'Complete heart health assessment including ECG, stress test, and echocardiogram.',
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=80&w=400',
    650.00, NULL, 'USD', NULL,
    NULL,
    TRUE, TRUE
),
(
    (SELECT id FROM public.hospitals WHERE slug = 'mount-elizabeth-hospital'),
    (SELECT id FROM public.package_categories WHERE slug = 'cancer-screening'),
    'Cancer Screening Package',
    'cancer-screening-package',
    'Comprehensive cancer markers, imaging, and specialist consultation.',
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400',
    1200.00, 1500.00, 'USD', 20,
    '2025-06-30',
    TRUE, TRUE
),
(
    (SELECT id FROM public.hospitals WHERE slug = 'asan-medical-center'),
    (SELECT id FROM public.package_categories WHERE slug = 'medical-checkup'),
    'Premium Health Checkup Korea',
    'premium-health-checkup-korea',
    'Full body checkup with PET-CT scan, MRI, and comprehensive blood panel.',
    'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=80&w=400',
    2500.00, 3000.00, 'USD', 17,
    '2025-12-31',
    TRUE, TRUE
),
(
    (SELECT id FROM public.hospitals WHERE slug = 'prince-court-medical-centre'),
    (SELECT id FROM public.package_categories WHERE slug = 'women-health'),
    'Women Wellness Package',
    'women-wellness-package',
    'Comprehensive women''s health screening including mammography and gynecological assessment.',
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    450.00, NULL, 'USD', NULL,
    NULL,
    FALSE, TRUE
),
(
    (SELECT id FROM public.hospitals WHERE slug = 'siloam-hospitals'),
    (SELECT id FROM public.package_categories WHERE slug = 'medical-checkup'),
    'Basic Medical Check-Up',
    'basic-medical-check-up',
    'Essential health screening package with blood tests and basic examination.',
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400',
    400000.00, NULL, 'IDR', NULL,
    NULL,
    FALSE, TRUE
);

-- =============================================
-- SAMPLE TESTIMONIALS
-- =============================================

INSERT INTO public.testimonials (
    name, role, country, thumbnail_url, video_url, quote,
    hospital_id, rating, is_featured, is_video, display_order
) VALUES
(
    'Sarah Johnson',
    'Medical Tourist',
    'United States',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
    'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'The care I received at Bumrungrad was exceptional. From the moment I arrived, the staff made me feel comfortable and well-cared for.',
    (SELECT id FROM public.hospitals WHERE slug = 'bumrungrad-international-hospital'),
    5.0, TRUE, TRUE, 1
),
(
    'David Chen',
    'Business Executive',
    'Singapore',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    NULL,
    'Mount Elizabeth Hospital exceeded all my expectations. The medical team was highly professional and the facilities were world-class.',
    (SELECT id FROM public.hospitals WHERE slug = 'mount-elizabeth-hospital'),
    5.0, TRUE, FALSE, 2
),
(
    'Fatima Al-Hassan',
    'Patient',
    'United Arab Emirates',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    NULL,
    'I traveled from Dubai for treatment and was amazed by the level of care. The international patient services made everything seamless.',
    (SELECT id FROM public.hospitals WHERE slug = 'asan-medical-center'),
    4.9, TRUE, FALSE, 3
),
(
    'Michael Thompson',
    'Retiree',
    'Australia',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'The combination of excellent medical care and affordable prices made Thailand the perfect choice for my surgery.',
    (SELECT id FROM public.hospitals WHERE slug = 'bangkok-hospital'),
    4.8, TRUE, TRUE, 4
);

-- =============================================
-- SAMPLE HOSPITAL FACILITIES
-- =============================================

INSERT INTO public.hospital_facilities (hospital_id, category, name, description) VALUES
-- Bumrungrad Facilities
((SELECT id FROM public.hospitals WHERE slug = 'bumrungrad-international-hospital'), 'Medical Centre', 'Heart Center', 'Advanced cardiac care with catheterization labs'),
((SELECT id FROM public.hospitals WHERE slug = 'bumrungrad-international-hospital'), 'Medical Centre', 'Cancer Center', 'Comprehensive oncology services'),
((SELECT id FROM public.hospitals WHERE slug = 'bumrungrad-international-hospital'), 'Medical Centre', 'ICU', '24/7 intensive care unit'),
((SELECT id FROM public.hospitals WHERE slug = 'bumrungrad-international-hospital'), 'Technology', 'Robotic Surgery', 'Da Vinci robotic surgical system'),
((SELECT id FROM public.hospitals WHERE slug = 'bumrungrad-international-hospital'), 'Technology', '3T MRI', 'High-resolution imaging'),
((SELECT id FROM public.hospitals WHERE slug = 'bumrungrad-international-hospital'), 'Patient Care', 'VIP Suites', 'Luxury patient rooms'),
((SELECT id FROM public.hospitals WHERE slug = 'bumrungrad-international-hospital'), 'Amenities', 'International Kitchen', 'Multi-cuisine dining'),

-- Mount Elizabeth Facilities
((SELECT id FROM public.hospitals WHERE slug = 'mount-elizabeth-hospital'), 'Medical Centre', 'Cardiac Center', 'Full cardiac services'),
((SELECT id FROM public.hospitals WHERE slug = 'mount-elizabeth-hospital'), 'Medical Centre', 'Neuroscience Center', 'Brain and spine specialty'),
((SELECT id FROM public.hospitals WHERE slug = 'mount-elizabeth-hospital'), 'Technology', 'Linear Accelerator', 'Advanced radiation therapy'),
((SELECT id FROM public.hospitals WHERE slug = 'mount-elizabeth-hospital'), 'Patient Care', 'Executive Suites', 'Premium accommodation'),

-- Asan Facilities
((SELECT id FROM public.hospitals WHERE slug = 'asan-medical-center'), 'Medical Centre', 'Organ Transplant Center', 'Leading in organ transplants'),
((SELECT id FROM public.hospitals WHERE slug = 'asan-medical-center'), 'Technology', 'Proton Therapy', 'Advanced cancer treatment'),
((SELECT id FROM public.hospitals WHERE slug = 'asan-medical-center'), 'Technology', 'PET-CT Scanner', 'Diagnostic imaging');

-- =============================================
-- SAMPLE HOSPITAL AWARDS
-- =============================================

INSERT INTO public.hospital_awards (hospital_id, title, organization, year) VALUES
((SELECT id FROM public.hospitals WHERE slug = 'bumrungrad-international-hospital'), 'Best Medical Tourism Hospital', 'APAC Healthcare Awards', 2023),
((SELECT id FROM public.hospitals WHERE slug = 'bumrungrad-international-hospital'), 'Gold Award Customer Service', 'Asian Hospital Management Awards', 2019),
((SELECT id FROM public.hospitals WHERE slug = 'bumrungrad-international-hospital'), 'Excellence in Patient Care', 'Global Health Asia', 2022),
((SELECT id FROM public.hospitals WHERE slug = 'mount-elizabeth-hospital'), 'Best Private Hospital Singapore', 'Singapore Health Awards', 2023),
((SELECT id FROM public.hospitals WHERE slug = 'asan-medical-center'), 'Best Hospital in Korea', 'Newsweek World''s Best Hospitals', 2024),
((SELECT id FROM public.hospitals WHERE slug = 'asan-medical-center'), 'Excellence in Organ Transplant', 'Asian Medical Association', 2023);

-- =============================================
-- SAMPLE TREATMENTS
-- =============================================

INSERT INTO public.treatments (
    name, slug, specialization_id, overview, why_performed,
    what_to_expect, typical_duration, typical_cost_min, typical_cost_max, currency
) VALUES
(
    'Coronary Artery Bypass Grafting (CABG)',
    'coronary-artery-bypass-grafting',
    (SELECT id FROM public.specializations WHERE slug = 'cardiology'),
    'CABG is a surgical procedure that improves blood flow to the heart by creating new pathways around blocked arteries.',
    ARRAY['Severe coronary artery disease', 'Multiple blocked arteries', 'Failed angioplasty', 'Diabetes with heart disease'],
    ARRAY['Hospital stay of 5-7 days', 'Recovery period of 6-12 weeks', 'Cardiac rehabilitation program', 'Regular follow-up visits'],
    '4-6 hours',
    15000.00, 35000.00, 'USD'
),
(
    'Total Knee Replacement',
    'total-knee-replacement',
    (SELECT id FROM public.specializations WHERE slug = 'orthopedics'),
    'Total knee replacement surgery involves replacing damaged knee joint surfaces with artificial implants.',
    ARRAY['Severe arthritis', 'Chronic knee pain', 'Limited mobility', 'Failed conservative treatment'],
    ARRAY['Hospital stay of 3-5 days', 'Physical therapy starting day 1', 'Full recovery in 3-6 months', 'Long-lasting results'],
    '1-2 hours',
    8000.00, 20000.00, 'USD'
),
(
    'IVF Treatment',
    'ivf-treatment',
    (SELECT id FROM public.specializations WHERE slug = 'fertility-ivf'),
    'In Vitro Fertilization (IVF) is an assisted reproductive technology that involves fertilizing eggs outside the body.',
    ARRAY['Blocked fallopian tubes', 'Male factor infertility', 'Unexplained infertility', 'Advanced maternal age'],
    ARRAY['Multiple clinic visits', 'Hormone injections for 10-14 days', 'Egg retrieval procedure', 'Embryo transfer after 3-5 days'],
    '4-6 weeks per cycle',
    5000.00, 15000.00, 'USD'
);

-- =============================================
-- SEED DATA COMPLETE
-- =============================================
