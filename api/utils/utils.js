const projectedMaxes = {
  "Arcadia": 200,
  "Assault": 280,
  "Brawl": 215,
  "Frostbite": 153,
  "Jumphouse": 250,
  "Mosh Pit": 315,
  "Nexus": 195,
  "Pythagoras": 200,
  "Stadion": 225,
  "Surf's Up": 140,
};

const round = (value, precision) => {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
};

module.exports = { projectedMaxes, round }