export const statusLabel = {
  available: "Available",
  reserved: "Reserved",
  sold: "Sold Out",
  held: "Held",
};

export const statusColor = {
  available: "text-green-500",
  reserved: "text-red-500",
  sold: "text-gray-500",
  held: "text-amber-500",
};

export const legends = [
  { color: "bg-slate-500", label: "Available" },
  { color: "bg-green-500", label: "Selected" },
  { color: "bg-red-500", label: "Reserved" },
  { color: "bg-amber-500", label: "Held" },
  { color: "bg-purple-500", label: "Sold" },
];

export const TIER_PRICES: Record<number, number> = {
  1: 50,
  2: 75,
  3: 100,
  4: 125,
};
