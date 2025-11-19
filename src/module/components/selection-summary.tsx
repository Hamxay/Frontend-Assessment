'use client';

import { useMemo } from 'react';
import type { Section, ISeat, ISelectionSummaryProps } from '@/utilis/types';
import { TIER_PRICES } from '@/utilis/constants';

const SelectionSummary = ({
  selectedSeats,
  venue,
  onClear,
}: ISelectionSummaryProps) => {
  const allSeats: ISeat[] = useMemo(() => {
    return venue.sections.flatMap((section: Section) =>
      section.rows.flatMap((row) => row.seats)
    );
  }, [venue]);

  const summary = useMemo(() => {
    const seats = selectedSeats
      .map((seatId) => allSeats.find((seat) => seat.id === seatId))
      .filter((seat): seat is ISeat => !!seat);

    const subtotal = seats.reduce((sum, seat) => {
      const price = TIER_PRICES[seat.priceTier] ?? 0;
      return sum + price;
    }, 0);

    const total = subtotal;

    return {
      seats,
      subtotal,
      total,
    };
  }, [selectedSeats, allSeats]);

  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Order Summary
      </h3>

      <div className="space-y-2 mb-4 pb-4 border-b border-border">
        {summary.seats.length === 0 ? (
          <p className="text-sm text-muted-foreground">No seats selected</p>
        ) : (
          summary.seats.map((seat) => {
            const price = TIER_PRICES[seat.priceTier] ?? 0;
            return (
              <div key={seat.id} className="flex justify-between text-sm">
                <span className="text-foreground">{seat.id}</span>
                <span className="text-muted-foreground">${price}</span>
              </div>
            );
          })
        )}
      </div>

      {summary.seats.length > 0 && (
        <div className="space-y-2 mb-4">
          <div className="flex justify-between font-semibold  pt-2">
            <span className="text-foreground">Total</span>
            <span className="text-foreground">${summary.total.toFixed(2)}</span>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={onClear}
          className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition text-sm font-medium cursor-pointer"
          aria-label="Clear selected seats"
        >
          Clear
        </button>

        <button
          disabled={summary.seats.length === 0}
          className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-not-allowed"
          aria-label={`Continue to checkout with ${summary.seats.length} seats selected`}
        >
          Continue
        </button>
      </div>

      <p className="text-xs text-muted-foreground mt-4 text-center">
        {selectedSeats.length}/8 seats selected
      </p>
    </div>
  );
};

export default SelectionSummary;
