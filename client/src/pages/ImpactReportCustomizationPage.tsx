import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  Box,
  Divider,
  IconButton,
  Tabs,
  Tab,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";
import { v4 as uuidv4 } from "uuid";
import ScreenGrid from "../components/ScreenGrid.tsx";
import COLORS from "../../assets/colors.ts";
import styled from "styled-components";
import HeroSection from "../components/HeroSection.tsx";
import { signUpload } from "../services/upload.api.ts";
import { saveMedia } from "../services/media.api.ts";
import { fetchHeroContent, saveHeroContent } from "../services/impact.api.ts";
import "../../assets/fonts/fonts.css";
import { useSnackbar } from "notistack";
import ColorPickerPopover from "../components/ColorPickerPopover";

const MemoHeroSection = React.memo(HeroSection);

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

function parseGradient(input: string | null | undefined): {
  degree: number;
  color1: string;
  color2: string;
} {
  const fallback = { degree: 180, color1: "#5038a0", color2: "#121242" };
  if (!input) return fallback;
  // Expect strings we compose like: linear-gradient(180deg, <c1> 0%, <c2> 100%)
  const m = input.match(
    /linear-gradient\(\s*(\d+)\s*deg\s*,\s*(.+?)\s+0%\s*,\s*(.+?)\s+100%\s*\)/i,
  );
  if (!m) return fallback;
  const degree = Math.max(1, Math.min(360, Number(m[1]) || 180));
  const color1 = m[2].trim();
  const color2 = m[3].trim();
  if (
    !color1 ||
    !color2 ||
    /undefined/i.test(color1) ||
    /undefined/i.test(color2)
  ) {
    return fallback;
  }
  return { degree, color1, color2 };
}

function withAlpha(color: string, alpha: number): string {
  const clamp = (v: number, min = 0, max = 1) =>
    Math.max(min, Math.min(max, v));
  const a = clamp(alpha);
  const hex = color.trim();
  if (hex.startsWith("#")) {
    const raw = hex.slice(1);
    const expand = (s: string) =>
      s.length === 3
        ? s
            .split("")
            .map((c) => c + c)
            .join("")
        : s;
    const full = expand(raw);
    const r = parseInt(full.slice(0, 2), 16);
    const g = parseInt(full.slice(2, 4), 16);
    const b = parseInt(full.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  if (hex.startsWith("rgb(")) {
    const nums = hex
      .replace(/rgb\(/i, "")
      .replace(/\)/, "")
      .split(",")
      .map((s) => s.trim());
    const [r, g, b] = nums;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  if (hex.startsWith("rgba(")) {
    const nums = hex
      .replace(/rgba\(/i, "")
      .replace(/\)/, "")
      .split(",")
      .map((s) => s.trim());
    const [r, g, b] = nums;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  return color; // fallback – leave as-is
}

function composeGradient(
  degree: number,
  color1: string,
  color2: string,
  alpha: number,
): string {
  const c1 = withAlpha(color1, alpha);
  const c2 = withAlpha(color2, alpha);
  return `linear-gradient(${degree}deg, ${c1} 0%, ${c2} 100%)`;
}

function isValidColorStop(color: string | null | undefined): boolean {
  if (!color) return false;
  if (/undefined/i.test(color)) return false;
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
  const rgb = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i;
  const rgba =
    /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0|1|0?\.\d+)\s*\)$/i;
  return hex.test(color) || rgb.test(color) || rgba.test(color);
}

// Convert any supported color string (hex/rgb/rgba) to 6-digit hex for <input type="color">
function toHex(color: string): string {
  const c = color.trim();
  const hex3or6 = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
  const rgb = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i;
  const rgba =
    /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0|1|0?\.\d+)\s*\)$/i;

  if (hex3or6.test(c)) {
    if (c.length === 4) {
      // Expand #rgb -> #rrggbb
      const r = c[1];
      const g = c[2];
      const b = c[3];
      return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
    }
    return c.toLowerCase();
  }

  const mRgb = c.match(rgb);
  if (mRgb) {
    const r = Math.max(0, Math.min(255, parseInt(mRgb[1], 10)));
    const g = Math.max(0, Math.min(255, parseInt(mRgb[2], 10)));
    const b = Math.max(0, Math.min(255, parseInt(mRgb[3], 10)));
    const to2 = (n: number) => n.toString(16).padStart(2, "0");
    return `#${to2(r)}${to2(g)}${to2(b)}`.toLowerCase();
  }

  const mRgba = c.match(rgba);
  if (mRgba) {
    const r = Math.max(0, Math.min(255, parseInt(mRgba[1], 10)));
    const g = Math.max(0, Math.min(255, parseInt(mRgba[2], 10)));
    const b = Math.max(0, Math.min(255, parseInt(mRgba[3], 10)));
    const to2 = (n: number) => n.toString(16).padStart(2, "0");
    return `#${to2(r)}${to2(g)}${to2(b)}`.toLowerCase();
  }

  // Fallback
  return "#000000";
}

// Styled components for dark theme
const CustomPaper = styled(Paper)`
  && {
    background-color: #151821; /* increase specificity to beat MuiPaper background */
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
    font-family: "Century Gothic", "Arial", sans-serif;
  }
`;

const CustomTextField = styled(TextField)`
  & .MuiOutlinedInput-root {
    color: white;
    & fieldset {
      border-color: rgba(255, 255, 255, 0.3);
    }
    &:hover fieldset {
      border-color: rgba(255, 255, 255, 0.5);
    }
    &.Mui-focused fieldset {
      border-color: ${COLORS.gogo_blue};
    }
  }
  & .MuiInputLabel-root {
    color: rgba(255, 255, 255, 0.7);
    &.Mui-focused {
      color: ${COLORS.gogo_blue};
    }
  }
`;

// Force preview hero to be shorter (20% less height than default 85vh)
const PreviewFrame = styled.div`
  & section {
    min-height: 68vh !important; /* 80% of 85vh */
  }
`;

// Simple circular degree picker
function DegreePicker({
  value,
  onChange,
  size = 120,
}: {
  value: number;
  onChange: (deg: number) => void;
  size?: number;
}) {
  const [dragging, setDragging] = useState(false);

  const handlePointer = (clientX: number, clientY: number, rect: DOMRect) => {
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const x = clientX - cx;
    const y = clientY - cy;
    // Photoshop-like: 0deg at top, clockwise
    const rad = Math.atan2(y, x);
    let deg = Math.round(((rad * 180) / Math.PI + 90 + 360) % 360);
    deg = Math.max(1, Math.min(360, deg));
    onChange(deg);
  };

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    setDragging(true);
    handlePointer(e.clientX, e.clientY, rect);
  };
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    handlePointer(e.clientX, e.clientY, rect);
  };
  const onMouseUp = () => setDragging(false);
  const onMouseLeave = () => setDragging(false);

  const radius = size / 2;
  const angleRad = ((value - 90) * Math.PI) / 180;
  const indicatorX = radius + (radius - 10) * Math.cos(angleRad);
  const indicatorY = radius + (radius - 10) * Math.sin(angleRad);

  return (
    <div
      role="slider"
      aria-valuenow={value}
      aria-label="Gradient angle"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      style={{
        width: size,
        height: size,
        position: "relative",
        cursor: "pointer",
      }}
    >
      <svg width={size} height={size} style={{ display: "block" }}>
        <circle
          cx={radius}
          cy={radius}
          r={radius - 1}
          fill="#0f1118"
          stroke="rgba(255,255,255,0.2)"
        />
        {/* Crosshairs */}
        <line
          x1={radius}
          y1={8}
          x2={radius}
          y2={size - 8}
          stroke="rgba(255,255,255,0.1)"
        />
        <line
          x1={8}
          y1={radius}
          x2={size - 8}
          y2={radius}
          stroke="rgba(255,255,255,0.1)"
        />
        {/* Indicator */}
        <line
          x1={radius}
          y1={radius}
          x2={indicatorX}
          y2={indicatorY}
          stroke={COLORS.gogo_blue}
          strokeWidth={2}
        />
        <circle cx={indicatorX} cy={indicatorY} r={6} fill={COLORS.gogo_blue} />
      </svg>
    </div>
  );
}

// Impact Report Section Types
interface HeroSection {
  title: string;
  subtitle: string;
  year: string;
  tagline: string;
  titleColor?: string;
  subtitleColor?: string;
  yearColor?: string;
  taglineColor?: string;
  primaryCtaColor?: string;
  secondaryCtaColor?: string;
  bubblesCsv: string;
  degree: number;
  color1: string;
  color2: string;
  gradientOpacity: number;
  backgroundImageUrl: string | null;
  backgroundImagePreview: string | null;
  backgroundImageFile?: File | null;
  ariaLabel: string;
  backgroundGrayscale: boolean;
  // CTA editing fields
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  enabled: boolean;
}

interface MissionSection {
  title: string;
  content: string;
  image: File | null;
  imagePreview: string | null;
  enabled: boolean;
}

interface ImpactSection {
  title: string;
  stats: Array<{
    id: string;
    number: string;
    label: string;
  }>;
  enabled: boolean;
}

interface ProgramsSection {
  title: string;
  programs: Array<{
    id: string;
    name: string;
    description: string;
    image: File | null;
    imagePreview: string | null;
  }>;
  enabled: boolean;
}

interface LocationsSection {
  title: string;
  locations: Array<{
    id: string;
    name: string;
    address: string;
    coordinates: { lat: number; lng: number };
  }>;
  enabled: boolean;
}

interface TestimonialSection {
  title: string;
  testimonials: Array<{
    id: string;
    name: string;
    role: string;
    content: string;
    image: File | null;
    imagePreview: string | null;
  }>;
  enabled: boolean;
}

interface ImpactReportForm {
  hero: HeroSection;
  mission: MissionSection;
  impact: ImpactSection;
  programs: ProgramsSection;
  locations: LocationsSection;
  testimonials: TestimonialSection;
}

/**
 * A page for customizing the entire impact report
 */
function ImpactReportCustomizationPage() {
  const { enqueueSnackbar } = useSnackbar();
  // Current tab state
  const [currentTab, setCurrentTab] = useState(0);

  // Impact report form state with default values
  const [impactReportForm, setImpactReportForm] = useState<ImpactReportForm>({
    hero: {
      title: "",
      subtitle: "",
      year: "",
      tagline: "",
      bubblesCsv: "",
      degree: 180,
      color1: "#000000",
      color2: "#000000",
      gradientOpacity: 0,
      backgroundImageUrl: null,
      backgroundImagePreview: null,
      backgroundImageFile: null,
      ariaLabel: "",
      backgroundGrayscale: false,
      primaryCtaLabel: "Watch Our Story",
      primaryCtaHref: "https://youtu.be/21ufVKC5TEo?si=3N7xugwbc3Z4RNm-",
      secondaryCtaLabel: "Support Our Mission",
      secondaryCtaHref:
        "https://www.classy.org/give/352794/#!/donation/checkout",
      enabled: true,
    },
    mission: {
      title: "Our Mission",
      content:
        "Guitars Over Guns is a 501(c)(3) organization that connects youth with professional musician mentors to help them overcome hardship, find their voice and reach their potential through music, art and mentorship.",
      image: null,
      imagePreview: null,
      enabled: true,
    },
    impact: {
      title: "Our Impact",
      stats: [
        { id: "1", number: "500+", label: "Students Served" },
        { id: "2", number: "15", label: "Years of Service" },
        { id: "3", number: "95%", label: "Graduation Rate" },
        { id: "4", number: "4", label: "Cities" },
      ],
      enabled: true,
    },
    programs: {
      title: "Our Programs",
      programs: [
        {
          id: "1",
          name: "Music Mentorship",
          description: "One-on-one mentorship with professional musicians",
          image: null,
          imagePreview: null,
        },
        {
          id: "2",
          name: "Group Sessions",
          description: "Collaborative learning in small groups",
          image: null,
          imagePreview: null,
        },
      ],
      enabled: true,
    },
    locations: {
      title: "Our Locations",
      locations: [
        {
          id: "1",
          name: "Miami",
          address: "Miami, FL",
          coordinates: { lat: 25.7617, lng: -80.1918 },
        },
        {
          id: "2",
          name: "Chicago",
          address: "Chicago, IL",
          coordinates: { lat: 41.8781, lng: -87.6298 },
        },
      ],
      enabled: true,
    },
    testimonials: {
      title: "What Our Students Say",
      testimonials: [
        {
          id: "1",
          name: "Maria Rodriguez",
          role: "Student, Miami",
          content:
            "Guitars Over Guns changed my life. I found my voice through music.",
          image: null,
          imagePreview: null,
        },
      ],
      enabled: true,
    },
  });

  // Error states
  const [errors, setErrors] = useState<{
    general: string;
  }>({
    general: "",
  });

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [heroUploadPct, setHeroUploadPct] = useState<number | null>(null);
  const [flashPreviewHero, setFlashPreviewHero] = useState(false);
  const [savedSnapshot, setSavedSnapshot] = useState<ImpactReportForm | null>(
    null,
  );
  const [lastDeletedStat, setLastDeletedStat] = useState<{
    index: number;
    item: { id: string; number: string; label: string };
  } | null>(null);
  const [lastDeletedProgram, setLastDeletedProgram] = useState<{
    index: number;
    item: {
      id: string;
      name: string;
      description: string;
      image: File | null;
      imagePreview: string | null;
    };
  } | null>(null);
  const [lastDeletedTestimonial, setLastDeletedTestimonial] = useState<{
    index: number;
    item: {
      id: string;
      name: string;
      role: string;
      content: string;
      image: File | null;
      imagePreview: string | null;
    };
  } | null>(null);
  const [isMobilePreview, setIsMobilePreview] = useState(false);
  const [colorPickerAnchor, setColorPickerAnchor] =
    useState<HTMLElement | null>(null);
  const [colorPickerField, setColorPickerField] = useState<
    | "color1"
    | "color2"
    | "titleColor"
    | "subtitleColor"
    | "yearColor"
    | "taglineColor"
    | "primaryCtaColor"
    | "secondaryCtaColor"
    | null
  >(null);
  const openColorPicker = Boolean(colorPickerAnchor);
  const currentPickerColor = colorPickerField
    ? colorPickerField === "color1"
      ? impactReportForm.hero.color1
      : colorPickerField === "color2"
        ? impactReportForm.hero.color2
        : colorPickerField === "titleColor"
          ? impactReportForm.hero.titleColor || "#ffffff"
          : colorPickerField === "subtitleColor"
            ? impactReportForm.hero.subtitleColor || "#77ddab"
            : colorPickerColorMap(colorPickerField)
    : "#000000";

  function colorPickerColorMap(
    field: NonNullable<typeof colorPickerField>,
  ): string {
    switch (field) {
      case "yearColor":
        return impactReportForm.hero.yearColor || "#e9bb4d";
      case "taglineColor":
        return impactReportForm.hero.taglineColor || COLORS.gogo_green;
      case "primaryCtaColor":
        return impactReportForm.hero.primaryCtaColor || "#ffffff";
      case "secondaryCtaColor":
        return impactReportForm.hero.secondaryCtaColor || "#ffffff";
      default:
        return "#000000";
    }
  }
  // EyeDropper and swatches are implemented inside ColorPickerPopover

  // Refs for file inputs
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Generic image upload handler (currently used for mission image)
  const handleImageUpload = (
    section: string,
    field: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const isHeicLike =
      /heic|heif/i.test(file.type) || /\.(heic|heif)$/i.test(file.name);
    if (!allowedTypes.includes(file.type)) {
      const message = isHeicLike
        ? "HEIC images are not widely supported in browsers. Please upload a JPG or PNG instead."
        : "Unsupported image format. Please upload a JPG, PNG, or WebP image.";
      setErrors((prev) => ({ ...prev, general: message }));
      enqueueSnackbar(message, { variant: "warning" });
      return;
    }
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      if (section === "mission" && field === "image") {
        setImpactReportForm((prev) => ({
          ...prev,
          mission: {
            ...prev.mission,
            image: file,
            imagePreview: (readerEvent.target?.result as string) || null,
          },
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle section changes
  const handleSectionChange = (
    section: keyof ImpactReportForm,
    field: string,
    value: any,
  ) => {
    setImpactReportForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
    setIsDirty(true);
    if (section === "hero") {
      setFlashPreviewHero(true);
      window.setTimeout(() => setFlashPreviewHero(false), 800);
    }
  };

  // Handle hero background image selection (validate + local preview only)
  const handleHeroBackgroundUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    // Validate file type: allow common web-friendly formats only
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const isHeicLike =
      /heic|heif/i.test(file.type) || /\.(heic|heif)$/i.test(file.name);
    if (!allowedTypes.includes(file.type)) {
      const message = isHeicLike
        ? "HEIC images are not widely supported in browsers. Please upload a JPG or PNG instead."
        : "Unsupported image format. Please upload a JPG, PNG, or WebP image.";
      setErrors((prev) => ({ ...prev, general: message }));
      enqueueSnackbar(message, { variant: "warning" });
      return;
    }
    // Local preview only; upload deferred until Save
    const preview = URL.createObjectURL(file);
    setImpactReportForm((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        backgroundImagePreview: preview,
        backgroundImageFile: file,
      },
    }));
    setIsDirty(true);
    setErrors((prev) => ({ ...prev, general: "" }));
  };

  // Video/overlay support removed

  // Handle stat changes
  const handleStatChange = (
    statIndex: number,
    field: string,
    value: string,
  ) => {
    const updatedStats = [...impactReportForm.impact.stats];
    updatedStats[statIndex] = {
      ...updatedStats[statIndex],
      [field]: value,
    };
    handleSectionChange("impact", "stats", updatedStats);
  };

  // Add stat
  const handleAddStat = () => {
    const newStat = {
      id: uuidv4(),
      number: "",
      label: "",
    };
    handleSectionChange("impact", "stats", [
      ...impactReportForm.impact.stats,
      newStat,
    ]);
  };

  // Remove stat
  const handleRemoveStat = (index: number) => {
    const removed = impactReportForm.impact.stats[index];
    const updatedStats = impactReportForm.impact.stats.filter(
      (_, i) => i !== index,
    );
    handleSectionChange("impact", "stats", updatedStats);
    setLastDeletedStat({ index, item: removed });
    enqueueSnackbar("Statistic deleted", {
      variant: "info",
      action: (
        <Button
          color="inherit"
          size="small"
          onClick={() => {
            setImpactReportForm((prev) => {
              const stats = [...prev.impact.stats];
              stats.splice(index, 0, removed);
              return { ...prev, impact: { ...prev.impact, stats } };
            });
            setLastDeletedStat(null);
          }}
        >
          Undo
        </Button>
      ),
    });
  };

  // Handle program changes
  const handleProgramChange = (
    programIndex: number,
    field: string,
    value: any,
  ) => {
    const updatedPrograms = [...impactReportForm.programs.programs];
    updatedPrograms[programIndex] = {
      ...updatedPrograms[programIndex],
      [field]: value,
    };
    handleSectionChange("programs", "programs", updatedPrograms);
  };

  // Add program
  const handleAddProgram = () => {
    const newProgram = {
      id: uuidv4(),
      name: "",
      description: "",
      image: null,
      imagePreview: null,
    };
    handleSectionChange("programs", "programs", [
      ...impactReportForm.programs.programs,
      newProgram,
    ]);
  };

  // Remove program
  const handleRemoveProgram = (index: number) => {
    const removed = impactReportForm.programs.programs[index];
    const updatedPrograms = impactReportForm.programs.programs.filter(
      (_, i) => i !== index,
    );
    handleSectionChange("programs", "programs", updatedPrograms);
    setLastDeletedProgram({ index, item: removed });
    enqueueSnackbar("Program deleted", {
      variant: "info",
      action: (
        <Button
          color="inherit"
          size="small"
          onClick={() => {
            setImpactReportForm((prev) => {
              const programs = [...prev.programs.programs];
              programs.splice(index, 0, removed);
              return { ...prev, programs: { ...prev.programs, programs } };
            });
            setLastDeletedProgram(null);
          }}
        >
          Undo
        </Button>
      ),
    });
  };

  // Handle testimonial changes
  const handleTestimonialChange = (
    testimonialIndex: number,
    field: string,
    value: any,
  ) => {
    const updatedTestimonials = [...impactReportForm.testimonials.testimonials];
    updatedTestimonials[testimonialIndex] = {
      ...updatedTestimonials[testimonialIndex],
      [field]: value,
    };
    handleSectionChange("testimonials", "testimonials", updatedTestimonials);
  };

  // Add testimonial
  const handleAddTestimonial = () => {
    const newTestimonial = {
      id: uuidv4(),
      name: "",
      role: "",
      content: "",
      image: null,
      imagePreview: null,
    };
    handleSectionChange("testimonials", "testimonials", [
      ...impactReportForm.testimonials.testimonials,
      newTestimonial,
    ]);
  };

  // Remove testimonial
  const handleRemoveTestimonial = (index: number) => {
    const removed = impactReportForm.testimonials.testimonials[index];
    const updatedTestimonials =
      impactReportForm.testimonials.testimonials.filter((_, i) => i !== index);
    handleSectionChange("testimonials", "testimonials", updatedTestimonials);
    setLastDeletedTestimonial({ index, item: removed });
    enqueueSnackbar("Testimonial deleted", {
      variant: "info",
      action: (
        <Button
          color="inherit"
          size="small"
          onClick={() => {
            setImpactReportForm((prev) => {
              const testimonials = [...prev.testimonials.testimonials];
              testimonials.splice(index, 0, removed);
              return {
                ...prev,
                testimonials: { ...prev.testimonials, testimonials },
              };
            });
            setLastDeletedTestimonial(null);
          }}
        >
          Undo
        </Button>
      ),
    });
  };

  // Prefill from backend
  useEffect(() => {
    (async () => {
      const hero = await fetchHeroContent();
      if (!hero) return;
      const g = parseGradient(hero.backgroundColor as string | null);
      const alphaMatch = (hero.backgroundColor as string | "").match(
        /rgba\([^,]+,[^,]+,[^,]+,\s*(\d*\.?\d+)\)/i,
      );
      const parsedAlpha = alphaMatch
        ? Math.max(0, Math.min(1, parseFloat(alphaMatch[1] || "1")))
        : undefined;
      setImpactReportForm((prev) => {
        const next: ImpactReportForm = {
          ...prev,
          hero: {
            ...prev.hero,
            title: hero.title ?? prev.hero.title,
            subtitle: hero.subtitle ?? prev.hero.subtitle,
            year: hero.year ?? prev.hero.year,
            tagline: hero.tagline ?? prev.hero.tagline,
            titleColor: (hero as any)?.titleColor ?? prev.hero.titleColor,
            subtitleColor:
              (hero as any)?.subtitleColor ?? prev.hero.subtitleColor,
            yearColor: (hero as any)?.yearColor ?? prev.hero.yearColor,
            taglineColor: (hero as any)?.taglineColor ?? prev.hero.taglineColor,
            primaryCtaColor:
              (hero as any)?.primaryCtaColor ?? prev.hero.primaryCtaColor,
            secondaryCtaColor:
              (hero as any)?.secondaryCtaColor ?? prev.hero.secondaryCtaColor,
            bubblesCsv: Array.isArray(hero.bubbles)
              ? hero.bubbles.join(", ")
              : prev.hero.bubblesCsv,
            degree: g.degree,
            color1: toHex(g.color1),
            color2: toHex(g.color2),
            gradientOpacity:
              typeof parsedAlpha === "number"
                ? parsedAlpha
                : prev.hero.gradientOpacity,
            backgroundImageUrl: hero.backgroundImage ?? null,
            backgroundImagePreview: null,
            backgroundGrayscale:
              (hero as any)?.backgroundImageGrayscale === true ? true : false,
            primaryCtaLabel:
              hero.primaryCta?.label ?? prev.hero.primaryCtaLabel,
            primaryCtaHref: hero.primaryCta?.href ?? prev.hero.primaryCtaHref,
            secondaryCtaLabel:
              hero.secondaryCta?.label ?? prev.hero.secondaryCtaLabel,
            secondaryCtaHref:
              hero.secondaryCta?.href ?? prev.hero.secondaryCtaHref,
          },
        };
        setSavedSnapshot(next);
        return next;
      });
    })();
  }, []);

  // Handle form submission
  const handleSave = async () => {
    setIsSubmitting(true);

    try {
      // Save Hero content to backend
      const bubbles = impactReportForm.hero.bubblesCsv
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const safeDegree = Math.max(
        1,
        Math.min(360, Number(impactReportForm.hero.degree) || 180),
      );
      const safeColor1 = isValidColorStop(impactReportForm.hero.color1)
        ? impactReportForm.hero.color1
        : "#5038a0";
      const safeColor2 = isValidColorStop(impactReportForm.hero.color2)
        ? impactReportForm.hero.color2
        : "#121242";
      const safeAlpha = Math.max(
        0,
        Math.min(1, Number(impactReportForm.hero.gradientOpacity) || 0),
      );
      const backgroundColor = composeGradient(
        safeDegree,
        safeColor1,
        safeColor2,
        safeAlpha,
      );

      // Upload background image if a new file is pending
      let backgroundImagePayload =
        impactReportForm.hero.backgroundImageUrl ?? null;
      if (impactReportForm.hero.backgroundImageFile) {
        const file = impactReportForm.hero.backgroundImageFile as File;
        const ext = (file.name.split(".").pop() || "bin").toLowerCase();
        const signed = await signUpload({
          contentType: file.type,
          extension: ext,
          key: `hero/background.${ext}`,
        });
        setHeroUploadPct(0);
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("PUT", signed.uploadUrl);
          if (file.type) xhr.setRequestHeader("Content-Type", file.type);
          xhr.upload.onprogress = (evt) => {
            if (evt.lengthComputable) {
              const pct = Math.round((evt.loaded / evt.total) * 100);
              setHeroUploadPct(pct);
            }
          };
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) resolve();
            else reject(new Error(`Upload failed: ${xhr.status}`));
          };
          xhr.onerror = () => reject(new Error("Network error during upload"));
          xhr.send(file);
        });
        try {
          await saveMedia({
            key: signed.key,
            publicUrl: signed.publicUrl,
            contentType: file.type,
            bytes: file.size,
            tag: "hero-background",
          });
        } catch {
          // non-fatal
        }
        backgroundImagePayload = signed.publicUrl;
        // Reflect new URL and clear pending file in state
        setImpactReportForm((prev) => ({
          ...prev,
          hero: {
            ...prev.hero,
            backgroundImageUrl: signed.publicUrl,
            backgroundImageFile: null,
          },
        }));
        setHeroUploadPct(null);
      }

      const payload = {
        backgroundColor,
        backgroundImage: backgroundImagePayload,
        // image is always full opacity; do not send backgroundOpacity
        backgroundImageGrayscale:
          impactReportForm.hero.backgroundGrayscale || undefined,
        titleColor: impactReportForm.hero.titleColor || undefined,
        subtitleColor: impactReportForm.hero.subtitleColor || undefined,
        yearColor: impactReportForm.hero.yearColor || undefined,
        taglineColor: impactReportForm.hero.taglineColor || undefined,
        title: impactReportForm.hero.title,
        subtitle: impactReportForm.hero.subtitle,
        year: impactReportForm.hero.year,
        tagline: impactReportForm.hero.tagline,
        bubbles,
        ariaLabel: impactReportForm.hero.ariaLabel,
        primaryCta: {
          label: impactReportForm.hero.primaryCtaLabel || undefined,
          href: impactReportForm.hero.primaryCtaHref || undefined,
        },
        secondaryCta: {
          label: impactReportForm.hero.secondaryCtaLabel || undefined,
          href: impactReportForm.hero.secondaryCtaHref || undefined,
        },
        primaryCtaColor: impactReportForm.hero.primaryCtaColor || undefined,
        secondaryCtaColor: impactReportForm.hero.secondaryCtaColor || undefined,
      };
      console.log("[admin][hero] save payload", payload);
      await saveHeroContent(payload);
      enqueueSnackbar("Impact report saved", { variant: "success" });
      setIsDirty(false);
      setLastSavedAt(new Date());
      setSavedSnapshot(
        JSON.parse(JSON.stringify(impactReportForm)) as ImpactReportForm,
      );
    } catch (error) {
      console.error("Error saving impact report:", error);
      setErrors((prev) => ({
        ...prev,
        general: "An error occurred while saving. Please try again.",
      }));
      enqueueSnackbar("Failed to save impact report", { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Discard changes and restore last saved snapshot
  const handleDiscard = () => {
    if (!savedSnapshot) return;
    const restore = JSON.parse(
      JSON.stringify(savedSnapshot),
    ) as ImpactReportForm;
    setImpactReportForm(restore);
    setIsDirty(false);
    enqueueSnackbar("Changes discarded", { variant: "info" });
  };

  // No preview toggle; preview is always visible on the left

  // Tab configuration
  const tabs = [{ label: "Hero Section", value: 0 }];

  // Build and debounce the preview hero override
  const liveHeroOverride = useMemo(
    () => ({
      title: impactReportForm.hero.title,
      subtitle: impactReportForm.hero.subtitle,
      year: impactReportForm.hero.year,
      tagline: impactReportForm.hero.tagline,
      titleColor: impactReportForm.hero.titleColor,
      subtitleColor: impactReportForm.hero.subtitleColor,
      yearColor: impactReportForm.hero.yearColor,
      taglineColor: impactReportForm.hero.taglineColor,
      primaryCta: {
        label: impactReportForm.hero.primaryCtaLabel,
        href: impactReportForm.hero.primaryCtaHref,
      },
      secondaryCta: {
        label: impactReportForm.hero.secondaryCtaLabel,
        href: impactReportForm.hero.secondaryCtaHref,
      },
      primaryCtaColor: impactReportForm.hero.primaryCtaColor,
      secondaryCtaColor: impactReportForm.hero.secondaryCtaColor,
      bubbles: impactReportForm.hero.bubblesCsv
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      backgroundColor: composeGradient(
        impactReportForm.hero.degree,
        impactReportForm.hero.color1,
        impactReportForm.hero.color2,
        impactReportForm.hero.gradientOpacity,
      ),
      backgroundImage:
        impactReportForm.hero.backgroundImagePreview ||
        impactReportForm.hero.backgroundImageUrl ||
        null,
      backgroundImageGrayscale: impactReportForm.hero.backgroundGrayscale,
    }),
    [impactReportForm.hero],
  );

  const debouncedHeroOverride = useDebouncedValue(liveHeroOverride, 300);

  return (
    <ScreenGrid>
      <Grid
        item
        container
        spacing={{ xs: 2, md: 3 }}
        sx={{ width: "100%", px: { xs: 1, sm: 2, md: 3 } }}
      >
        {/* Left column: title + permanent preview */}
        <Grid item xs={12} md={8}>
          <Box
            sx={{ position: { md: "sticky" as const }, top: { md: 24 }, mb: 2 }}
          >
            <Typography
              variant="h2"
              color="white"
              sx={{
                mb: 1,
                textAlign: { xs: "center", md: "left" },
                fontFamily: "'Airwaves', 'Century Gothic', 'Arial', sans-serif",
              }}
            >
              Customize Impact Report
            </Typography>
            <Typography
              variant="subtitle1"
              color="white"
              sx={{
                mb: 2,
                textAlign: { xs: "center", md: "left" },
                maxWidth: 600,
              }}
            >
              Customize all sections of the impact report to match your
              organization's needs
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isMobilePreview}
                    onChange={(e) => setIsMobilePreview(e.target.checked)}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: COLORS.gogo_blue,
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                        { backgroundColor: COLORS.gogo_blue },
                    }}
                  />
                }
                label="Mobile view"
                sx={{ color: "white" }}
              />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CustomPaper
                sx={{
                  p: 0,
                  overflow: "hidden",
                  width: isMobilePreview ? { xs: "100%", md: 380 } : "100%",
                  maxWidth: isMobilePreview ? 440 : "none",
                }}
              >
                <PreviewFrame>
                  <Box
                    sx={{
                      borderRadius: 2,
                      overflow: "hidden",
                      boxShadow: flashPreviewHero
                        ? `0 0 0 3px ${COLORS.gogo_blue}`
                        : "none",
                      transition: "box-shadow 0.3s ease",
                    }}
                  >
                    <MemoHeroSection
                      disableFetch
                      disableAnimations
                      heroOverride={debouncedHeroOverride}
                    />
                  </Box>
                </PreviewFrame>
              </CustomPaper>
            </Box>
          </Box>
        </Grid>

        {/* Right column: header + tabs + forms */}
        <Grid item xs={12} md={4}>
          {/* Sticky group: actions box then tabs box */}
          <Box
            sx={{
              position: "sticky",
              top: 16,
              zIndex: 5,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mb: 2,
            }}
          >
            <CustomPaper sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    flexWrap: "wrap",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                    Editor
                  </Typography>
                  {isDirty ? (
                    <Typography variant="body2" color="warning.main">
                      Unsaved changes
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="rgba(255,255,255,0.7)">
                      {lastSavedAt
                        ? `All changes saved · ${lastSavedAt.toLocaleTimeString()}`
                        : "No recent changes"}
                    </Typography>
                  )}
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Tooltip
                    title={
                      heroUploadPct !== null
                        ? "Please wait for the upload to finish"
                        : ""
                    }
                    disableHoverListener={heroUploadPct === null}
                  >
                    <span>
                      <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                        disabled={isSubmitting || heroUploadPct !== null}
                        sx={{
                          bgcolor: COLORS.gogo_blue,
                          "&:hover": { bgcolor: "#0066cc" },
                        }}
                      >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                      </Button>
                    </span>
                  </Tooltip>
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={handleDiscard}
                    disabled={!isDirty}
                  >
                    Discard Changes
                  </Button>
                </Box>
              </Box>
            </CustomPaper>
            <CustomPaper sx={{ p: 0 }}>
              <Tabs
                value={currentTab}
                onChange={(_, newValue) => {
                  if (isDirty) {
                    enqueueSnackbar(
                      "Save or discard changes before switching tabs",
                      { variant: "info" },
                    );
                    return;
                  }
                  setCurrentTab(newValue);
                }}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  "& .MuiTab-root": {
                    color: "rgba(255,255,255,0.7)",
                    minWidth: { xs: "auto", sm: 120 },
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    "&.Mui-selected": {
                      color: COLORS.gogo_blue,
                    },
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: COLORS.gogo_blue,
                  },
                }}
              >
                {tabs.map((tab) => (
                  <Tab
                    key={tab.value}
                    label={tab.label}
                    value={tab.value}
                    disabled={isDirty}
                  />
                ))}
              </Tabs>
            </CustomPaper>
          </Box>

          {/* Tab content */}
          <CustomPaper
            sx={{
              p: { xs: 2, sm: 3 },
              minHeight: { xs: 400, md: 600 },
              overflow: "auto",
            }}
          >
            {/* Hero Section */}
            {currentTab === 0 && (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily:
                        "'Airwaves', 'Century Gothic', 'Arial', sans-serif",
                    }}
                  >
                    Hero Section
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={impactReportForm.hero.enabled}
                        onChange={(e) =>
                          handleSectionChange(
                            "hero",
                            "enabled",
                            e.target.checked,
                          )
                        }
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: COLORS.gogo_blue,
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                            {
                              backgroundColor: COLORS.gogo_blue,
                            },
                        }}
                      />
                    }
                    label="Enable Section"
                    sx={{ color: "white" }}
                  />
                </Box>
                <Divider sx={{ mb: 3, bgcolor: "rgba(255,255,255,0.1)" }} />

                <Grid container spacing={{ xs: 2, md: 3 }}>
                  {/* Basics */}
                  <Grid item xs={12} md={6}>
                    <CustomTextField
                      label="Hero Title"
                      value={impactReportForm.hero.title}
                      onChange={(e) =>
                        handleSectionChange("hero", "title", e.target.value)
                      }
                      fullWidth
                    />
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={(e) => {
                        setColorPickerField("titleColor");
                        setColorPickerAnchor(e.currentTarget as HTMLElement);
                      }}
                      sx={{
                        mt: 1,
                        borderColor: "rgba(255,255,255,0.3)",
                        color: "rgba(255,255,255,0.9)",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: 16,
                          height: 16,
                          borderRadius: 3,
                          background:
                            impactReportForm.hero.titleColor || "#ffffff",
                          border: "1px solid rgba(255,255,255,0.2)",
                        }}
                      />
                      &nbsp;Text color
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CustomTextField
                      label="Hero Subtitle"
                      value={impactReportForm.hero.subtitle}
                      onChange={(e) =>
                        handleSectionChange("hero", "subtitle", e.target.value)
                      }
                      fullWidth
                    />
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={(e) => {
                        setColorPickerField("subtitleColor");
                        setColorPickerAnchor(e.currentTarget as HTMLElement);
                      }}
                      sx={{
                        mt: 1,
                        borderColor: "rgba(255,255,255,0.3)",
                        color: "rgba(255,255,255,0.9)",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: 16,
                          height: 16,
                          borderRadius: 3,
                          background:
                            impactReportForm.hero.subtitleColor || "#77ddab",
                          border: "1px solid rgba(255,255,255,0.2)",
                        }}
                      />
                      &nbsp;Text color
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <CustomTextField
                      label="Year"
                      value={impactReportForm.hero.year}
                      onChange={(e) =>
                        handleSectionChange("hero", "year", e.target.value)
                      }
                      fullWidth
                    />
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={(e) => {
                        setColorPickerField("yearColor");
                        setColorPickerAnchor(e.currentTarget as HTMLElement);
                      }}
                      sx={{
                        mt: 1,
                        borderColor: "rgba(255,255,255,0.3)",
                        color: "rgba(255,255,255,0.9)",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: 16,
                          height: 16,
                          borderRadius: 3,
                          background:
                            impactReportForm.hero.yearColor || "#e9bb4d",
                          border: "1px solid rgba(255,255,255,0.2)",
                        }}
                      />
                      &nbsp;Text color
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <CustomTextField
                      label="Tagline"
                      value={impactReportForm.hero.tagline}
                      onChange={(e) =>
                        handleSectionChange("hero", "tagline", e.target.value)
                      }
                      fullWidth
                    />
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={(e) => {
                        setColorPickerField("taglineColor");
                        setColorPickerAnchor(e.currentTarget as HTMLElement);
                      }}
                      sx={{
                        mt: 1,
                        borderColor: "rgba(255,255,255,0.3)",
                        color: "rgba(255,255,255,0.9)",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: 16,
                          height: 16,
                          borderRadius: 3,
                          background:
                            impactReportForm.hero.taglineColor ||
                            COLORS.gogo_green,
                          border: "1px solid rgba(255,255,255,0.2)",
                        }}
                      />
                      &nbsp;Text color
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <CustomTextField
                      label="Bubbles (comma separated)"
                      value={impactReportForm.hero.bubblesCsv}
                      onChange={(e) =>
                        handleSectionChange(
                          "hero",
                          "bubblesCsv",
                          e.target.value,
                        )
                      }
                      fullWidth
                    />
                  </Grid>

                  {/* CTAs */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Call To Action Buttons
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CustomTextField
                      label="Primary CTA Label"
                      value={impactReportForm.hero.primaryCtaLabel}
                      onChange={(e) =>
                        handleSectionChange(
                          "hero",
                          "primaryCtaLabel",
                          e.target.value,
                        )
                      }
                      fullWidth
                    />
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={(e) => {
                        setColorPickerField("primaryCtaColor");
                        setColorPickerAnchor(e.currentTarget as HTMLElement);
                      }}
                      sx={{
                        mt: 1,
                        borderColor: "rgba(255,255,255,0.3)",
                        color: "rgba(255,255,255,0.9)",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: 16,
                          height: 16,
                          borderRadius: 3,
                          background:
                            impactReportForm.hero.primaryCtaColor || "#ffffff",
                          border: "1px solid rgba(255,255,255,0.2)",
                        }}
                      />
                      &nbsp;Text color
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CustomTextField
                      label="Primary CTA Link (URL)"
                      value={impactReportForm.hero.primaryCtaHref}
                      onChange={(e) =>
                        handleSectionChange(
                          "hero",
                          "primaryCtaHref",
                          e.target.value,
                        )
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CustomTextField
                      label="Secondary CTA Label"
                      value={impactReportForm.hero.secondaryCtaLabel}
                      onChange={(e) =>
                        handleSectionChange(
                          "hero",
                          "secondaryCtaLabel",
                          e.target.value,
                        )
                      }
                      fullWidth
                    />
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={(e) => {
                        setColorPickerField("secondaryCtaColor");
                        setColorPickerAnchor(e.currentTarget as HTMLElement);
                      }}
                      sx={{
                        mt: 1,
                        borderColor: "rgba(255,255,255,0.3)",
                        color: "rgba(255,255,255,0.9)",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: 16,
                          height: 16,
                          borderRadius: 3,
                          background:
                            impactReportForm.hero.secondaryCtaColor ||
                            "#ffffff",
                          border: "1px solid rgba(255,255,255,0.2)",
                        }}
                      />
                      &nbsp;Text color
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CustomTextField
                      label="Secondary CTA Link (URL)"
                      value={impactReportForm.hero.secondaryCtaHref}
                      onChange={(e) =>
                        handleSectionChange(
                          "hero",
                          "secondaryCtaHref",
                          e.target.value,
                        )
                      }
                      fullWidth
                    />
                  </Grid>

                  {/* Gradient */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Background Gradient
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={4}>
                        <Typography
                          variant="caption"
                          color="rgba(255,255,255,0.7)"
                        >
                          Degree
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Typography variant="body2">
                            {impactReportForm.hero.degree}°
                          </Typography>
                          <DegreePicker
                            value={impactReportForm.hero.degree}
                            onChange={(deg) =>
                              handleSectionChange(
                                "hero",
                                "degree",
                                Math.max(1, Math.min(360, deg || 180)),
                              )
                            }
                            size={140}
                          />
                        </Box>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={4}
                        sx={{
                          ml: { md: 1.5 },
                          mr: { md: -0.5 },
                          display: { md: "flex" },
                          justifyContent: { md: "flex-start" },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                          }}
                        >
                          <Box>
                            <Typography
                              variant="caption"
                              color="rgba(255,255,255,0.7)"
                            >
                              Color 1
                            </Typography>
                            <Button
                              variant="outlined"
                              onClick={(e) => {
                                setColorPickerField("color1");
                                setColorPickerAnchor(
                                  e.currentTarget as HTMLElement,
                                );
                              }}
                              sx={{
                                mt: 0.5,
                                minWidth: 48,
                                px: 1,
                                borderColor: "rgba(255,255,255,0.3)",
                                color: "rgba(255,255,255,0.9)",
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <span
                                style={{
                                  display: "inline-block",
                                  width: 18,
                                  height: 18,
                                  borderRadius: 3,
                                  background: impactReportForm.hero.color1,
                                  border: "1px solid rgba(255,255,255,0.2)",
                                }}
                              />
                              Pick
                            </Button>
                          </Box>
                          <Box>
                            <Typography
                              variant="caption"
                              color="rgba(255,255,255,0.7)"
                            >
                              Color 2
                            </Typography>
                            <Button
                              variant="outlined"
                              onClick={(e) => {
                                setColorPickerField("color2");
                                setColorPickerAnchor(
                                  e.currentTarget as HTMLElement,
                                );
                              }}
                              sx={{
                                mt: 0.5,
                                minWidth: 48,
                                px: 1,
                                borderColor: "rgba(255,255,255,0.3)",
                                color: "rgba(255,255,255,0.9)",
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <span
                                style={{
                                  display: "inline-block",
                                  width: 18,
                                  height: 18,
                                  borderRadius: 3,
                                  background: impactReportForm.hero.color2,
                                  border: "1px solid rgba(255,255,255,0.2)",
                                }}
                              />
                              Pick
                            </Button>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4} sx={{ ml: { md: -2 } }}>
                        <Box
                          sx={{
                            width: 140,
                            height: 140,
                            borderRadius: 1,
                            border: "1px solid rgba(255,255,255,0.1)",
                            background: composeGradient(
                              impactReportForm.hero.degree,
                              impactReportForm.hero.color1,
                              impactReportForm.hero.color2,
                              impactReportForm.hero.gradientOpacity,
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <ColorPickerPopover
                    open={openColorPicker}
                    anchorEl={colorPickerAnchor}
                    onClose={() => {
                      setColorPickerAnchor(null);
                      setColorPickerField(null);
                    }}
                    value={currentPickerColor}
                    onChange={(val) => {
                      if (!colorPickerField) return;
                      handleSectionChange("hero", colorPickerField, val);
                    }}
                  />
                  <Grid item xs={12} md={9}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Typography
                        variant="caption"
                        color="rgba(255,255,255,0.7)"
                      >
                        Gradient Opacity
                      </Typography>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={impactReportForm.hero.gradientOpacity}
                        onChange={(e) =>
                          handleSectionChange(
                            "hero",
                            "gradientOpacity",
                            Number(e.target.value),
                          )
                        }
                      />
                      <Typography variant="body2">
                        {impactReportForm.hero.gradientOpacity.toFixed(2)}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Background Image */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Background Image
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        flexWrap: "wrap",
                      }}
                    >
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleHeroBackgroundUpload}
                        style={{ display: "none" }}
                        ref={(el) => (fileInputRefs.current["hero-bg"] = el)}
                      />
                      <Button
                        variant="outlined"
                        startIcon={<CloudUploadIcon />}
                        onClick={() =>
                          fileInputRefs.current["hero-bg"]?.click()
                        }
                        sx={{ minWidth: { xs: "100%", sm: "auto" } }}
                      >
                        Upload Background
                      </Button>
                      <Button
                        variant="text"
                        color="error"
                        startIcon={<ClearIcon />}
                        onClick={() => {
                          setImpactReportForm((prev) => ({
                            ...prev,
                            hero: {
                              ...prev.hero,
                              backgroundImageUrl: null,
                              backgroundImagePreview: null,
                              backgroundImageFile: null,
                            },
                          }));
                          setIsDirty(true);
                          enqueueSnackbar("Background cleared", {
                            variant: "info",
                          });
                        }}
                        disabled={
                          !impactReportForm.hero.backgroundImageUrl &&
                          !impactReportForm.hero.backgroundImagePreview
                        }
                      >
                        Clear Background
                      </Button>
                      {heroUploadPct !== null && (
                        <Box sx={{ flex: 1, minWidth: 180 }}>
                          <LinearProgress
                            variant="determinate"
                            value={heroUploadPct}
                          />
                          <Typography
                            variant="caption"
                            color="rgba(255,255,255,0.7)"
                          >
                            {heroUploadPct}%
                          </Typography>
                        </Box>
                      )}
                      {heroUploadPct === null &&
                        impactReportForm.hero.backgroundImagePreview && (
                          <Box
                            sx={{
                              width: { xs: "100%", sm: 120 },
                              height: { xs: 140, sm: 70 },
                              overflow: "hidden",
                              borderRadius: 1,
                              minWidth: { xs: "auto", sm: 120 },
                            }}
                          >
                            <img
                              src={impactReportForm.hero.backgroundImagePreview}
                              alt="Background preview"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                filter: impactReportForm.hero
                                  .backgroundGrayscale
                                  ? "grayscale(1)"
                                  : undefined,
                              }}
                            />
                          </Box>
                        )}
                      <FormControlLabel
                        control={
                          <Switch
                            checked={impactReportForm.hero.backgroundGrayscale}
                            onChange={(e) =>
                              handleSectionChange(
                                "hero",
                                "backgroundGrayscale",
                                e.target.checked,
                              )
                            }
                            sx={{
                              "& .MuiSwitch-switchBase.Mui-checked": {
                                color: COLORS.gogo_blue,
                              },
                              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                                {
                                  backgroundColor: COLORS.gogo_blue,
                                },
                            }}
                          />
                        }
                        label="Render background image in grayscale (gradient and text stay color)"
                        sx={{ color: "white" }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: "rgba(255,255,255,0.7)",
                          display: "block",
                        }}
                      >
                        Note: The preview frame is approximate. The background
                        image may not align exactly with other elements on the
                        final page.
                      </Typography>
                    </Box>
                  </Grid>
                  {/* Background image is always 100% opacity; no alt field */}

                  {/* Accessibility */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Accessibility
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CustomTextField
                      label="ARIA Label"
                      value={impactReportForm.hero.ariaLabel}
                      onChange={(e) =>
                        handleSectionChange("hero", "ariaLabel", e.target.value)
                      }
                      fullWidth
                    />
                  </Grid>

                  {/* Preview removed from here; now permanently on the left */}
                </Grid>
              </Box>
            )}

            {/* Mission Section removed */}

            {/* Impact Stats Section removed */}

            {/* Programs Section removed */}

            {/* Locations Section removed */}

            {/* Testimonials Section removed */}
          </CustomPaper>
        </Grid>

        {/* General error */}
        {errors.general && (
          <Grid item xs={12}>
            <Typography variant="body2" color="error" align="center">
              {errors.general}
            </Typography>
          </Grid>
        )}
      </Grid>
    </ScreenGrid>
  );
}

export default ImpactReportCustomizationPage;

