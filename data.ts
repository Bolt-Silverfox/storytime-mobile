import { AgeGroupType } from "./types";

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
    paragraph: "mail : team@storytimeapp.me",
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

const subscriptionOptions: { name: "Monthly" | "Yearly"; price: number }[] = [
  {
    name: "Monthly",
    price: 4.99,
  },
  {
    name: "Yearly",
    price: 47.99,
  },
];

const subscriptionBenefits = [
  "Unlock full story library",
  "Create unlimited child profiles",
  "Encourage consistent reading habits",
  "Perfect for bedtime & independent reading",
  "Watch your child grow with every adventure",
];

const storiesByAgeImages: Record<AgeGroupType, string> = {
  "1-3":
    "https://res.cloudinary.com/billmal/image/upload/v1768243230/storytime/assets/Age_1-3_djfdem.jpg",
  "4-6":
    "https://res.cloudinary.com/billmal/image/upload/v1768243231/storytime/assets/Age_4-6_javzsh.jpg",
  "7-9":
    "https://res.cloudinary.com/billmal/image/upload/v1768243230/storytime/assets/Age_7-9_emuxav.jpg",
  "10-12":
    "https://res.cloudinary.com/billmal/image/upload/v1768243231/storytime/assets/Age_10-12_1_ub4ist.jpg",
};

export {
  privacyPolicyData,
  storyCategoriesColours,
  subscriptionBenefits,
  subscriptionOptions,
  termsAndConditionsData,
  storiesByAgeImages,
};
