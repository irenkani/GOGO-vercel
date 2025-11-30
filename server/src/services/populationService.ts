import { getDatabase } from '../config/database.js';

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
  sectionBadge?: string;
  // Full CSS gradient string
  sectionBadgeGradient?: string;
  // Legacy fields (kept for backward compatibility)
  sectionBadgeGradientStart?: string;
  sectionBadgeGradientEnd?: string;
  sectionBadgeGradientDegree?: number;
  sectionTitle?: string;
  sectionTitleUnderlineColor?: string;
  
  title?: string;
  // Full CSS gradient string
  titleGradient?: string;
  // Legacy fields (kept for backward compatibility)
  titleGradientStart?: string;
  titleGradientEnd?: string;
  titleGradientDegree?: number;
  titleUnderlineColor?: string;
  
  blob1ColorA?: string;
  blob1ColorB?: string;
  blob2ColorA?: string;
  blob2ColorB?: string;
  
  infoCard1Text?: string;
  infoCard2Text?: string;
  
  demographicsTitle?: string;
  demographicsData?: DemographicItem[];
  demographicsCaption?: string;
  
  stat1Percent?: number;
  stat1Text?: string;
  stat1Color?: string;
  
  stat2Percent?: number;
  stat2Text?: string;
  stat2Color?: string;
  
  cgasTitle?: string;
  cgasTooltip?: string;
  cgasStats?: PopulationStat[];
  
  skillsTitle?: string;
  skillsList?: string[];

  // Container background - Full CSS gradient string
  containerBgGradient?: string;
  // Legacy fields (kept for backward compatibility)
  containerBgGradientStart?: string;
  containerBgGradientEnd?: string;
  containerBgGradientDegree?: number;

  // Container overlay radials
  containerOverlayColor1?: string;
  containerOverlayColor2?: string;

  // Card backgrounds
  infoCardBgColor?: string;
  bentoCardBgColor?: string;

  // Skill chip styling
  skillChipBgColor?: string;
  skillChipBorderColor?: string;
  skillChipTextColor?: string;

  // Percent circle inner background
  percentCircleInnerBgColor?: string;

  // Population photos (array of image URLs)
  populationPhotos?: string[];
}

export interface PopulationDocument extends PopulationContent {
  _id?: string;
  slug?: string;
  updatedAt?: Date;
}

const POPULATION_COLLECTION = 'population';

export async function findPopulationBySlug(slug = 'impact-report'): Promise<PopulationDocument | null> {
  const db = await getDatabase();
  const collection = db.collection<PopulationDocument>(POPULATION_COLLECTION);
  const doc = await collection.findOne({ slug });
  return doc ?? null;
}

export async function upsertPopulationBySlug(slug: string, data: PopulationContent): Promise<PopulationDocument> {
  const db = await getDatabase();
  const collection = db.collection<PopulationDocument>(POPULATION_COLLECTION);

  const now = new Date();
  const update = {
    $set: {
      ...data,
      slug,
      updatedAt: now,
    },
  };

  await collection.updateOne({ slug }, update, { upsert: true });
  const saved = await collection.findOne({ slug });
  return saved as PopulationDocument;
}


