import json
from database.connection import execute_db, execute_many_db, query_db

# ============= SCHEMES DATA =============
SCHEMES = [
    # PM-KISAN
    ('pm_kisan', 'PM-KISAN Samman Nidhi', 'पीएम-किसान सम्मान निधि',
     'Ministry of Agriculture',
     'Income support of ₹6,000 per year to all landholding farmer families paid in three equal instalments of ₹2,000 each',
     'प्रति वर्ष सभी भू-स्वामी किसान परिवारों को ₹6,000 की आय सहायता',
     'cash', 6000, 'annual', '["working_age"]', None,
     'https://pmkisan.gov.in', 'online', None,
     'Ministry of Agriculture Notification dated 01.12.2018',
     '🌾', 'Agriculture', None, 1),

    # Ayushman Bharat
    ('ayushman_bharat', 'Ayushman Bharat PMJAY', 'आयुष्मान भारत',
     'Ministry of Health',
     'Health insurance coverage of ₹5 lakh per family per year for secondary and tertiary care hospitalization',
     'प्रति परिवार प्रति वर्ष ₹5 लाख का स्वास्थ्य बीमा कवरेज',
     'insurance', 500000, 'annual', '["child", "youth", "working_age", "elderly"]', None,
     'https://pmjay.gov.in', 'both', None,
     'PM-JAY Guidelines 2018',
     '🏥', 'Health', None, 1),

    # Ujjwala
    ('ujjwala', 'PM Ujjwala Yojana', 'प्रधानमंत्री उज्ज्वला योजना',
     'Ministry of Petroleum',
     'Free LPG connection to BPL households with financial support of ₹1,600 per connection',
     'बीपीएल परिवारों को मुफ्त एलपीजी कनेक्शन',
     'kind', 1600, 'one_time', '["working_age"]', None,
     'https://pmuy.gov.in', 'offline', None,
     'PMUY Guidelines 2016',
     '🔥', 'Energy', None, 1),

    # PMAY-G
    ('pmay_g', 'PM Awas Yojana (Gramin)', 'प्रधानमंत्री आवास योजना ग्रामीण',
     'Ministry of Rural Development',
     'Financial assistance for construction of pucca house with unit cost of ₹1.20 lakh in plain areas',
     'पक्के मकान निर्माण के लिए वित्तीय सहायता',
     'cash', 120000, 'one_time', '["working_age"]', None,
     'https://pmayg.nic.in', 'csc', None,
     'PMAY-G Guidelines 2016',
     '🏠', 'Housing', None, 1),

    # Post-Matric Scholarship
    ('nsp_postmatric', 'Post-Matric Scholarship', 'पोस्ट-मैट्रिक छात्रवृत्ति',
     'Ministry of Social Justice',
     'Scholarship for SC/ST/OBC students in post-matric education including tuition fees and maintenance allowance',
     'अनुसूचित जाति/जनजाति/ओबीसी छात्रों के लिए छात्रवृत्ति',
     'cash', 12000, 'annual', '["youth"]', None,
     'https://scholarships.gov.in', 'online', None,
     'Post Matric Scholarship Scheme Guidelines',
     '🎓', 'Education', None, 1),

    # Widow Pension (Jharkhand)
    ('widow_pension_jh', 'Widow Pension (Jharkhand)', 'विधवा पेंशन (झारखंड)',
     'Social Welfare Dept, Jharkhand',
     'Monthly pension of ₹1,000 for widows aged 18-60 years',
     'विधवाओं के लिए मासिक पेंशन',
     'cash', 12000, 'annual', '["working_age", "elderly"]', '["death"]',
     'https://jkuber.jharkhand.gov.in', 'offline', None,
     'Jharkhand State Pension Rules',
     '👩', 'Social Security', 'Jharkhand', 1),

    # Kisan Credit Card
    ('kisan_credit_card', 'Kisan Credit Card', 'किसान क्रेडिट कार्ड',
     'Ministry of Agriculture',
     'Credit facility for farmers at subsidized interest rates for agriculture and allied activities',
     'कृषि और संबद्ध गतिविधियों के लिए सब्सिडी वाली ब्याज दरों पर ऋण सुविधा',
     'loan', 300000, 'annual', '["working_age"]', None,
     'https://pmkisan.gov.in/KCC.aspx', 'both', None,
     'KCC Scheme Guidelines',
     '💳', 'Agriculture', None, 1),

    # PMFBY
    ('pmfby', 'PM Fasal Bima Yojana', 'प्रधानमंत्री फसल बीमा योजना',
     'Ministry of Agriculture',
     'Crop insurance at subsidized premium providing coverage for crop loss due to natural calamities',
     'प्राकृतिक आपदाओं के कारण फसल नुकसान के लिए बीमा',
     'insurance', 200000, 'annual', '["working_age"]', None,
     'https://pmfby.gov.in', 'both', None,
     'PMFBY Guidelines 2016',
     '🌱', 'Agriculture', None, 1),

    # MKAY (Jharkhand)
    ('mkay_jh', 'Mukhyamantri Krishi Ashirwad Yojana', 'मुख्यमंत्री कृषि आशीर्वाद योजना',
     'Agriculture Dept, Jharkhand',
     '₹5,000 per acre financial assistance to small and marginal farmers having up to 5 acres of land',
     'छोटे और सीमांत किसानों को प्रति एकड़ ₹5,000 की सहायता',
     'cash', 25000, 'annual', '["working_age"]', None,
     'https://agri.jharkhand.gov.in', 'online', None,
     'Jharkhand MKAY Rules 2019',
     '🚜', 'Agriculture', 'Jharkhand', 1),

    # Atal Pension Yojana
    ('atal_pension', 'Atal Pension Yojana', 'अटल पेंशन योजना',
     'Ministry of Finance',
     'Pension scheme for unorganized sector workers providing guaranteed minimum pension of ₹1,000 to ₹5,000',
     'असंगठित क्षेत्र के श्रमिकों के लिए पेंशन योजना',
     'cash', 60000, 'annual', '["elderly"]', None,
     'https://npstrust.org.in/atal-pension-yojana', 'both', None,
     'APY Guidelines 2015',
     '👴', 'Social Security', None, 1),

    # PMSBY
    ('pmsby', 'PM Suraksha Bima Yojana', 'प्रधानमंत्री सुरक्षा बीमा योजना',
     'Ministry of Finance',
     'Accidental death and disability insurance for ₹2 lakh at premium of ₹12 per year',
     'दुर्घटना बीमा योजना',
     'insurance', 200000, 'annual', '["working_age"]', None,
     'https://jansuraksha.gov.in', 'both', None,
     'PMSBY Guidelines 2015',
     '🛡️', 'Insurance', None, 1),

    # Sukanya Samriddhi
    ('sukanya', 'Sukanya Samriddhi Yojana', 'सुकन्या समृद्धि योजना',
     'Ministry of Finance',
     'Small savings scheme for girl child with attractive interest rate and tax benefits',
     'बालिकाओं के लिए बचत योजना',
     'cash', 500000, 'one_time', '["child"]', '["birth"]',
     'https://www.india.gov.in/sukanya-samriddhi-yojna', 'both', None,
     'SSY Rules 2019',
     '👧', 'Education', None, 1),
]

# ============= SCHEME RULES DATA =============
SCHEME_RULES = [
    # PM-KISAN Rules
    ('pm_kisan', 'occupation', 'in', '["farmer", "agricultural_laborer"]', 1, 'Must be engaged in farming'),
    ('pm_kisan', 'has_cultivable_land', 'eq', 'true', 1, 'Must have cultivable land'),
    ('pm_kisan', 'income_tax_payer', 'eq', 'false', 1, 'Should not be income tax payer'),

    # Ayushman Bharat Rules
    ('ayushman_bharat', 'bpl_status', 'eq', 'true', 0, 'BPL status increases eligibility'),
    ('ayushman_bharat', 'annual_income', 'in', '["Less than ₹1 Lakh", "₹1-2.5 Lakh"]', 0, 'Low income preferred'),

    # Ujjwala Rules
    ('ujjwala', 'bpl_status', 'eq', 'true', 1, 'Must be BPL'),
    ('ujjwala', 'gender', 'eq', 'female', 1, 'Connection in woman\'s name'),
    ('ujjwala', 'has_lpg_connection', 'eq', 'false', 1, 'Should not have existing LPG'),

    # PMAY-G Rules
    ('pmay_g', 'area_type', 'eq', 'Rural', 1, 'Only for rural areas'),
    ('pmay_g', 'owns_pucca_house', 'eq', 'false', 1, 'Should not own pucca house'),
    ('pmay_g', 'bpl_status', 'eq', 'true', 0, 'Preference to BPL families'),

    # Post-Matric Scholarship Rules
    ('nsp_postmatric', 'caste_category', 'in', '["SC", "ST", "OBC"]', 1, 'Must be SC/ST/OBC'),
    ('nsp_postmatric', 'is_student', 'eq', 'true', 1, 'Must be currently enrolled'),
    ('nsp_postmatric', 'annual_income', 'in', '["Less than ₹1 Lakh", "₹1-2.5 Lakh"]', 1, 'Income limit'),

    # Widow Pension Rules
    ('widow_pension_jh', 'state', 'eq', 'Jharkhand', 1, 'Must be resident of Jharkhand'),
    ('widow_pension_jh', 'marital_status', 'eq', 'Widowed', 1, 'Must be widow'),
    ('widow_pension_jh', 'age', 'gte', '18', 1, 'Minimum age 18'),

    # Kisan Credit Card Rules
    ('kisan_credit_card', 'occupation', 'in', '["farmer", "agricultural_laborer"]', 1, 'Must be farmer'),
    ('kisan_credit_card', 'has_cultivable_land', 'eq', 'true', 1, 'Must have cultivable land'),

    # PMFBY Rules
    ('pmfby', 'occupation', 'in', '["farmer", "agricultural_laborer"]', 1, 'Must be farmer'),
    ('pmfby', 'has_cultivable_land', 'eq', 'true', 1, 'Must have cultivable land'),

    # MKAY Rules
    ('mkay_jh', 'state', 'eq', 'Jharkhand', 1, 'Must be resident of Jharkhand'),
    ('mkay_jh', 'occupation', 'in', '["farmer", "agricultural_laborer"]', 1, 'Must be farmer'),
    ('mkay_jh', 'land_holding', 'lte', '5', 1, 'Land holding up to 5 acres'),

    # Atal Pension Rules
    ('atal_pension', 'age', 'gte', '60', 1, 'Minimum age 60 for pension'),
    ('atal_pension', 'occupation', 'in', '["Daily Wage Worker", "Self-employed", "Homemaker"]', 0, 'Unorganized sector'),

    # PMSBY Rules
    ('pmsby', 'age', 'gte', '18', 1, 'Minimum age 18'),
    ('pmsby', 'age', 'lte', '70', 1, 'Maximum age 70'),

    # Sukanya Samriddhi Rules
    ('sukanya', 'gender', 'eq', 'female', 1, 'Only for girl child'),
    ('sukanya', 'age', 'lte', '10', 1, 'Maximum age 10 years at account opening'),
]

# ============= SCHEME RELATIONS DATA =============
SCHEME_RELATIONS = [
    # Conflicts
    ('pm_kisan', 'mkay_jh', 'conflicts', 'Cannot avail both PM-KISAN and state\'s Krishi Ashirwad'),

    # Dependencies
    ('ujjwala', 'bpl_card', 'depends', 'BPL card required for Ujjwala'),

    # Stacks
    ('pm_kisan', 'pmfby', 'stacks', 'Can avail both income support and crop insurance'),
    ('pm_kisan', 'kisan_credit_card', 'stacks', 'Can avail both PM-KISAN and KCC'),
    ('pmfby', 'kisan_credit_card', 'stacks', 'Crop insurance and credit facility can be combined'),
]

# ============= SCHEME DOCUMENTS DATA =============
SCHEME_DOCUMENTS = [
    # PM-KISAN Documents
    ('pm_kisan', 'Aadhaar Card', 'आधार कार्ड', 1, 'Visit nearest Aadhaar center', '1-2 days'),
    ('pm_kisan', 'Land Records (Khatiyan)', 'भूमि अभिलेख', 1, 'From Circle Office or online portal', '3-5 days'),
    ('pm_kisan', 'Bank Passbook', 'बैंक पासबुक', 1, 'From your bank', '1 day'),

    # Ujjwala Documents
    ('ujjwala', 'BPL Card', 'बीपीएल कार्ड', 1, 'From Block Development Office', '7-10 days'),
    ('ujjwala', 'Aadhaar Card', 'आधार कार्ड', 1, 'Visit nearest Aadhaar center', '1-2 days'),
    ('ujjwala', 'Passport Photo', 'पासपोर्ट फोटो', 1, 'Any photo studio', 'Same day'),

    # Ayushman Bharat Documents
    ('ayushman_bharat', 'Aadhaar Card', 'आधार कार्ड', 1, 'Visit nearest Aadhaar center', '1-2 days'),
    ('ayushman_bharat', 'Family Identity Card', 'परिवार पहचान पत्र', 1, 'Check SECC database or visit CSC', '2-3 days'),

    # Post-Matric Scholarship Documents
    ('nsp_postmatric', 'Aadhaar Card', 'आधार कार्ड', 1, 'Visit nearest Aadhaar center', '1-2 days'),
    ('nsp_postmatric', 'Caste Certificate', 'जाति प्रमाण पत्र', 1, 'From Tehsil Office', '7-15 days'),
    ('nsp_postmatric', 'Income Certificate', 'आय प्रमाण पत्र', 1, 'From Tehsil Office', '7-15 days'),
    ('nsp_postmatric', 'Bank Account', 'बैंक खाता', 1, 'Open account at any bank', '1-2 days'),
]

# ============= QUESTIONS DATA =============
QUESTIONS = [
    ('q_state', 'state', 'Which state do you live in?', 'आप किस राज्य में रहते हैं?',
     'select', '["Jharkhand", "Bihar", "Odisha", "Uttar Pradesh", "Madhya Pradesh", "Karnataka", "Other"]', 100, 0.9),

    ('q_area', 'area_type', 'Do you live in a rural or urban area?', 'आप ग्रामीण या शहरी क्षेत्र में रहते हैं?',
     'radio', '["Rural", "Urban"]', 95, 0.7),

    ('q_gender', 'gender', 'What is your gender?', 'आपका लिंग क्या है?',
     'radio', '["Male", "Female", "Other"]', 90, 0.5),

    ('q_age', 'age', 'What is your age?', 'आपकी उम्र क्या है?',
     'number', None, 85, 0.6),

    ('q_occupation', 'occupation', 'What is your primary occupation?', 'आपका मुख्य व्यवसाय क्या है?',
     'select', '["Farmer", "Agricultural Laborer", "Daily Wage Worker", "Small Business", "Employed", "Student", "Homemaker", "Unemployed", "Other"]', 80, 0.85),

    ('q_bpl', 'bpl_status', 'Do you have a BPL (Below Poverty Line) card?', 'क्या आपके पास बीपीएल कार्ड है?',
     'radio', '["Yes", "No", "Not Sure"]', 75, 0.8),

    ('q_income', 'annual_income', 'What is your approximate annual family income?', 'आपकी वार्षिक पारिवारिक आय लगभग कितनी है?',
     'select', '["Less than ₹1 Lakh", "₹1-2.5 Lakh", "₹2.5-5 Lakh", "More than ₹5 Lakh", "Not Sure"]', 70, 0.75),

    ('q_caste', 'caste_category', 'What is your caste category?', 'आपकी जाति श्रेणी क्या है?',
     'select', '["General", "OBC", "SC", "ST", "Prefer not to say"]', 65, 0.6),

    ('q_children', 'has_school_children', 'Do you have children studying in school/college?', 'क्या आपके बच्चे स्कूल/कॉलेज में पढ़ते हैं?',
     'radio', '["Yes", "No"]', 60, 0.5),

    ('q_marital', 'marital_status', 'What is your marital status?', 'आपकी वैवाहिक स्थिति क्या है?',
     'select', '["Married", "Unmarried", "Widowed", "Divorced", "Separated"]', 55, 0.4),
]

# ============= PERSONAS DATA =============
PERSONAS = [
    # Ramesh Kumar - Farmer
    ('ramesh', 'Ramesh Kumar', 'रमेश कुमार', 45, None,
     json.dumps({
         "state": "Jharkhand",
         "area_type": "Rural",
         "gender": "Male",
         "age": 45,
         "occupation": "Farmer",
         "bpl_status": True,
         "annual_income": "Less than ₹1 Lakh",
         "caste_category": "OBC",
         "has_school_children": True,
         "marital_status": "Married",
         "has_cultivable_land": True,
         "land_holding": 2,
         "income_tax_payer": False
     }),
     'Ramesh is a 45-year-old farmer in rural Jharkhand. He has a BPL card and owns 2 acres of land. His daughter Priya is in Class 8. Despite being eligible for multiple schemes, he only knows about PM-KISAN.',
     'रमेश झारखंड के ग्रामीण क्षेत्र में 45 वर्षीय किसान हैं। उनके पास बीपीएल कार्ड और 2 एकड़ जमीन है।',
     12),

    # Lakshmi Devi - Widow
    ('lakshmi', 'Lakshmi Devi', 'लक्ष्मी देवी', 38, None,
     json.dumps({
         "state": "Karnataka",
         "area_type": "Urban",
         "gender": "Female",
         "age": 38,
         "occupation": "Homemaker",
         "bpl_status": True,
         "annual_income": "Less than ₹1 Lakh",
         "caste_category": "SC",
         "has_school_children": True,
         "marital_status": "Widowed",
         "children_count": 2
     }),
     'Lakshmi is a 38-year-old widow in Bangalore. After her husband\'s death, she struggles to support her two children. She is unaware of widow pension and educational scholarships.',
     'लक्ष्मी बैंगलोर की 38 वर्षीय विधवा हैं। अपने पति की मृत्यु के बाद, वह अपने दो बच्चों का समर्थन करने के लिए संघर्ष कर रही हैं।',
     9),

    # Arjun Prasad - Student
    ('arjun', 'Arjun Prasad', 'अर्जुन प्रसाद', 22, None,
     json.dumps({
         "state": "Bihar",
         "area_type": "Rural",
         "gender": "Male",
         "age": 22,
         "occupation": "Student",
         "bpl_status": False,
         "annual_income": "₹1-2.5 Lakh",
         "caste_category": "SC",
         "education_level": "Engineering",
         "marital_status": "Unmarried",
         "is_student": True
     }),
     'Arjun is a 22-year-old engineering student from a lower-middle-class SC family in Bihar. He is looking for scholarships to fund his education.',
     'अर्जुन बिहार के एक निम्न-मध्यम वर्ग के अनुसूचित जाति परिवार से 22 वर्षीय इंजीनियरिंग छात्र हैं।',
     7),
]

# ============= DISTRICTS DATA =============
DISTRICTS = [
    ('ranchi', 'Ranchi', 'Jharkhand', 2914253, 728563, 450000,
     json.dumps({
         "pm_kisan": {"eligible": 124000, "enrolled": 89000},
         "ayushman_bharat": {"eligible": 450000, "enrolled": 320000},
         "widow_pension_jh": {"eligible": 8200, "enrolled": 3100},
         "ujjwala": {"eligible": 45000, "enrolled": 41000}
     })),

    ('patna', 'Patna', 'Bihar', 5838465, 1167693, 320000,
     json.dumps({
         "pm_kisan": {"eligible": 98000, "enrolled": 72000},
         "ayushman_bharat": {"eligible": 620000, "enrolled": 410000},
         "nsp_postmatric": {"eligible": 15000, "enrolled": 12500}
     })),
]

# ============= SEED FUNCTION =============
def seed_database():
    """Seed database with all demo data"""
    try:
        print("\n[INFO] Seeding database...")

        # Insert Schemes
        print("[INFO] Inserting schemes...")
        scheme_query = """
            INSERT INTO schemes (id, name, name_hindi, ministry, description, description_hindi,
                                benefit_type, benefit_value, benefit_frequency, life_stages, trigger_events,
                                application_url, application_mode, deadline, legal_citation, icon, category, state, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        for scheme in SCHEMES:
            execute_db(scheme_query, scheme)
        print(f"[OK] Inserted {len(SCHEMES)} schemes")

        # Insert Scheme Rules
        print("[INFO] Inserting scheme rules...")
        rule_query = """
            INSERT INTO scheme_rules (scheme_id, attribute, operator, value, is_hard_constraint, description)
            VALUES (?, ?, ?, ?, ?, ?)
        """
        for rule in SCHEME_RULES:
            execute_db(rule_query, rule)
        print(f"[OK] Inserted {len(SCHEME_RULES)} rules")

        # Insert Scheme Relations
        print("[INFO] Inserting scheme relations...")
        relation_query = """
            INSERT INTO scheme_relations (scheme_id_1, scheme_id_2, relation_type, description)
            VALUES (?, ?, ?, ?)
        """
        for relation in SCHEME_RELATIONS:
            execute_db(relation_query, relation)
        print(f"[OK] Inserted {len(SCHEME_RELATIONS)} relations")

        # Insert Documents
        print("[INFO] Inserting documents...")
        doc_query = """
            INSERT INTO scheme_documents (scheme_id, document_name, document_name_hindi, is_mandatory, how_to_obtain, typical_time)
            VALUES (?, ?, ?, ?, ?, ?)
        """
        for doc in SCHEME_DOCUMENTS:
            execute_db(doc_query, doc)
        print(f"[OK] Inserted {len(SCHEME_DOCUMENTS)} documents")

        # Insert Questions
        print("[INFO] Inserting questions...")
        question_query = """
            INSERT INTO questions (id, attribute, text_en, text_hi, input_type, options, priority, information_gain)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """
        for question in QUESTIONS:
            execute_db(question_query, question)
        print(f"[OK] Inserted {len(QUESTIONS)} questions")

        # Insert Personas
        print("[INFO] Inserting personas...")
        persona_query = """
            INSERT INTO personas (id, name, name_hindi, age, avatar_url, attributes, story, story_hindi, expected_scheme_count)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        for persona in PERSONAS:
            execute_db(persona_query, persona)
        print(f"[OK] Inserted {len(PERSONAS)} personas")

        # Insert Districts
        print("[INFO] Inserting districts...")
        district_query = """
            INSERT INTO districts (id, name, state, population, bpl_population, farmer_population, scheme_stats)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """
        for district in DISTRICTS:
            execute_db(district_query, district)
        print(f"[OK] Inserted {len(DISTRICTS)} districts")

        print("\n[SUCCESS] Database seeded successfully!")
        print(f"  - {len(SCHEMES)} schemes")
        print(f"  - {len(SCHEME_RULES)} eligibility rules")
        print(f"  - {len(SCHEME_RELATIONS)} scheme relations")
        print(f"  - {len(SCHEME_DOCUMENTS)} documents")
        print(f"  - {len(QUESTIONS)} questions")
        print(f"  - {len(PERSONAS)} demo personas")
        print(f"  - {len(DISTRICTS)} districts")

    except Exception as e:
        print(f"[ERROR] Seeding failed: {e}")
        raise

if __name__ == "__main__":
    seed_database()
