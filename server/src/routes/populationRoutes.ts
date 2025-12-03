import { Router } from 'express';
import { findPopulationBySlug, upsertPopulationBySlug } from "../services/populationService.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/impact/population", async (req, res, next) => {
  try {
    const slug = (req.query.slug as string) ?? "impact-report";
    console.log("[population] GET", { slug });
    const population = await findPopulationBySlug(slug);

    if (!population) {
      console.warn("[population] GET not found", { slug });
      return res.status(404).json({ error: "Population content not found" });
    }

    const { _id, slug: storedSlug, ...data } = population;
    console.log("[population] GET success", {
      slug,
      fields: Object.keys(data || {}),
    });
    return res.json({ data });
  } catch (error) {
    return next(error);
  }
});

router.put("/impact/population", requireAuth, async (req, res, next) => {
  try {
    const slug = (req.query.slug as string) ?? "impact-report";
    const data = (req.body ?? {}) as Record<string, unknown>;
    console.log("[population] PUT request", {
      slug,
      incomingKeys: Object.keys(data || {}),
    });

    const allowedKeys = [
      "sectionBadge",
      "sectionBadgeGradient",
      "sectionBadgeGradientStart",
      "sectionBadgeGradientEnd",
      "sectionBadgeGradientDegree",
      "sectionTitle",
      "sectionTitleUnderlineColor",
      "title",
      "titleGradient",
      "titleGradientStart",
      "titleGradientEnd",
      "titleGradientDegree",
      "titleUnderlineColor",
      "blob1ColorA",
      "blob1ColorB",
      "blob2ColorA",
      "blob2ColorB",
      "infoCard1Text",
      "infoCard2Text",
      "demographicsTitle",
      "demographicsData",
      "demographicsCaption",
      "stat1Percent",
      "stat1Text",
      "stat1Color",
      "stat2Percent",
      "stat2Text",
      "stat2Color",
      "cgasTitle",
      "cgasTooltip",
      "cgasStats",
      "skillsTitle",
      "skillsList",
      "containerBgGradient",
      "containerBgGradientStart",
      "containerBgGradientEnd",
      "containerBgGradientDegree",
      "containerOverlayColor1",
      "containerOverlayColor2",
      "infoCardBgColor",
      "bentoCardBgColor",
      "skillChipBgColor",
      "skillChipBorderColor",
      "skillChipTextColor",
      "percentCircleInnerBgColor",
      "populationPhotos",
    ];

    const sanitized: Record<string, unknown> = {};
    for (const key of allowedKeys) {
      if (key in data) sanitized[key] = (data as any)[key];
    }

    console.log("[population] PUT sanitized", {
      slug,
      sanitizedKeys: Object.keys(sanitized),
    });

    const saved = await upsertPopulationBySlug(slug, sanitized as any);
    const { _id, slug: storedSlug, ...response } = saved ?? {};
    console.log("[population] PUT success", {
      slug,
      updatedFields: Object.keys(response || {}),
    });
    return res.json({ data: response });
  } catch (error) {
    return next(error);
  }
});

export default router;


