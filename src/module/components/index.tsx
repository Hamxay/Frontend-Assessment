import { ISeat, IVenue } from "@/utilis/types";
import { useEffect, useState } from "react";
import SeatingMap from "./seating-map";
import SeatDetails from "./seat-detail";
import SelectionSummary from "./selection-summary";
import Loader from "@/components/loading";
import NoData from "@/components/no-data";

const Venue = () => {
  const [venue, setVenue] = useState<IVenue | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [focusedSeat, setFocusedSeat] = useState<ISeat | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVenue = async () => {
      const response = await fetch("/venue.json");
      const data: IVenue = await response.json();
      setVenue(data);
      setLoading(false);
    };
    loadVenue();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("selectedSeats");
    if (saved) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedSeats(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load selected seats:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedSeats", JSON.stringify(selectedSeats));
  }, [selectedSeats]);

  const handleSeatClick = (seat: ISeat) => {
    if (seat.status !== "available") return;

    setSelectedSeats((prev) => {
      if (prev.includes(seat.id)) {
        return prev.filter((id) => id !== seat.id);
      }
      if (prev.length >= 8) {
        return prev;
      }
      return [...prev, seat.id];
    });
    setFocusedSeat(seat);
  };

  const handleClearSelection = () => {
    setSelectedSeats([]);
    setFocusedSeat(null);
  };

  if (loading) {
    return <Loader />;
  }

  if (!venue) {
    return <NoData />;
  }
  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {venue.name}
          </h1>
          <p className="text-muted-foreground">
            Select up to 8 seats for your event
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg p-6">
              <SeatingMap
                venue={venue}
                selectedSeats={selectedSeats}
                onSeatClick={handleSeatClick}
                onSeatFocus={setFocusedSeat}
              />
            </div>
          </div>

          <div className="space-y-6">
            {focusedSeat && (
              <div className="bg-card border border-border rounded-lg p-6">
                <SeatDetails seat={focusedSeat} />
              </div>
            )}
            <div className="bg-card border border-border rounded-lg p-6">
              <SelectionSummary
                selectedSeats={selectedSeats}
                venue={venue}
                onClear={handleClearSelection}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Venue;
