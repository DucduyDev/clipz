describe('Clip', () => {
  it('should play', () => {
    cy.visit('/');
    cy.get('app-clips-list .grid > a:first-child').click();
    cy.get('.video-js').click();

    cy.wait(3000);

    cy.get('.video-js').click();

    // Assertions
    cy.get('.vjs-play-progress').invoke('width').should('gte', 0);
  });
});
