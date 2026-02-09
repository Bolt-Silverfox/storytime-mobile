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
    title: "Welcome to StoryTime",
    description:
      "Listen, read, and explore stories made just for kids like you!",
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

export const ChooseUserData = [
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

export const terms = [
  {
    title: "I. Introduction and Acceptance",
    description:
      'This document ("Terms") constitutes a legally binding agreement between you (the "User," "Parent," or "Guardian") and StoryTime4Kids ("Company," "We," or "Us") regarding your access and use of our digital library and app service (the "Service"). By accessing, using, or subscribing to the Service, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, you may not use the Service.',
  },
  {
    title: "II. The Service & Age Restrictions",
    description:
      "StoryTime4Kids provides access to a curated digital library of audio and video Content designed to enhance childrens literacy and imagination. The Service is intended for use by adults for children under 18. Users must be 18 years of age or older to create an account, make payments, and agree to these Terms.",
  },
  {
    title: "III. Subscription, Payments, and Free Trials",
    description: `Subscription: We offer various subscription models (e.g., Monthly, Annual, Family Legacy).
Automatic Renewal: All paid subscriptions automatically renew at the then-current rate unless you cancel the subscription prior to the end of the current billing period.
Free Trial: We may offer a Free Trial (e.g., 7 or 14 days). CRITICAL NOTICE: Your payment method will be charged automatically immediately following the end of your free trial period unless you cancel before the trial expires.`,
  },
  {
    title: "IV. Intellectual Property (IP)",
    description: `All content, including stories, narration, illustrations, trademarks, and software, is the property of StoryTime4Kids or its licensors and is protected by copyright and intellectual property laws. Content is licensed to you for personal, non-commercial use only. You may not copy, modify, transmit, or publicly display any Content without express written permission.`,
  },
  {
    title: "V. User Conduct & Security",
    description: `You are responsible for safeguarding your account login information and for all activity under your account. You agree not to use the Service for any unlawful purpose, including sharing your account credentials with non-subscribers beyond the limits of your plan.`,
  },
  {
    title: "VI. Termination",
    description: `We reserve the right to immediately terminate or suspend your access to the Service, without prior notice or liability, if you breach any part of these Terms, including but not limited to non-payment or unauthorized sharing of Content.`,
  },
  {
    title: "VII. Governing Law and Disputes",
    description: `These Terms shall be governed by the laws of [Your Jurisdiction, e.g., the State of California], without regard to its conflict of law provisions. Any disputes must first be attempted to be resolved through good faith negotiation or binding arbitration as set forth in the full policy document.`,
  },
];

export const privacy = [
  {
    title: "I. Information We Collect",
    description:
      "We collect only the information needed to improve your child’s experience in StoryTime. We do not collect personal data from children without parental consent. Information collected may include reading progress, app usage, and interaction patterns.",
  },
  {
    title: "II. How We Use the Information",
    description:
      "We use the collected information to personalize reading content, track achievements, remember story preferences, and make the app more engaging and educational for children.",
  },
  {
    title: "III. How We Protect Your Data",
    description: `We use secure storage systems, encrypted data handling, and safe parental login features. We do not use third-party trackers that collect personal information from children.`,
  },
  {
    title: "IV. Parents’ Rights",
    description:
      "Parents can request to view, update, or delete any information stored about their child at any time. We comply with children safety laws including COPPA and general data protection standards.",
  },
  {
    title: "V. Third-Party Services",
    description:
      "If we use external services such as Firebase or analytics tools, they may only access non-personal usage data. They cannot collect names, photos, addresses, or personal details of any child.",
  },
  {
    title: "VI. Updates to This Policy",
    description:
      "We may update this policy occasionally. Parents will be notified of important changes through the app or email.",
  },
  {
    title: "VII. Contact Us",
    description: "mail: team@storytimeapp.me",
  },
];

export const FAQ = [
  {
    q: "What is Storytime4Kids?",
    a: "Storytime4Kids is a kids’ storytelling app with a library of narrated and read-along stories designed for learning, fun, and bedtime routines. Parents can pick stories by age, theme, or length and play them anytime the device is online.",
    id: 1,
  },
  {
    q: "Are the stories safe for my kids?",
    a: "Yes. Storytime is built for kids. Our stories are selected and organized for age-appropriate listening/reading, and we avoid mature themes and explicit language.\nIf you ever find something you don’t like, you can report it and we’ll review it.",
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
