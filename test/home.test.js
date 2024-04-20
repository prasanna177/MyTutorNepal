// Test cases
describe('applySorting', () => {
  it('should sort tutors by rating in descending order', () => {
    const filteredTutors = [
      { averageRating: 4 },
      { averageRating: 3 },
      { averageRating: 5 },
    ];

    expect(applySorting(filteredTutors.slice(), 'Rating')).toEqual([
      { averageRating: 5 },
      { averageRating: 4 },
      { averageRating: 3 },
    ]);
  });

  it('should sort tutors by sentiment value in custom order', () => {
    const filteredTutors = [
      { averageSentiment: 'positive' },
      { averageSentiment: 'neutral' },
      { averageSentiment: 'negative' },
    ];

    expect(applySorting(filteredTutors.slice(), 'Reviews: Good to bad')).toEqual([
      { averageSentiment: 'positive' },
      { averageSentiment: 'neutral' },
      { averageSentiment: 'negative' },
    ]);
  });
});