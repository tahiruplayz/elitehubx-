// Shared types — no Node.js imports, safe for client components

export interface SystemRequirements {
  os?: string;
  cpu?: string;
  ram?: string;
  gpu?: string;
  storage?: string;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  size: string;
  downloadLink: string;
  tags: string[];
  views?: number;
  downloads?: number;
  createdAt?: string;
  screenshots?: string[];
  features?: string[];
  minReqs?: SystemRequirements;
  recReqs?: SystemRequirements;
}

export function isLowEnd(game: Game): boolean {
  const u = game.size.toLowerCase();
  const n = parseFloat(game.size);
  return u.includes('mb') || (u.includes('gb') && n <= 4) ||
    game.tags.some(t => ['low-end', 'low end', 'lightweight'].includes(t.toLowerCase()));
}

export function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
