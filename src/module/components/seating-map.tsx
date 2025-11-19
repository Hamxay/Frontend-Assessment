"use client";

import { useState, useRef, useCallback, KeyboardEvent } from "react";
import type { ISeat, ISeatingMapProps } from "@/utilis/types";
import SeatNode from "./seats";
import { legends } from "@/utilis/constants";

const SeatingMap = ({
  venue,
  selectedSeats,
  onSeatClick,
  onSeatFocus,
}: ISeatingMapProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [focusedSeatId, setFocusedSeatId] = useState<string | null>(null);
  const [hoveredSeatId, setHoveredSeatId] = useState<string | null>(null);

  const allSeats = venue.sections.flatMap((section) =>
    section.rows.flatMap((row) => row.seats)
  );

  const handleSeatKeyDown = useCallback(
    (e: KeyboardEvent, seat: ISeat) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSeatClick(seat);
      } else if (
        e.key === "ArrowRight" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowDown"
      ) {
        e.preventDefault();
        // Derive current index from the keydown target seat to avoid relying on internal focus state
        const currentIndex = allSeats.findIndex((s) => s.id === seat.id);
        let nextIndex = currentIndex;

        if (e.key === "ArrowRight") nextIndex = currentIndex + 1;
        if (e.key === "ArrowLeft") nextIndex = currentIndex - 1;
        if (e.key === "ArrowDown")
          nextIndex = Math.min(currentIndex + 8, allSeats.length - 1);
        if (e.key === "ArrowUp") nextIndex = Math.max(currentIndex - 8, 0);

        if (nextIndex >= 0 && nextIndex < allSeats.length) {
          const nextSeat = allSeats[nextIndex];
          setFocusedSeatId(nextSeat.id);
          onSeatFocus(nextSeat);
          document.getElementById(`seat-${nextSeat.id}`)?.focus();
        }
      }
    },
    [allSeats, onSeatClick, onSeatFocus]
  );

  const handleSeatClick = (seat: ISeat) => {
    setFocusedSeatId(seat.id);
    onSeatClick(seat);
    onSeatFocus(seat);
  };

  return (
    <div className="w-full">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${venue.map.width} ${venue.map.height}`}
        className="w-full border border-border rounded bg-slate-950"
        role="region"
        aria-label="Seating map"
      >
        <rect
          width={venue.map.width}
          height={venue.map.height}
          fill="#0f172a"
        />

        {venue.sections.map((section) => (
          <g key={section.id}>
            <text
              x={section.transform.x + 20}
              y={section.transform.y + 20}
              fontSize="16"
              fontWeight="bold"
              fill="#e2e8f0"
            >
              {section.label}
            </text>
            {section.rows.map((row) =>
              row.seats.map((seat) => {
                const isSelected = selectedSeats.includes(seat.id);
                const isFocused = focusedSeatId === seat.id;
                const isHovered = hoveredSeatId === seat.id;
                const isDisabled = seat.status !== "available";

                let fillColor = "#64748b";
                if (seat.status === "reserved") fillColor = "#ef4444";
                if (seat.status === "sold") fillColor = "#a855f7";
                if (seat.status === "held") fillColor = "#f59e0b";
                if (isSelected) fillColor = "#10b981";
                if (isFocused || isHovered) fillColor = "#0ea5e9";

                return (
                  <SeatNode
                    key={seat.id}
                    seat={seat}
                    isSelected={isSelected}
                    isFocused={isFocused}
                    isHovered={isHovered}
                    isDisabled={isDisabled}
                    fillColor={fillColor}
                    handleSeatClick={handleSeatClick}
                    handleSeatKeyDown={handleSeatKeyDown}
                    setHoveredSeatId={setHoveredSeatId}
                  />
                );
              })
            )}
          </g>
        ))}
      </svg>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {legends.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-full ${item.color}`} />
            <span className="text-sm text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeatingMap;
