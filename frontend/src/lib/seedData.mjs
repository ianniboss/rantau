// Seed data: 10 cities + Administrative Guides (official links used verbatim from the spec).
export const CITY_SEED = [
  'Paris', 'Toulouse', 'Lyon', 'Bordeaux', 'Lille', 'Marseille', 'Montpellier', 'Nantes', 'Strasbourg', 'Nice',
].map((name) => ({ id: name.toLowerCase(), name, studentCount: 0, places: [], tips: [] }));

const SEED_UPLOADER = { uid: 'seed', name: 'Rantau Team' };

const adminResource = (title, externalLink, description, tags) => ({
  title,
  description,
  category: 'administrative',
  externalLink,
  fileUrl: null,
  fileType: null,
  uploadedBy: SEED_UPLOADER,
  upvotes: 0,
  downvotes: 0,
  votedBy: {},
  downloads: 0,
  tags,
  status: 'approved',
  isSeed: true,
});

export const ADMIN_RESOURCES = [
  adminResource(
    'CAF Housing Aid (APL) — Application Guide',
    'https://www.caf.fr',
    'Apply without a social security number initially; get a temporary "P" + 8-digit ID. Housing aid (APL) can cover a significant share of your monthly rent.',
    ['caf', 'apl', 'housing', 'money'],
  ),
  adminResource(
    'CAF — Foreign Student Info',
    'https://www.caf.fr/allocataires',
    'Search "étudiant étranger" on the CAF site. Requires a valid long-stay visa (VLS-TS), tenancy in your own name, and a stay of 8+ months.',
    ['caf', 'visa', 'vls-ts', 'housing'],
  ),
  adminResource(
    'Ameli — Student Health Insurance Registration',
    'https://etudiant-etranger.ameli.fr',
    'Register here first as a new international student to get into the French health system (Sécurité sociale).',
    ['ameli', 'health', 'insurance', 'securite-sociale'],
  ),
  adminResource(
    'Ameli — General Health Insurance',
    'https://www.ameli.fr',
    'Main portal once you have a permanent social security number (starts with 1 or 2). Manage your carte Vitale, reimbursements and doctor declarations.',
    ['ameli', 'health', 'carte-vitale'],
  ),
  adminResource(
    'Service Public — Residence Permit / Titre de Séjour',
    'https://www.service-public.fr',
    'Official government portal for all administrative procedures, including residence permit (titre de séjour) renewals.',
    ['titre-de-sejour', 'visa', 'prefecture', 'government'],
  ),
  adminResource(
    'Campus France',
    'https://www.campusfrance.org/en',
    'Official info source for international students in France: visas, scholarships, university applications and arrival guides.',
    ['campus-france', 'visa', 'scholarship', 'university'],
  ),
  adminResource(
    'France Connect',
    'https://franceconnect.gouv.fr',
    'Single sign-on used across French admin sites (CAF, Ameli, impots.gouv.fr). Set it up once to avoid juggling passwords.',
    ['france-connect', 'login', 'government'],
  ),
  adminResource(
    'Bank comparison (student accounts)',
    'https://www.boursobank.com', // TODO: verify current URL — also compare Société Générale and BNP Paribas student offers
    'Many banks offer free accounts for students; compare RIB/IBAN setup speed, card fees and welcome bonuses. Candidates: BoursoBank, Société Générale, BNP Paribas student offers.',
    ['bank', 'rib', 'iban', 'money'],
  ),
  adminResource(
    'Free / SFR / Bouygues / Orange mobile plans',
    'https://mobile.free.fr', // TODO: verify current URL — each carrier has its own "forfait étudiant" page
    'Free Mobile has no-commitment plans, popular with students. Also compare SFR, Bouygues Telecom and Orange "forfait étudiant" pages.',
    ['mobile', 'sim', 'forfait', 'telecom'],
  ),
];

export const ACADEMIC_RESOURCES = [
  {
    ...adminResource(
      'JPA (Jabatan Perkhidmatan Awam) Scholarship Info',
      'https://www.jpa.gov.my',
      'Official Malaysian government scholarship info (Jabatan Perkhidmatan Awam) — the most common sponsor of Malaysian students in France.',
      ['jpa', 'scholarship', 'malaysia'],
    ),
    category: 'academic',
  },
  {
    ...adminResource(
      'MARA Scholarship Info',
      'https://www.mara.gov.my',
      'Majlis Amanah Rakyat (MARA) scholarship and education loan info for Malaysian students studying abroad.',
      ['mara', 'scholarship', 'malaysia'],
    ),
    category: 'academic',
  },
  {
    ...adminResource(
      'French CV / Cover Letter Templates',
      null,
      'Placeholder — community members can upload their own French-format CV and lettre de motivation templates here.',
      ['cv', 'lettre-de-motivation', 'jobs'],
    ),
    category: 'academic',
  },
  {
    ...adminResource(
      'BUT / French University System Explainer',
      null,
      'Placeholder — a student-written guide to the BUT, Licence, Master and Grande École pathways.',
      ['but', 'university', 'licence', 'master'],
    ),
    category: 'academic',
  },
];
