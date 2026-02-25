import {
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown,
  Plus, Minus, Check, X,
  Trash, PencilSimple, Copy, FloppyDisk,
  DownloadSimple, UploadSimple, ShareNetwork, PaperPlaneTilt,
  Play, Pause, Camera, Microphone,
  Heart, Star, Bell, BookmarkSimple,
  ShoppingCart, CreditCard, Bag, Tag,
  Lock, LockOpen, ShieldCheck, Fingerprint,
  Warning, Fire, Lightning,
  Rocket, Trophy, Crown, Sparkle,
  MagicWand, Palette,
  House, Gear, Globe, Link,
  Code, Terminal, Key, WifiHigh,
  Coffee, Ghost, Robot, Skull,
  GameController, Confetti, Crosshair,
  PaperPlane, Eye, EyeSlash,
  Headphones, MusicNotes, SpeakerHigh,
} from "@phosphor-icons/react";

// Named map — used for dynamic icon rendering and the picker grid
export const ICON_MAP = {
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown,
  Plus, Minus, Check, X,
  Trash, PencilSimple, Copy, FloppyDisk,
  DownloadSimple, UploadSimple, ShareNetwork, PaperPlaneTilt,
  Play, Pause, Camera, Microphone,
  Heart, Star, Bell, BookmarkSimple,
  ShoppingCart, CreditCard, Bag, Tag,
  Lock, LockOpen, ShieldCheck, Fingerprint,
  Warning, Fire, Lightning,
  Rocket, Trophy, Crown, Sparkle,
  MagicWand, Palette,
  House, Gear, Globe, Link,
  Code, Terminal, Key, WifiHigh,
  Coffee, Ghost, Robot, Skull,
  GameController, Confetti, Crosshair,
  PaperPlane, Eye, EyeSlash,
  Headphones, MusicNotes, SpeakerHigh,
};

// Filter to only names that resolved (guards against wrong names)
export const ICON_NAMES = Object.keys(ICON_MAP).filter(k => ICON_MAP[k]);

export function PhosphorIcon({ name, size = 18, weight = "bold" }) {
  const Icon = ICON_MAP[name];
  if (!Icon) return null;
  return <Icon size={size} weight={weight} />;
}
