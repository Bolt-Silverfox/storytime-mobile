import { ChooseUserDataType } from "../screens/auth/ChooseUser";

export const onBoardingSlide = [
  {
    id: "1",
    image: require("../assets/images/onboarding/onBoarding1.jpg"),
    title: "Welcome to StoryTime",
    description:
      "Listen, read, and explore stories made just for kids like you!",
    dot: [10, 5, 5],
  },
  {
    id: "2",
    image: require("../assets/images/onboarding/onBoarding2.jpg"),
    title: "Discover Fun Stories",
    description:
      "From bedtime adventures to talking animals and fairytale dreams.",
    dot: [5, 10, 5],
  },
  {
    id: "3",
    image: require("../assets/images/onboarding/onBoarding3.jpg"),
    title: "Listen / Read Your Way",
    description: "Read along with colorful pages or listen to friendly voices.",
    dot: [5, 5, 10],
  },
];

export const ChooseUserData: ChooseUserDataType[] = [
  {
    name: "Parent",
    description: `Create and manage your child’s storytelling world.`,
    link: "signUp",
  },
  {
    name: "Child",
    description: "Listen, play, and explore fun stories!",
    link: "signUp",
  },
];

