export interface HeroApiResponse<T> {
  data: T;
}

export interface HeroCta {
  label?: string;
  href?: string;
}

export interface HeroContent {
  backgroundColor?: string;
  backgroundImage?: string | null;
  backgroundImageGrayscale?: boolean;
  textAlign?: 'left' | 'center' | 'right';
  layoutVariant?: 'ticket' | 'default';
  ariaLabel?: string;
  titleColor?: string;
  subtitleColor?: string;
  yearColor?: string;
  taglineColor?: string;
  primaryCtaColor?: string;
  secondaryCtaColor?: string;
  title?: string;
  subtitle?: string;
  year?: string;
  tagline?: string;
  bubbles?: string[];
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
  slug?: string;
}

// =========================
// Mission content interfaces
// =========================
export interface MissionModalItem {
  name: string;
  iconKey?: string | null;
}

export interface MissionModal {
  id: string;
  title?: string;
  items: MissionModalItem[];
}

export interface MissionStat {
  id: string;
  number: string | number;
  label: string;
  color?: string;
  iconKey?: string | null;
  action?: 'none' | 'openModal';
  modalId?: string | null;
  numberSource?: 'explicit' | 'modalItemsLength';
  visible?: boolean;
}

export interface MissionContent {
  backgroundColor?: string;
  backgroundImage?: string | null;
  backgroundImageAlt?: string | null;
  backgroundImageGrayscale?: boolean;
  ariaLabel?: string | null;
  visible?: boolean | null;
  textAlign?: 'left' | 'center' | 'right';
  layoutVariant?: 'ticket' | 'default';
  animationsEnabled?: boolean | null;

  title?: string | null;
  titleColor?: string | null;
  titleGradient?: string | null;
  titleUnderlineGradient?: string | null;

  badgeLabel?: string | null;
  badgeIcon?: { type: 'glyph' | 'iconKey'; value: string } | null;
  badgeTextColor?: string | null;
  badgeBgColor?: string | null;
  badgeBorderColor?: string | null;

  statementTitle?: string | null;
  statementTitleColor?: string | null;
  statementText?: string | null;
  statementTextColor?: string | null;
  statementMeta?: string | null;
  statementMetaColor?: string | null;
  serial?: string | null;
  serialColor?: string | null;

  ticketStripeGradient?: string | null;
  ticketBorderColor?: string | null;
  ticketBackdropColor?: string | null;
  ticketShowBarcode?: boolean | null;

  backgroundLogo?: {
    enabled: boolean;
    svgKey?: string;
    opacity?: number;
    rotationDeg?: number;
    scale?: number;
  } | null;

  statsTitle?: string | null;
  statsTitleColor?: string | null;
  stats?: MissionStat[] | null;
  overlayColor1?: string | null;
  overlayColor2?: string | null;
  overlayOpacity?: number | null;

  statsEqualizer?: {
    enabled: boolean;
    barCount?: number;
  } | null;

  modals?: MissionModal[] | null;
}

// =========================
// Population content interfaces
// =========================
export interface PopulationStat {
  value: string;
  label: string;
  color: string;
}

export interface DemographicItem {
  id: string;
  label: string;
  value: number;
  color: string;
}

export interface PopulationContent {
  // Section Header
  sectionBadge?: string;
  sectionBadgeGradientStart?: string;
  sectionBadgeGradientEnd?: string;
  sectionBadgeGradientDegree?: number;
  sectionTitle?: string;
  sectionTitleUnderlineColor?: string;

  // Main Title
  title?: string;
  titleGradientStart?: string;
  titleGradientEnd?: string;
  titleGradientDegree?: number;
  titleUnderlineColor?: string; // Animated underline under the main title

  // Glow Blobs
  blob1ColorA?: string;
  blob1ColorB?: string;
  blob2ColorA?: string;
  blob2ColorB?: string;

  // Info Cards
  infoCard1Text?: string;
  infoCard2Text?: string;

  // Demographics Pie
  demographicsTitle?: string;
  demographicsData?: DemographicItem[];
  demographicsCaption?: string;

  // Stats
  stat1Percent?: number;
  stat1Text?: string;
  stat1Color?: string;

  stat2Percent?: number;
  stat2Text?: string;
  stat2Color?: string;

  // C-GAS
  cgasTitle?: string;
  cgasTooltip?: string;
  cgasStats?: PopulationStat[]; // Array of 3

  // Skills
  skillsTitle?: string;
  skillsList?: string[];
}

// =========================
// Defaults content interfaces
// =========================
export interface DefaultsContent {
  colorSwatch?: string[] | null;
}

// =========================
// Programs content interfaces
// =========================
export interface ProgramsProgram {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  color: string;
  features: string[];
  imageUrl?: string | null;
}

export interface ProgramsContent {
  enabled?: boolean | null;
  title?: string | null;
  subtitle?: string | null;
  programs?: ProgramsProgram[] | null;
}

// =========================
// Impact content interfaces
// =========================
export interface ImpactStat {
  id: string;
  number: number;
  label: string;
}

export interface ImpactCapacity {
  id: string;
  title: string;
  iconKey?: string | null;
}

export interface ImpactContent {
  enabled?: boolean | null;
  title?: string | null;
  statsTitle?: string | null;
  stats?: ImpactStat[] | null;
  highlightsTitle?: string | null;
  highlightsSubtitle?: string | null;
  capacities?: ImpactCapacity[] | null;
}

// =========================
// Locations content interfaces
// =========================
export interface LocationsContent {
  enabled?: boolean | null;
  title?: string | null;
}

// =========================
// Testimonials content interfaces
// =========================
export interface TestimonialsContent {
  enabled?: boolean | null;
  eyebrow?: string | null;
  name?: string | null;
  quote?: string | null;
  attribution?: string | null;
  imageUrl?: string | null;
}

// =========================
// Partners content interfaces
// =========================
export interface PartnersSupporter {
  id: string;
  name: string;
  descriptor?: string | null;
  url?: string | null;
  color: string;
  category: 'Foundations' | 'Corporate & Individual' | 'Government' | 'Community & In‑Kind';
}

export interface PartnersContent {
  enabled?: boolean | null;
  title?: string | null;
  subtitle?: string | null;
  gridLabel?: string | null;
  betweenNote?: string | null;
  viewAllLink?: string | null;
  donateLink?: string | null;
  majorCounts?: {
    Foundations?: number;
    'Corporate & Individual'?: number;
    Government?: number;
    'Community & In‑Kind'?: number;
  } | null;
  supporters?: PartnersSupporter[] | null;
}

// Media upload flow:
// 1) Use client/src/services/upload.api.ts -> uploadFile(file, { folder? })
// 2) Persist the returned { key, publicUrl, ...metadata } in your domain model
// 3) Render using the publicUrl

const DEFAULT_BACKEND_URL = 'http://localhost:4000';

const API_BASE_URL =
  (import.meta.env.VITE_BACKEND_URL as string | undefined) ?? DEFAULT_BACKEND_URL;

export async function fetchHeroContent(): Promise<HeroContent | null> {
  try {
    const url = `${API_BASE_URL}/api/impact/hero`;
    console.log('[client][hero] GET', { url });
    const response = await fetch(url, {
      credentials: 'include',
    });

    if (!response.ok) {
      // 404 means data doesn't exist yet - that's okay, not an error
      if (response.status === 404) {
        console.log('[client][hero] GET not found (404) - data not yet created');
        return null;
      }
      console.warn('[client][hero] GET failed', { status: response.status });
      return null;
    }

    const payload = (await response.json()) as HeroApiResponse<HeroContent>;
    console.log('[client][hero] GET success', { fields: Object.keys(payload?.data || {}) });
    return payload?.data ?? null;
  } catch (error) {
    // Network errors (server not running, CORS, etc.)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('[ImpactReport] Network error fetching hero content - is the server running?', error);
    } else {
      console.error('[ImpactReport] Failed to fetch hero content', error);
    }
    return null;
  }
}

export async function fetchDefaults(): Promise<DefaultsContent | null> {
  try {
    const url = `${API_BASE_URL}/api/impact/defaults`;
    console.log('[client][defaults] GET', { url });
    const response = await fetch(url, { credentials: 'include' });
    if (!response.ok) {
      console.warn('[client][defaults] GET failed', { status: response.status });
      return null;
    }
    const payload = (await response.json()) as HeroApiResponse<DefaultsContent>;
    console.log('[client][defaults] GET success', { fields: Object.keys(payload?.data || {}) });
    return payload?.data ?? null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[ImpactReport] Failed to fetch defaults', error);
    return null;
  }
}

export async function saveDefaults(
  data: DefaultsContent,
  options?: { slug?: string },
): Promise<DefaultsContent | null> {
  try {
    const url = new URL(`${API_BASE_URL}/api/impact/defaults`);
    if (options?.slug) url.searchParams.set('slug', options.slug);
    console.log('[client][defaults] PUT', { url: url.toString(), keys: Object.keys(data || {}) });
    const response = await fetch(url.toString(), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      console.warn('[client][defaults] PUT failed', { status: response.status });
      return null;
    }
    const payload = (await response.json()) as HeroApiResponse<DefaultsContent>;
    console.log('[client][defaults] PUT success', { fields: Object.keys(payload?.data || {}) });
    return payload?.data ?? null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[ImpactReport] Failed to save defaults', error);
    return null;
  }
}

export async function fetchMissionContent(): Promise<MissionContent | null> {
  try {
    const url = `${API_BASE_URL}/api/impact/mission`;
    console.log('[client][mission] GET', { url });
    const response = await fetch(url, {
      credentials: 'include',
    });
    if (!response.ok) {
      // 404 means data doesn't exist yet - that's okay, not an error
      if (response.status === 404) {
        console.log('[client][mission] GET not found (404) - data not yet created');
        return null;
      }
      console.warn('[client][mission] GET failed', { status: response.status });
      return null;
    }
    const payload = (await response.json()) as HeroApiResponse<MissionContent>;
    console.log('[client][mission] GET success', { fields: Object.keys(payload?.data || {}) });
    return payload?.data ?? null;
  } catch (error) {
    // Network errors (server not running, CORS, etc.)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('[ImpactReport] Network error fetching mission content - is the server running?', error);
    } else {
      console.error('[ImpactReport] Failed to fetch mission content', error);
    }
    return null;
  }
}

export async function saveMissionContent(
  data: Record<string, unknown>,
  options?: { slug?: string },
): Promise<MissionContent | null> {
  try {
    const url = new URL(`${API_BASE_URL}/api/impact/mission`);
    if (options?.slug) url.searchParams.set('slug', options.slug);
    console.log('[client][mission] PUT', { url: url.toString(), keys: Object.keys(data || {}) });
    const response = await fetch(url.toString(), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      console.warn('[client][mission] PUT failed', { status: response.status });
      return null;
    }
    const payload = (await response.json()) as HeroApiResponse<MissionContent>;
    console.log('[client][mission] PUT success', { fields: Object.keys(payload?.data || {}) });
    return payload?.data ?? null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[ImpactReport] Failed to save mission content', error);
    // Re-throw network errors so they can be handled with better messages
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Cannot connect to backend server at ${API_BASE_URL}. Please make sure the server is running.`);
    }
    return null;
  }
}

export async function saveHeroContent(
  data: Record<string, unknown>,
  options?: { slug?: string },
): Promise<HeroContent | null> {
  try {
    const url = new URL(`${API_BASE_URL}/api/impact/hero`);
    if (options?.slug) url.searchParams.set('slug', options.slug);
    console.log('[client][hero] PUT', { url: url.toString(), keys: Object.keys(data || {}) });
    const response = await fetch(url.toString(), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.warn('[client][hero] PUT failed', { status: response.status });
      return null;
    }

    const payload = (await response.json()) as HeroApiResponse<HeroContent>;
    console.log('[client][hero] PUT success', { fields: Object.keys(payload?.data || {}) });
    return payload?.data ?? null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[ImpactReport] Failed to save hero content', error);
    // Re-throw network errors so they can be handled with better messages
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Cannot connect to backend server at ${API_BASE_URL}. Please make sure the server is running.`);
    }
    return null;
  }
}

export async function fetchPopulationContent(): Promise<PopulationContent | null> {
  try {
    const url = `${API_BASE_URL}/api/impact/population`;
    console.log('[client][population] GET', { url });
    const response = await fetch(url, {
      credentials: 'include',
    });
    if (!response.ok) {
      console.warn('[client][population] GET failed', { status: response.status });
      return null;
    }
    const payload = (await response.json()) as HeroApiResponse<PopulationContent>;
    console.log('[client][population] GET success', { fields: Object.keys(payload?.data || {}) });
    return payload?.data ?? null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[ImpactReport] Failed to fetch population content', error);
    return null;
  }
}

export async function savePopulationContent(
  data: Record<string, unknown>,
  options?: { slug?: string },
): Promise<PopulationContent | null> {
  try {
    const url = new URL(`${API_BASE_URL}/api/impact/population`);
    if (options?.slug) url.searchParams.set('slug', options.slug);
    console.log('[client][population] PUT', { url: url.toString(), keys: Object.keys(data || {}) });
    const response = await fetch(url.toString(), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      console.warn('[client][population] PUT failed', { status: response.status });
      return null;
    }
    const payload = (await response.json()) as HeroApiResponse<PopulationContent>;
    console.log('[client][population] PUT success', { fields: Object.keys(payload?.data || {}) });
    return payload?.data ?? null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[ImpactReport] Failed to save population content', error);
    return null;
  }
}

// =========================
// Programs API functions
// =========================
export async function fetchProgramsContent(): Promise<ProgramsContent | null> {
  try {
    const url = `${API_BASE_URL}/api/impact/programs`;
    console.log('[client][programs] GET', { url });
    const response = await fetch(url, {
      credentials: 'include',
    });
    if (!response.ok) {
      console.warn('[client][programs] GET failed', { status: response.status });
      return null;
    }
    const payload = (await response.json()) as HeroApiResponse<ProgramsContent>;
    console.log('[client][programs] GET success', { fields: Object.keys(payload?.data || {}) });
    return payload?.data ?? null;
  } catch (error) {
    console.error('[ImpactReport] Failed to fetch programs content', error);
    return null;
  }
}

export async function saveProgramsContent(
  data: Record<string, unknown>,
  options?: { slug?: string },
): Promise<ProgramsContent | null> {
  try {
    const url = new URL(`${API_BASE_URL}/api/impact/programs`);
    if (options?.slug) url.searchParams.set('slug', options.slug);
    console.log('[client][programs] PUT', { url: url.toString(), keys: Object.keys(data || {}) });
    const response = await fetch(url.toString(), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      console.warn('[client][programs] PUT failed', { status: response.status });
      return null;
    }
    const payload = (await response.json()) as HeroApiResponse<ProgramsContent>;
    console.log('[client][programs] PUT success', { fields: Object.keys(payload?.data || {}) });
    return payload?.data ?? null;
  } catch (error) {
    console.error('[ImpactReport] Failed to save programs content', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Cannot connect to backend server at ${API_BASE_URL}. Please make sure the server is running.`);
    }
    return null;
  }
}

// =========================
// Impact API functions
// =========================
export async function fetchImpactContent(): Promise<ImpactContent | null> {
  try {
    const url = `${API_BASE_URL}/api/impact/impact`;
    console.log('[client][impact] GET', { url });
    const response = await fetch(url, {
      credentials: 'include',
    });
    if (!response.ok) {
      console.warn('[client][impact] GET failed', { status: response.status });
      return null;
    }
    const payload = (await response.json()) as HeroApiResponse<ImpactContent>;
    console.log('[client][impact] GET success', { fields: Object.keys(payload?.data || {}) });
    return payload?.data ?? null;
  } catch (error) {
    console.error('[ImpactReport] Failed to fetch impact content', error);
    return null;
  }
}

export async function saveImpactContent(
  data: Record<string, unknown>,
  options?: { slug?: string },
): Promise<ImpactContent | null> {
  try {
    const url = new URL(`${API_BASE_URL}/api/impact/impact`);
    if (options?.slug) url.searchParams.set('slug', options.slug);
    console.log('[client][impact] PUT', { url: url.toString(), keys: Object.keys(data || {}) });
    const response = await fetch(url.toString(), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      console.warn('[client][impact] PUT failed', { status: response.status });
      return null;
    }
    const payload = (await response.json()) as HeroApiResponse<ImpactContent>;
    console.log('[client][impact] PUT success', { fields: Object.keys(payload?.data || {}) });
    return payload?.data ?? null;
  } catch (error) {
    console.error('[ImpactReport] Failed to save impact content', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Cannot connect to backend server at ${API_BASE_URL}. Please make sure the server is running.`);
    }
    return null;
  }
}

// =========================
// Locations API functions
// =========================
export async function fetchLocationsContent(): Promise<LocationsContent | null> {
  try {
    const url = `${API_BASE_URL}/api/impact/locations`;
    console.log('[client][locations] GET', { url });
    const response = await fetch(url, {
      credentials: 'include',
    });
    if (!response.ok) {
      console.warn('[client][locations] GET failed', { status: response.status });
      return null;
    }
    const payload = (await response.json()) as HeroApiResponse<LocationsContent>;
    console.log('[client][locations] GET success', { fields: Object.keys(payload?.data || {}) });
    return payload?.data ?? null;
  } catch (error) {
    console.error('[ImpactReport] Failed to fetch locations content', error);
    return null;
  }
}

export async function saveLocationsContent(
  data: Record<string, unknown>,
  options?: { slug?: string },
): Promise<LocationsContent | null> {
  try {
    const url = new URL(`${API_BASE_URL}/api/impact/locations`);
    if (options?.slug) url.searchParams.set('slug', options.slug);
    console.log('[client][locations] PUT', { url: url.toString(), keys: Object.keys(data || {}) });
    const response = await fetch(url.toString(), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      console.warn('[client][locations] PUT failed', { status: response.status });
      return null;
    }
    const payload = (await response.json()) as HeroApiResponse<LocationsContent>;
    console.log('[client][locations] PUT success', { fields: Object.keys(payload?.data || {}) });
    return payload?.data ?? null;
  } catch (error) {
    console.error('[ImpactReport] Failed to save locations content', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Cannot connect to backend server at ${API_BASE_URL}. Please make sure the server is running.`);
    }
    return null;
  }
}

// =========================
// Testimonials API functions
// =========================
export async function fetchTestimonialsContent(): Promise<TestimonialsContent | null> {
  try {
    const url = `${API_BASE_URL}/api/impact/testimonials`;
    console.log('[client][testimonials] GET', { url });
    const response = await fetch(url, {
      credentials: 'include',
    });
    if (!response.ok) {
      console.warn('[client][testimonials] GET failed', { status: response.status });
      return null;
    }
    const payload = (await response.json()) as HeroApiResponse<TestimonialsContent>;
    console.log('[client][testimonials] GET success', { fields: Object.keys(payload?.data || {}) });
    return payload?.data ?? null;
  } catch (error) {
    console.error('[ImpactReport] Failed to fetch testimonials content', error);
    return null;
  }
}

export async function saveTestimonialsContent(
  data: Record<string, unknown>,
  options?: { slug?: string },
): Promise<TestimonialsContent | null> {
  try {
    const url = new URL(`${API_BASE_URL}/api/impact/testimonials`);
    if (options?.slug) url.searchParams.set('slug', options.slug);
    console.log('[client][testimonials] PUT', { url: url.toString(), keys: Object.keys(data || {}) });
    const response = await fetch(url.toString(), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      console.warn('[client][testimonials] PUT failed', { status: response.status });
      return null;
    }
    const payload = (await response.json()) as HeroApiResponse<TestimonialsContent>;
    console.log('[client][testimonials] PUT success', { fields: Object.keys(payload?.data || {}) });
    return payload?.data ?? null;
  } catch (error) {
    console.error('[ImpactReport] Failed to save testimonials content', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Cannot connect to backend server at ${API_BASE_URL}. Please make sure the server is running.`);
    }
    return null;
  }
}

// =========================
// Partners API functions
// =========================
export async function fetchPartnersContent(): Promise<PartnersContent | null> {
  try {
    const url = `${API_BASE_URL}/api/impact/partners`;
    console.log('[client][partners] GET', { url });
    const response = await fetch(url, {
      credentials: 'include',
    });
    if (!response.ok) {
      console.warn('[client][partners] GET failed', { status: response.status });
      return null;
    }
    const payload = (await response.json()) as HeroApiResponse<PartnersContent>;
    console.log('[client][partners] GET success', { fields: Object.keys(payload?.data || {}) });
    return payload?.data ?? null;
  } catch (error) {
    console.error('[ImpactReport] Failed to fetch partners content', error);
    return null;
  }
}

export async function savePartnersContent(
  data: Record<string, unknown>,
  options?: { slug?: string },
): Promise<PartnersContent | null> {
  try {
    const url = new URL(`${API_BASE_URL}/api/impact/partners`);
    if (options?.slug) url.searchParams.set('slug', options.slug);
    console.log('[client][partners] PUT', { url: url.toString(), keys: Object.keys(data || {}) });
    const response = await fetch(url.toString(), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      console.warn('[client][partners] PUT failed', { status: response.status });
      return null;
    }
    const payload = (await response.json()) as HeroApiResponse<PartnersContent>;
    console.log('[client][partners] PUT success', { fields: Object.keys(payload?.data || {}) });
    return payload?.data ?? null;
  } catch (error) {
    console.error('[ImpactReport] Failed to save partners content', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Cannot connect to backend server at ${API_BASE_URL}. Please make sure the server is running.`);
    }
    return null;
  }
}

