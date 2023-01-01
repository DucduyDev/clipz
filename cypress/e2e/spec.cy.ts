describe('Sanity test', () => {
  it('should pass', () => {
    cy.visit('/');
    cy.contains('#header .text-3xl', 'Clipz');
  });
});
