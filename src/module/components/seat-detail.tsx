import type { ISeatDetailsProps } from "@/utilis/types";
import { statusColor, statusLabel, TIER_PRICES } from "@/utilis/constants";

const SeatDetails = ({ seat }: ISeatDetailsProps) => {
  const [section, row] = seat.id.split("-");
  const price = TIER_PRICES[seat.priceTier as keyof typeof TIER_PRICES] || 0;

  const details = [
    { label: "Seat ID", value: seat.id },
    { label: "Section", value: `Section ${section}` },
    { label: "Row", value: row },
    { label: "Price Tier", value: `Tier ${seat.priceTier}` },
    { label: "Price", value: `$${price}` },
    {
      label: "Status",
      value: statusLabel[seat.status as keyof typeof statusLabel],
      className: statusColor[seat.status as keyof typeof statusColor],
    },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Seat Details
      </h3>

      <div className="space-y-3">
        {details.map((item) => (
          <div key={item.label}>
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p
              className={`text-base font-medium text-foreground ${
                item.className || ""
              }`}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeatDetails;
