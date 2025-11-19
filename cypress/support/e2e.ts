// You can add custom Cypress commands here if needed.
// For now we keep defaults minimal for reliability.

beforeEach(() => {
	// Ensure tests start from a clean persisted state
	window.localStorage.removeItem("selectedSeats");
});


