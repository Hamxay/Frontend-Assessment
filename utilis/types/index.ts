import { KeyboardEvent } from "react";

export interface ISeat {
  id: string;
  col: number;
  x: number;
  y: number;
  priceTier: number;
  status: "available" | "reserved" | "sold" | "held";
}

export interface IRow {
  index: number;
  seats: ISeat[];
}

export interface Section {
  id: string;
  label: string;
  transform: { x: number; y: number; scale: number };
  rows: IRow[];
}

export interface IVenueMap {
  width: number;
  height: number;
}

export interface IVenue {
  venueId: string;
  name: string;
  map: IVenueMap;
  sections: Section[];
}

export interface ISeatDetailsProps {
  seat: ISeat;
}

export interface ISeatingMapProps {
  venue: IVenue;
  selectedSeats: string[];
  onSeatClick: (seat: ISeat) => void;
  onSeatFocus: (seat: ISeat | null) => void;
}

export interface ISelectionSummaryProps {
  selectedSeats: string[];
  venue: IVenue;
  onClear: () => void;
}

export interface ISeatNodeProps {
  seat: ISeat;
  isSelected: boolean;
  isFocused: boolean;
  isHovered: boolean;
  isDisabled: boolean;
  fillColor: string;
  handleSeatClick: (seat: ISeat) => void;
  handleSeatKeyDown: (e: KeyboardEvent, seat: ISeat) => void;
  setHoveredSeatId: (id: string | null) => void;
}
