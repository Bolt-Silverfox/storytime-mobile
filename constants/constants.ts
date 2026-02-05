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

export const FAQ = {
  gettingStarted: [
    {
      q: "What is StoryTime for Kids?",
      a: "StoryTime for Kids helps children build reading and comprehension skills through age-appropriate stories, short quizzes, and daily challenges.",
    },
    {
      q: "What age is the app for?",
      a: "The app is designed for children aged 1–12, with content automatically adjusted to each child's reading level.",
    },
    {
      q: "Do I need a parent account?",
      a: "Yes. A parent or guardian aged 18+ must create and manage the account.",
    },
    {
      q: "Can my child use the app independently?",
      a: "Yes. The app is designed to be safe and easy for children to use independently.",
    },
    {
      q: "How long does a session take?",
      a: "Most sessions last 5–15 minutes, making it ideal for daily reading.",
    },
  ],
  safetyAndPrivacy: [
    {
      q: "Is the app safe for children?",
      a: "Yes. The app complies with COPPA and GDPR-K.",
    },
    {
      q: "Can I control what my child sees?",
      a: "Yes. Parents can apply age-based content filters.",
    },
    {
      q: "Can my child make purchases in the app?",
      a: "No. All purchases are restricted to the parent section.",
    },
    {
      q: "Is my child's data secure?",
      a: "Yes. Only minimal data is collected, and all data is encrypted and securely stored.",
    },
  ],
  storiesAndSubscription: [
    {
      q: "What types of stories are available?",
      a: "The app includes age-appropriate stories across multiple themes tailored to your child's level.",
    },
    {
      q: "Can my child listen instead of reading?",
      a: "Yes. Stories include audio narration for early readers.",
    },
    {
      q: "Are new stories added?",
      a: "Yes. New stories and illustrations are added regularly.",
    },
    {
      q: "Is the app free?",
      a: "Yes. The app offers free access, with optional premium features.",
    },
    {
      q: "What does a premium include?",
      a: "Premium unlocks more stories, audio features, and detailed progress insights.",
    },
    {
      q: "How do I cancel my subscription?",
      a: "You can cancel anytime through your App Store or Google Play settings.",
    },
  ],
  helpAndSupport: [
    {
      q: "Can the app be used on more than one device?",
      a: "Yes. Progress syncs across devices.",
    },
    {
      q: "The app won't load — what should I do?",
      a: "Restart the app or check your internet connection. Offline stories must be downloaded first.",
    },
    {
      q: "Audio isn't playing — how do I fix it?",
      a: "Check your device sound settings and the app's internal volume controls.",
    },
  ],
};
