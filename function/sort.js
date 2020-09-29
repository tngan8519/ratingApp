module.exports.sortTopRatingIndiviudal = function (allIndividuals) {
  return allIndividuals.sort(function (a, b) {
    return b.rating - a.rating;
  });
};
