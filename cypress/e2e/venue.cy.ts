describe('Venue seat selection E2E', () => {
  const seatingMap = () =>
    cy.get('[aria-label="Seating map"]', { timeout: 15000 });

  beforeEach(() => {
    cy.visit('/');
    seatingMap().should('be.visible');
  });

  it('loads the venue and shows seating map and summary', () => {
    cy.contains('h1', 'Metropolis Arena').should('be.visible');
    cy.contains('h3', 'Order Summary').should('be.visible');
    cy.contains('No seats selected').should('be.visible');
    cy.contains('0/8 seats selected').should('be.visible');
  });

  it('selects an available seat and updates summary and details', () => {
    // A-1-01 is available (Tier 1 => $50)
    cy.get('#seat-A-1-01').click();

    // Details panel should appear
    cy.contains('h3', 'Seat Details').should('be.visible');
    cy.contains('Seat ID').siblings().contains('A-1-01').should('be.visible');

    // Summary should show pricing breakdown
    cy.contains('Order Summary').should('be.visible');
    cy.contains('A-1-01').should('be.visible');
    cy.contains('$50').should('be.visible'); // line item
    cy.contains('Total').siblings().contains('$50.00').should('be.visible');

    // Continue should be enabled when at least 1 seat is selected
    cy.get('button[aria-label^="Continue to checkout"]').should(
      'not.be.disabled'
    );

    // Selected count
    cy.contains('1/8 seats selected').should('be.visible');
  });

  it('does not allow selecting non-available seats (reserved/sold/held)', () => {
    // A-1-02 is reserved, A-2-03 is sold, B-2-07 is held
    cy.get('#seat-A-1-02').click();
    cy.get('#seat-A-2-03').click();
    cy.get('#seat-B-2-07').click();

    // Should still have no seats selected
    cy.contains('No seats selected').should('be.visible');
    cy.contains('0/8 seats selected').should('be.visible');
    cy.get('button[aria-label="Clear selected seats"]').should('exist'); // always rendered
    cy.get('button[aria-label^="Continue to checkout"]').should('be.disabled');
  });

  it('supports keyboard selection via Enter on a focused seat', () => {
    // A-1-03 is available
    cy.get('#seat-A-1-03').focus().type('{enter}');
    cy.contains('A-1-03').should('be.visible');
    cy.contains('1/8 seats selected').should('be.visible');
  });

  it('clears selected seats with the Clear button', () => {
    cy.get('#seat-A-1-01').click();
    cy.get('#seat-A-1-04').click();
    cy.contains('2/8 seats selected').should('be.visible');

    cy.get('button[aria-label="Clear selected seats"]').click();
    cy.contains('No seats selected').should('be.visible');
    cy.contains('0/8 seats selected').should('be.visible');
    cy.get('button[aria-label^="Continue to checkout"]').should('be.disabled');
  });

  it('enforces maximum of 8 selected seats', () => {
    // Click 9 available seats; the 9th should not be added
    const seatsToClick = [
      'A-1-01',
      'A-1-03',
      'A-1-04',
      'A-1-05',
      'A-1-06',
      'A-1-08',
      'A-2-01',
      'A-2-02',
      'A-2-04', // 9th attempt
    ];

    seatsToClick.forEach((id) => cy.get(`#seat-${id}`).click());

    cy.contains('8/8 seats selected').should('be.visible');

    // The last one should not be present in Order Summary if it was the 9th
    cy.contains('h3', 'Order Summary')
      .should('be.visible')
      .parent()
      .within(() => {
        cy.contains('A-2-04').should('not.exist');
      });
  });

  it('persists selections across reloads via localStorage', () => {
    cy.get('#seat-A-1-01').click();
    cy.contains('1/8 seats selected').should('be.visible');

    cy.reload();
    seatingMap().should('be.visible');
    cy.contains('A-1-01').should('be.visible');
    cy.contains('1/8 seats selected').should('be.visible');
  });

  it('navigates seats with arrow keys and updates focus and details', () => {
    // Start focus on an available seat and move right
    cy.get('#seat-A-1-03').focus().type('{rightarrow}');

    // Focus should move to next seat
    cy.focused().should('have.attr', 'id', 'seat-A-1-04');

    // Details should reflect the newly focused seat
    cy.contains('h3', 'Seat Details')
      .should('be.visible')
      .parent()
      .contains('A-1-04')
      .should('be.visible');
  });

  it('toggles selection when clicking the same seat twice', () => {
    // Select
    cy.get('#seat-A-1-01').click().should('have.attr', 'aria-pressed', 'true');
    cy.contains('1/8 seats selected').should('be.visible');
    cy.contains('h3', 'Order Summary')
      .parent()
      .within(() => {
        cy.contains('A-1-01').should('be.visible');
      });

    // Deselect
    cy.get('#seat-A-1-01').click().should('have.attr', 'aria-pressed', 'false');
    cy.contains('0/8 seats selected').should('be.visible');
    cy.contains('h3', 'Order Summary')
      .parent()
      .within(() => {
        cy.contains('A-1-01').should('not.exist');
        cy.contains('No seats selected').should('be.visible');
      });
  });
});
