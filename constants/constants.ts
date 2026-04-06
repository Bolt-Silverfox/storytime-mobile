import { ImageSourcePropType } from "react-native";

export const onBoardingSlide: {
  id: string;
  image: ImageSourcePropType;
  title: string;
  description: string;
  dot: number[];
}[] = [
  {
    id: "1",
    image: {
      uri: "https://res.cloudinary.com/billmal/image/upload/v1770186120/storytime/assets/Onboarding_4_1_s0neg4.jpg",
    },
    title: "Welcome to Storytime",
    description: "Listen, read, and explore stories crafted just for you!",
    dot: [10, 5, 5],
  },
  {
    id: "2",
    image: {
      uri: "https://res.cloudinary.com/billmal/image/upload/v1770186120/storytime/assets/Onboarding_5_1_c1nnax.jpg",
    },
    title: "Discover Fun Stories",
    description:
      "From bedtime adventures to talking animals and fairytale dreams.",
    dot: [5, 10, 5],
  },
  {
    id: "3",
    image: {
      uri: "https://res.cloudinary.com/billmal/image/upload/v1770186120/storytime/assets/Onboarding_6_1_zp43gi.jpg",
    },
    title: "Listen / Read Your Way",
    description: "Read along with colorful pages or listen to friendly voices.",
    dot: [5, 5, 10],
  },
];

export const FAQ = [
  {
    q: "What is Storytime?",
    a: "Storytime is a storytelling app with a library of narrated and read-along stories designed for learning, fun, and relaxation. Pick stories by theme or length and play them anytime the device is online.",
    id: 1,
  },
  {
    q: "Are the stories safe?",
    a: "Yes. Our stories are carefully selected and organized for enjoyable listening and reading, and we avoid mature themes and explicit language.\nIf you ever find something you don’t like, you can report it and we’ll review it.",
    id: 2,
  },
  {
    q: "Do I need the internet to read and listen to stories?",
    a: "Yes. You need an internet connection to read or listen to stories on Storytime.",
    id: 3,
  },
  {
    q: "Can I download stories to use offline?",
    a: "No. Storytime doesn’t support offline downloads right now. To access stories, you’ll need an internet connection.",
    id: 4,
  },
];
