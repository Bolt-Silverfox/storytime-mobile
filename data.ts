import { ImageSourcePropType } from "react-native";

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
  {
    source: require("./assets/lost-secrets.png"),
    title: "Secrets of the lost woods",
    ageRange: "7 - 10",
    label: "adventure",
    id: "3",
    bgColour: "#0731EC1A",
    textColour: "#0731EC",
  },
  {
    source: require("./assets/little-miss-pi.png"),
    title: "Brume",
    ageRange: "7 - 10",
    label: "mystery",
    id: "4",
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

const privacyPolicyData: {
  title: string;
  paragraph: string;
  number: string;
}[] = [
  {
    title: "Information We collect",
    paragraph:
      "We collect only the information needed to improve your child’s experience in StoryTime. We do not collect personal data from children without parental consent. Information collected may include reading progress, app usage, and interaction patterns.",
    number: "I",
  },
  {
    title: "How We Use the Information",
    paragraph:
      "We use the collected information to personalize reading content, track achievements, remember story preferences, and make the app more engaging and educational for children.",
    number: "II",
  },
  {
    title: "How We Protect Your Data",
    paragraph:
      "We use secure storage systems, encrypted data handling, and safe parental login features. We do not use third-party trackers that collect personal information from children.",
    number: "III",
  },
  {
    title: "Parents' Rights",
    paragraph:
      "Parents can request to view, update, or delete any information stored about their child at any time. We comply with children safety laws including COPPA and general data protection standards.",
    number: "IV",
  },
  {
    title: "Third-Party Services",
    paragraph:
      "If we use external services such as Firebase or analytics tools, they may only access non-personal usage data. They cannot collect names, photos, addresses, or personal details of any child.",
    number: "V",
  },
  {
    title: "Updates to This Policy",
    paragraph:
      "We may update this policy occasionally. Parents will be notified of important changes through the app or email.",
    number: "VI",
  },
  {
    title: "Contact Us",
    paragraph: "mail : support@storytimekids.com",
    number: "VII",
  },
];

const termsAndConditionsData: {
  heading: string;
  paragraph: string | string[];
  index: string;
}[] = [
  {
    heading: "Introduction and Acceptance",
    paragraph:
      'This document ("Terms") constitutes a legally binding agreement between you (the "User," "Parent," or "Guardian") and StoryTime4Kids ("Company," "We," or "Us") regarding your access and use of our digital library and app service (the "Service"). By accessing, using, or subscribing to the Service, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, you may not use the Service.',
    index: "I",
  },
  {
    heading: "The Service & Age Restrictions",
    paragraph:
      "StoryTime4Kids provides access to a curated digital library of audio and video Content designed to enhance children's literacy and imagination. The Service is intended for use by adults for children under 18. Users must be 18 years of age or older to create an account, make payments, and agree to these Terms.",
    index: "II",
  },
  {
    heading: "Subscription, Payments, and Free Trials",
    index: "III",
    paragraph: [
      "Subscription: We offer various subscription models (e.g., Monthly, Annual, Family Legacy).",
      "Automatic Renewal: All paid subscriptions automatically renew at the then-current rate unless you cancel the subscription prior to the end of the current billing period.",
      "Free Trial: We may offer a Free Trial (e.g., 7 or 14 days). CRITICAL NOTICE: Your payment method will be charged automatically immediately following the end of your free trial period unless you cancel before the trial expires.",
    ],
  },
  {
    heading: "Intellectual Property (IP)",
    paragraph:
      "All content, including stories, narration, illustrations, trademarks, and software, is the property of StoryTime4Kids or its licensors and is protected by copyright and intellectual property laws. Content is licensed to you for personal, non-commercial use only. You may not copy, modify, transmit, or publicly display any Content without express written permission.",
    index: "IV",
  },
  {
    heading: "User Conduct & Security",
    paragraph:
      "You are responsible for safeguarding your account login information and for all activity under your account. You agree not to use the Service for any unlawful purpose, including sharing your account credentials with non-subscribers beyond the limits of your plan.",
    index: "V",
  },
  {
    heading: "Termination",
    paragraph:
      "We reserve the right to immediately terminate or suspend your access to the Service, without prior notice or liability, if you breach any part of these Terms, including but not limited to non-payment or unauthorized sharing of Content.",
    index: "VI",
  },
  {
    heading: "Governing Law and Disputes",
    paragraph:
      "These Terms shall be governed by the laws of [Your Jurisdiction, e.g., the State of California], without regard to its conflict of law provisions. Any disputes must first be attempted to be resolved through good faith negotiation or binding arbitration as set forth in the full policy document.",
    index: "VII",
  },
];

const storyTrackerData: {
  id: string;
  name: string;
  category: string;
  kid: string;
  progress: number;
  source?: ImageSourcePropType;
}[] = [
  {
    id: "1",
    name: "Unseen World",
    category: "Adventure & Action",
    kid: "Jacob",
    progress: 26,
    source: require("./assets/parents/unseen-world.jpg"),
  },
  {
    id: "2",
    name: "The Boy in the sea",
    category: "Mystery & Detective Stories",
    kid: "Jacob",
    progress: 13,
    source: require("./assets/parents/boy-in-the-sea.jpg"),
  },
];

const PALETTE = [
  { id: 1, name: "Adventure", colour: "#039222", bg: "#CDFBD7" },
  { id: 2, name: "Coming of Age", colour: "#925403", bg: "#FBE5CD" },
  { id: 3, name: "Courage/Bravery", colour: "#926903", bg: "#FBF9CD" },
  { id: 4, name: "Mystery", colour: "#008D81", bg: "#CDFBF7" },
  { id: 5, name: "Fantasy", colour: "#5B007C", bg: "#EFCDFB" },
  { id: 6, name: "Love & Family", colour: "#039222", bg: "#CDFBD7" },
  { id: 7, name: "Transformation", colour: "#925403", bg: "#FBE5CD" },
  { id: 8, name: "Honesty", colour: "#926903", bg: "#FBF9CD" },
];

const parentProfileSetupTags = [
  "speaking skills",
  "listening skills",
  "conversation skills",
  "vocabulary building",
  "storytelling skills",
  "problem solving",
  "critical thinking",
  "memory & recall",
  "curiosity & exploration",
  "decision making",
  "empathy & kindness",
  "confidence building",
  "responsibility",
  "independence",
  "imagination",
  "creative thinking",
];
const fakeUser = {
  avatar: null,
  createdAt: "2025-12-06T16:42:04.496Z",
  email: "molunoprogress@gmail.com",
  enableBiometrics: false,
  id: "9f75dc83-9189-4954-8a81-95a7bdf6f615",
  name: "Moluno Progress",
  numberOfKids: 7,
  pinSet: true,
  profile: {
    country: null,
    explicitContent: true,
    language: null,
    maxScreenTimeMins: null,
  },
  role: "parent",
  title: "Mr",
  updatedAt: "2025-12-08T22:23:49.690Z",
};

const ageRange = ["1 - 4", "5 - 8", "9 - 12"] as const;

const storyCategories = [
  "Adventure",
  "Fantasy",
  "Honesty",
  "Good vs Evil",
  "Courage / Bravery",
  "Transformation",
  "Coming of Age",
  "Fables",
  "Folk Tales",
  "Fairy Tales",
  "Original Content",
  "Real Stories",
  "Bedtime",
  "Learning",
  "Funny Stories",
  "Science & Nature",
  "Educational Stories",
  "Seasonal & Holidays",
  "Animal Stories",
  "Fantasy & Magical",
  "Morals & Values",
  "Friendship & Emotional",
  "Mystery & Problem Solving",
];
const storyCategoriesColours = [
  "#008D81",
  "#0A2DBA",
  "#5B007C",
  "#926903",
  "#925403",
  "#6F9A0C",
  "#039222",
  "#0C85B8",
  "#EF12A7",
  "#C9240B",
];
export {
  popularSuggestions,
  childDetailsData,
  privacyPolicyData,
  termsAndConditionsData,
  storyTrackerData,
  PALETTE,
  parentProfileSetupTags,
  ageRange,
  fakeUser,
  storyCategories,
  storyCategoriesColours,
};
