import {
  Gamepad2,
  BrainCircuit,
  Palette,
  ScanFace,
  Wrench,
  Boxes,
  Link2,
  Sparkles,
  Cpu,
  Rocket,
  Map,
  Network,
  MonitorSmartphone,
  LayoutPanelTop,
  Volume2,
  Bug,
  Shuffle,
  Video,
  Cloud,
  BarChart3,
  type LucideIcon,
} from 'lucide-react'

/**
 * Curated icon registry for admin-selectable service icons.
 * Explicit imports (rather than `import * as Icons from 'lucide-react'`)
 * keep the icon set tree-shakeable — pulling in the whole library adds
 * several hundred KB to the bundle for icons we never render.
 */
export const ICON_REGISTRY: Record<string, LucideIcon> = {
  Gamepad2,
  BrainCircuit,
  Palette,
  ScanFace,
  Wrench,
  Boxes,
  Link2,
  Sparkles,
  Cpu,
  Rocket,
  Map,
  Network,
  MonitorSmartphone,
  LayoutPanelTop,
  Volume2,
  Bug,
  Shuffle,
  Video,
  Cloud,
  BarChart3,
}

export const ICON_NAMES = Object.keys(ICON_REGISTRY)

export function getServiceIcon(name: string): LucideIcon {
  return ICON_REGISTRY[name] ?? Sparkles
}
