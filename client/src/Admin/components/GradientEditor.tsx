import React, { useState, useMemo, useEffect } from 'react';
import { Grid, Box, Typography, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import COLORS from '../../../assets/colors';

// Gradient types
export type GradientType = 'linear' | 'radial' | 'conic';

// ─────────────────────────────────────────────────────────────────────────────
// GRADIENT PARSING AND COMPOSITION UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

export interface ParsedGradient {
  type: GradientType;
  degree: number;
  colors: string[];
}

// Parse a CSS gradient string into its components
export function parseGradientString(gradient: string | null | undefined): ParsedGradient {
  // Default values
  const defaultResult: ParsedGradient = {
    type: 'linear',
    degree: 90,
    colors: [COLORS.gogo_blue, COLORS.gogo_purple],
  };

  if (!gradient) return defaultResult;

  let type: GradientType = 'linear';
  let degree = 90;

  // Detect gradient type
  if (gradient.startsWith('radial-gradient')) {
    type = 'radial';
  } else if (gradient.startsWith('conic-gradient')) {
    type = 'conic';
    const conicMatch = gradient.match(/from\s+(\d+)deg/);
    if (conicMatch) degree = parseInt(conicMatch[1], 10);
  } else if (gradient.startsWith('linear-gradient')) {
    type = 'linear';
    // Match degree or direction
    const degMatch = gradient.match(/linear-gradient\s*\(\s*(\d+)deg/);
    const dirMatch = gradient.match(/linear-gradient\s*\(\s*to\s+(right|left|top|bottom)/);
    if (degMatch) {
      degree = parseInt(degMatch[1], 10);
    } else if (dirMatch) {
      const dirMap: Record<string, number> = { right: 90, left: 270, top: 0, bottom: 180 };
      degree = dirMap[dirMatch[1]] ?? 90;
    }
  }

  // Extract colors - match hex, rgb, rgba patterns
  const colorPattern = /(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))/g;
  const matches = gradient.match(colorPattern);
  const colors = matches && matches.length >= 2 ? matches.slice(0, 3) : defaultResult.colors;

  return { type, degree, colors };
}

// Compose a CSS gradient string from components
export function composeGradient(
  type: GradientType,
  degree: number,
  colors: string[],
): string {
  const colorStops = colors.filter(Boolean).join(', ');
  switch (type) {
    case 'radial':
      return `radial-gradient(circle, ${colorStops})`;
    case 'conic':
      return `conic-gradient(from ${degree}deg, ${colorStops})`;
    case 'linear':
    default:
      return `linear-gradient(${degree}deg, ${colorStops})`;
  }
}

// Legacy alias for backward compatibility
export const composeAdvancedGradient = composeGradient;

// ─────────────────────────────────────────────────────────────────────────────
// DEGREE PICKER COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

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
        position: 'relative',
        cursor: 'pointer',
      }}
    >
      <svg width={size} height={size} style={{ display: 'block' }}>
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

// ─────────────────────────────────────────────────────────────────────────────
// UNIFIED GRADIENT EDITOR COMPONENT
// Takes a single gradient string and outputs a single gradient string
// ─────────────────────────────────────────────────────────────────────────────

export interface GradientEditorProps {
  /** Label for the gradient editor */
  label: string;
  /** The current gradient CSS string (e.g., "linear-gradient(90deg, #ff0000, #00ff00)") */
  value: string | null | undefined;
  /** Callback when the gradient changes - receives the full CSS gradient string */
  onChange: (gradient: string) => void;
  /** Callback to open color picker for a specific color index */
  onPickColor: (anchorEl: HTMLElement, colorIndex: number) => void;
  /** Default gradient if value is null/undefined */
  defaultGradient?: string;
}

export function GradientEditor({
  label,
  value,
  onChange,
  onPickColor,
  defaultGradient = `linear-gradient(90deg, ${COLORS.gogo_blue}, ${COLORS.gogo_purple})`,
}: GradientEditorProps) {
  // Parse the gradient string
  const parsed = useMemo(() => parseGradientString(value ?? defaultGradient), [value, defaultGradient]);
  
  // Local state for editing
  const [gradientType, setGradientType] = useState<GradientType>(parsed.type);
  const [degree, setDegree] = useState(parsed.degree);
  const [colors, setColors] = useState<string[]>(parsed.colors);
  const [hasThreeColors, setHasThreeColors] = useState(parsed.colors.length >= 3);

  // Sync local state when value changes externally
  useEffect(() => {
    const newParsed = parseGradientString(value ?? defaultGradient);
    setGradientType(newParsed.type);
    setDegree(newParsed.degree);
    setColors(newParsed.colors);
    setHasThreeColors(newParsed.colors.length >= 3);
  }, [value, defaultGradient]);

  // Emit the composed gradient whenever any component changes
  const emitChange = (
    newType: GradientType = gradientType,
    newDegree: number = degree,
    newColors: string[] = colors,
  ) => {
    const gradient = composeGradient(newType, newDegree, newColors);
    onChange(gradient);
  };

  const handleTypeChange = (newType: GradientType) => {
    setGradientType(newType);
    emitChange(newType, degree, colors);
  };

  const handleDegreeChange = (newDegree: number) => {
    setDegree(newDegree);
    emitChange(gradientType, newDegree, colors);
  };

  const handleColorChange = (index: number, newColor: string) => {
    const newColors = [...colors];
    newColors[index] = newColor;
    setColors(newColors);
    emitChange(gradientType, degree, newColors);
  };

  const handleToggleThreeColors = () => {
    const newHasThree = !hasThreeColors;
    setHasThreeColors(newHasThree);
    
    let newColors: string[];
    if (newHasThree) {
      // Add a third color
      newColors = [...colors.slice(0, 2), COLORS.gogo_purple];
    } else {
      // Remove the third color
      newColors = colors.slice(0, 2);
    }
    setColors(newColors);
    emitChange(gradientType, degree, newColors);
  };

  const previewBackground = composeGradient(gradientType, degree, colors);

  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <Typography variant="subtitle1" gutterBottom sx={{ color: 'rgba(255,255,255,0.9)' }}>
        {label}
      </Typography>
      
      <Grid container spacing={2} alignItems="flex-start">
        {/* Type selector and degree */}
        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Type</InputLabel>
            <Select
              value={gradientType}
              label="Type"
              onChange={(e) => handleTypeChange(e.target.value as GradientType)}
              sx={{
                color: 'white',
                '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
                '.MuiSvgIcon-root': { color: 'white' },
              }}
            >
              <MenuItem value="linear">Linear</MenuItem>
              <MenuItem value="radial">Radial</MenuItem>
              <MenuItem value="conic">Conic</MenuItem>
            </Select>
          </FormControl>
          
          {(gradientType === 'linear' || gradientType === 'conic') && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" color="rgba(255,255,255,0.7)">
                {gradientType === 'conic' ? 'Start Angle' : 'Degree'}
              </Typography>
              <Typography variant="body2">{degree}°</Typography>
              <DegreePicker value={degree} onChange={handleDegreeChange} size={120} />
            </Box>
          )}
        </Grid>

        {/* Color pickers */}
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box>
              <Typography variant="caption" color="rgba(255,255,255,0.7)">
                Color 1
              </Typography>
              <Button
                variant="outlined"
                onClick={(e) => onPickColor(e.currentTarget, 0)}
                sx={{
                  mt: 0.5,
                  minWidth: 48,
                  px: 1,
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'rgba(255,255,255,0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: 18,
                    height: 18,
                    borderRadius: 3,
                    background: colors[0] ?? COLORS.gogo_blue,
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                />
                Pick
              </Button>
            </Box>
            <Box>
              <Typography variant="caption" color="rgba(255,255,255,0.7)">
                Color 2
              </Typography>
              <Button
                variant="outlined"
                onClick={(e) => onPickColor(e.currentTarget, 1)}
                sx={{
                  mt: 0.5,
                  minWidth: 48,
                  px: 1,
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'rgba(255,255,255,0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: 18,
                    height: 18,
                    borderRadius: 3,
                    background: colors[1] ?? COLORS.gogo_purple,
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                />
                Pick
              </Button>
            </Box>
            {hasThreeColors && (
              <Box>
                <Typography variant="caption" color="rgba(255,255,255,0.7)">
                  Color 3
                </Typography>
                <Button
                  variant="outlined"
                  onClick={(e) => onPickColor(e.currentTarget, 2)}
                  sx={{
                    mt: 0.5,
                    minWidth: 48,
                    px: 1,
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'rgba(255,255,255,0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: 18,
                      height: 18,
                      borderRadius: 3,
                      background: colors[2] ?? COLORS.gogo_purple,
                      border: '1px solid rgba(255,255,255,0.2)',
                    }}
                  />
                  Pick
                </Button>
              </Box>
            )}
            <Button
              size="small"
              variant="text"
              onClick={handleToggleThreeColors}
              sx={{ color: 'rgba(255,255,255,0.7)', textTransform: 'none', justifyContent: 'flex-start', px: 0 }}
            >
              {hasThreeColors ? '− Remove 3rd color' : '+ Add 3rd color'}
            </Button>
          </Box>
        </Grid>

        {/* Preview */}
        <Grid item xs={12} md={4}>
          <Typography variant="caption" color="rgba(255,255,255,0.7)" sx={{ mb: 0.5, display: 'block' }}>
            Preview
          </Typography>
          <Box
            sx={{
              width: 140,
              height: 140,
              borderRadius: 1,
              border: '1px solid rgba(255,255,255,0.1)',
              background: previewBackground,
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER HOOK FOR MANAGING GRADIENT COLOR PICKER STATE
// ─────────────────────────────────────────────────────────────────────────────

export interface GradientColorPickerState {
  gradientKey: string;
  colorIndex: number;
}

export function useGradientColorPicker() {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [state, setState] = useState<GradientColorPickerState | null>(null);

  const openPicker = (el: HTMLElement, gradientKey: string, colorIndex: number) => {
    setAnchor(el);
    setState({ gradientKey, colorIndex });
  };

  const closePicker = () => {
    setAnchor(null);
    setState(null);
  };

  return { anchor, state, openPicker, closePicker };
}

export default GradientEditor;
