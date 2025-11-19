import type { ISeatNodeProps } from "@/utilis/types";

const SeatNode = ({
  seat,
  isSelected,
  isFocused,
  isHovered,
  isDisabled,
  fillColor,
  handleSeatClick,
  handleSeatKeyDown,
  setHoveredSeatId,
}: ISeatNodeProps) => {
  return (
    <g>
      <circle
        id={`seat-${seat.id}`}
        cx={seat.x}
        cy={seat.y}
        r="8"
        fill={fillColor}
        stroke={isFocused ? "#fff" : "none"}
        strokeWidth={isFocused ? 2 : 0}
        onClick={() => handleSeatClick(seat)}
        onMouseEnter={() => setHoveredSeatId(seat.id)}
        onMouseLeave={() => setHoveredSeatId(null)}
        onKeyDown={(e) => handleSeatKeyDown(e, seat)}
        tabIndex={isDisabled ? -1 : 0}
        role="button"
        aria-label={`${seat.id} - ${seat.status} - Tier ${seat.priceTier}`}
        aria-pressed={isSelected}
        className="cursor-pointer transition-all"
        style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
      />

      {(isHovered || isFocused) && (
        <text
          x={seat.x}
          y={seat.y - 15}
          textAnchor="middle"
          fontSize="10"
          fill="#fff"
          pointerEvents="none"
        >
          {seat.id}
        </text>
      )}
    </g>
  );
};

export default SeatNode;
