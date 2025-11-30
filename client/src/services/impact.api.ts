export interface HeroApiResponse<T> {
  data: T;
}

export interface HeroCta {
  label?: string;
  href?: string;
}

export interface HeroContent {
  // Background - Full CSS gradient string
  backgroundGradient?: string;
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
  // CTA button background colors
  primaryCtaBgColor?: string;
  primaryCtaHoverBgColor?: string;
  secondaryCtaBgColor?: string;
  secondaryCtaHoverBgColor?: string;
  // Title underline color
  titleUnderlineColor?: string;
  // Bubble/chip styling
  bubbleTextColor?: string;
  bubbleBgColor?: string;
  bubbleBorderColor?: string;
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
  // Background - Full CSS gradient string
  backgroundGradient?: string | null;
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

  // NEW: Stat card styling
  statCardBgColor?: string | null;
  statCardBorderWidth?: number | null;
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
  sectionBadgeGradient?: string; // Full CSS gradient string
  // Legacy fields (kept for backward compatibility)
  sectionBadgeGradientStart?: string;
  sectionBadgeGradientEnd?: string;
  sectionBadgeGradientDegree?: number;
  sectionTitle?: string;
  sectionTitleUnderlineColor?: string;
  
  // Main Title
  title?: string;
  titleGradient?: string; // Full CSS gradient string
  // Legacy fields (kept for backward compatibility)
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

  // Container background - Full CSS gradient string
  containerBgGradient?: string;
  // Legacy fields (kept for backward compatibility)
  containerBgGradientStart?: string;
  containerBgGradientEnd?: string;
  containerBgGradientDegree?: number;

  // NEW: Container overlay radials
  containerOverlayColor1?: string;
  containerOverlayColor2?: string;

  // NEW: Card backgrounds
  infoCardBgColor?: string;
  bentoCardBgColor?: string;

  // NEW: Skill chip styling
  skillChipBgColor?: string;
  skillChipBorderColor?: string;
  skillChipTextColor?: string;

  // NEW: Percent circle inner background
  percentCircleInnerBgColor?: string;

  // NEW: Population photos (array of image URLs)
  populationPhotos?: string[];
}

// =========================
// Financial content interfaces
// =========================
export interface FinancialPieItem {
  id: string;
  label: string;
  value: number;
  color: string;
}

export interface FinancialContent {
  // Section visibility
  visible?: boolean;
  animationsEnabled?: boolean;

  // Section background
  sectionBgGradient?: string | null;
  decorationColor1?: string | null;
  decorationColor2?: string | null;
  decorationPosition1?: string | null;
  decorationPosition2?: string | null;

  // Header
  title?: string | null;
  titleGradient?: string | null;
  subtitle?: string | null;
  subtitleColor?: string | null;

  // KPI Cards styling
  kpiCardBgGradient?: string | null;
  kpiCardBorderColor?: string | null;
  kpiCardBorderRadius?: number | null;
  kpiValueColor?: string | null;
  kpiLabelColor?: string | null;
  kpiNetPositiveColor?: string | null;
  kpiNetNegativeColor?: string | null;

  // KPI Labels
  kpiRevenueLabel?: string | null;
  kpiExpensesLabel?: string | null;
  kpiNetLabel?: string | null;
  kpiYoyLabel?: string | null;

  // Line chart
  lineChartTitle?: string | null;
  lineChartTitleColor?: string | null;
  lineChartBgColor?: string | null;
  lineChartBorderColor?: string | null;
  revenueLineColor?: string | null;
  expenseLineColor?: string | null;
  revenueLineWidth?: number | null;
  expenseLineWidth?: number | null;
  axisLineColor?: string | null;
  axisLabelColor?: string | null;
  axisLabelFontSize?: number | null;
  tooltipBgColor?: string | null;
  tooltipTextColor?: string | null;
  tooltipBorderColor?: string | null;
  legendRevenueLabel?: string | null;
  legendExpensesLabel?: string | null;
  legendTextColor?: string | null;

  // Financial data
  years?: string[] | null;
  revenueData?: number[] | null;
  expenseData?: number[] | null;
  maxYAxis?: number | null;

  // Pie charts
  pieChartBgColor?: string | null;
  pieChartBorderColor?: string | null;
  pieChartInnerRadius?: number | null;

  // "Where the Money Comes From" pie
  comesFromTitle?: string | null;
  comesFromTitleColor?: string | null;
  comesFromData?: FinancialPieItem[] | null;

  // "Where the Money Goes" pie
  goesToTitle?: string | null;
  goesToTitleColor?: string | null;
  goesToData?: FinancialPieItem[] | null;

  // Breakdown card
  breakdownTitle?: string | null;
  breakdownTitleColor?: string | null;
  breakdownTextColor?: string | null;
  breakdownValueFontWeight?: number | null;

  // Optional note
  showNote?: boolean | null;
  noteText?: string | null;
  noteBgColor?: string | null;
  noteBorderColor?: string | null;
  noteTextColor?: string | null;
}

// =========================
// Method content interfaces
// =========================
export interface MethodItem {
  id: string;
  iconKey: string;
  text: string;
}

export interface MethodContent {
  // Section visibility
  visible?: boolean;
  animationsEnabled?: boolean;

  // Section background
  sectionBgGradient?: string | null;
  glowColor1?: string | null;
  glowColor2?: string | null;

  // Header
  title?: string | null;
  titleGradient?: string | null;
  subtitle?: string | null;
  subtitleColor?: string | null;

  // Method cards
  cardBgColor?: string | null;
  cardBorderColor?: string | null;
  cardTitleColor?: string | null;
  iconGradient?: string | null;
  methodItems?: MethodItem[] | null;

  // Narrative section
  leadText?: string | null;
  leadTextColor?: string | null;
  secondaryText?: string | null;
  secondaryTextColor?: string | null;
  secondaryBorderColor?: string | null;
}

// =========================
// Defaults content interfaces
// =========================
export interface DefaultsContent {
  colorSwatch?: string[] | null;
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
      console.warn('[client][hero] GET failed', { status: response.status });
      return null;
    }

    const payload = (await response.json()) as HeroApiResponse<HeroContent>;
    console.log('[client][hero] GET success', { fields: Object.keys(payload?.data || {}) });
    return payload?.data ?? null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[ImpactReport] Failed to fetch hero content', error);
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
      console.warn('[client][mission] GET failed', { status: response.status });
      return null;
    }
    const payload = (await response.json()) as HeroApiResponse<MissionContent>;
    console.log('[client][mission] GET success', { fields: Object.keys(payload?.data || {}) });
    return payload?.data ?? null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[ImpactReport] Failed to fetch mission content', error);
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

export async function fetchFinancialContent(): Promise<FinancialContent | null> {
  try {
    const url = `${API_BASE_URL}/api/impact/financial`;
    console.log('[client][financial] GET', { url });
    const response = await fetch(url, {
      credentials: 'include',
    });
    if (!response.ok) {
      console.warn('[client][financial] GET failed', { status: response.status });
      return null;
    }
    const payload = (await response.json()) as HeroApiResponse<FinancialContent>;
    console.log('[client][financial] GET success', { fields: Object.keys(payload?.data || {}) });
    return payload?.data ?? null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[ImpactReport] Failed to fetch financial content', error);
    return null;
  }
}

export async function saveFinancialContent(
  data: Record<string, unknown>,
  options?: { slug?: string },
): Promise<FinancialContent | null> {
  try {
    const url = new URL(`${API_BASE_URL}/api/impact/financial`);
    if (options?.slug) url.searchParams.set('slug', options.slug);
    console.log('[client][financial] PUT', { url: url.toString(), keys: Object.keys(data || {}) });
    const response = await fetch(url.toString(), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      console.warn('[client][financial] PUT failed', { status: response.status });
      return null;
    }
    const payload = (await response.json()) as HeroApiResponse<FinancialContent>;
    console.log('[client][financial] PUT success', { fields: Object.keys(payload?.data || {}) });
    return payload?.data ?? null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[ImpactReport] Failed to save financial content', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Cannot connect to backend server at ${API_BASE_URL}. Please make sure the server is running.`);
    }
    return null;
  }
}

// =========================
// Method content API
// =========================
export async function fetchMethodContent(): Promise<MethodContent | null> {
  try {
    const url = `${API_BASE_URL}/api/impact/method`;
    console.log('[client][method] GET', { url });
    const response = await fetch(url, {
      credentials: 'include',
    });
    if (!response.ok) {
      console.warn('[client][method] GET failed', { status: response.status });
      return null;
    }
    const payload = (await response.json()) as HeroApiResponse<MethodContent>;
    console.log('[client][method] GET success', { fields: Object.keys(payload?.data || {}) });
    return payload?.data ?? null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[ImpactReport] Failed to fetch method content', error);
    return null;
  }
}

export async function saveMethodContent(
  data: Record<string, unknown>,
  options?: { slug?: string },
): Promise<MethodContent | null> {
  try {
    const url = new URL(`${API_BASE_URL}/api/impact/method`);
    if (options?.slug) url.searchParams.set('slug', options.slug);
    console.log('[client][method] PUT', { url: url.toString(), keys: Object.keys(data || {}) });
    const response = await fetch(url.toString(), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      console.warn('[client][method] PUT failed', { status: response.status });
      return null;
    }
    const payload = (await response.json()) as HeroApiResponse<MethodContent>;
    console.log('[client][method] PUT success', { fields: Object.keys(payload?.data || {}) });
    return payload?.data ?? null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[ImpactReport] Failed to save method content', error);
    return null;
  }
}

