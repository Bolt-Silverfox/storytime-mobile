const categories = [
  {
    name: "Adventure",
    colour: "#039222",
    bg: "#99CDA5",
  },
  {
    name: "Coming of Age",
    colour: "#925403",
    bg: "#FBE5CD",
  },
  {
    name: "Courage/Bravery",
    colour: "#926903",
    bg: "#FBF9CD",
  },
  {
    name: "Good vs Evil",
    colour: "#008D81",
    bg: "#CDFBF7",
  },
  {
    name: "Fantasy",
    colour: "#5B007C",
    bg: "#EFCDFB",
  },
  {
    name: "Love & Family",
    colour: "#039222",
    bg: "#99CDA5",
  },
  {
    name: "Transformation",
    colour: "#925403",
    bg: "#FBE5CD",
  },
  {
    name: "Honesty",
    colour: "#926903",
    bg: "#FBF9CD",
  },
];

const popularSuggestions = [
  {
    source: require("./assets/lost-secrets.png"),
    title: "Secrets of the lost woods",
    ageRange: "7 - 10",
    label: "adventure",
    id: "1",
    bgColour: "#0731EC1A",
    textColour: "#0731EC",
  },
  {
    source: require("./assets/little-miss-pi.png"),
    title: "Brume",
    ageRange: "7 - 10",
    label: "mystery",
    id: "2",
    bgColour: "#07CAEC1A",
    textColour: "#07CAEC",
  },
];

const childDetailsData = [
  {
    source: require("./assets/images/books/mice-town.png"),
    id: "1",
  },
  {
    source: require("./assets/images/books/mother-hen.png"),
    id: "2",
  },
  {
    source: require("./assets/images/books/life-of-pi.png"),
    id: "3",
  },
  {
    source: require("./assets/images/books/ponyo.png"),
    id: "4",
  },
  {
    source: require("./assets/images/books/little-miss-nettie.png"),
    id: "5",
  },
  {
    source: require("./assets/images/books/animals.png"),
    id: "6",
  },
];

export { categories, popularSuggestions, childDetailsData };
