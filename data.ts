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
    index: "I",
    paragraph: [
      'These Terms and Conditions ("Terms") form a legally binding agreement between you ("User," "Parent," or "Guardian") and StoryTime4Kids ("Company," "we," "us," or "our") governing your access to and use of our website, mobile application, and digital content services (collectively, the "Service").',
      "By accessing, using, or subscribing to the Service, you confirm that you have read, understood, and agree to be bound by these Terms. If you do not agree, you must not access or use the Service.",
    ],
  },
  {
    heading: "The Service and Age Restrictions",
    index: "II",
    paragraph: [
      "StoryTime4Kids provides access to a curated digital library of stories, audio, video, and related educational content designed to support children's literacy and imagination.",
      "The Service is intended for use by parents or legal guardians for children under the age of 18. You must be at least 18 years old to create an account, make payments, and accept these Terms on behalf of a child.",
    ],
  },
  {
    heading: "Subscriptions, Payments, and Free Trials",
    index: "III",
    paragraph: [
      "1. Subscription Plans: We offer various subscription plans, including monthly and annual options. Plan details and pricing are displayed at the time of purchase.",
      "2. Automatic Renewal: All paid subscriptions automatically renew at the applicable rate unless cancelled before the end of the current billing period.",
      "3. Billing and Cancellation: Subscription management and cancellations are handled through your App Store or Google Play account.",
    ],
  },
  {
    heading: "Intellectual Property Rights",
    index: "IV",
    paragraph: [
      "All content and materials made available through the Service, including stories, narration, illustrations, graphics, trademarks, and software, are the exclusive property of StoryTime4Kids or its licensors and are protected by applicable intellectual property laws.",
      "You are granted a limited, non-exclusive, non-transferable license to access and use the Service for personal, non-commercial purposes only. You may not copy, reproduce, distribute, modify, or publicly display any content without prior written consent.",
    ],
  },
  {
    heading: "User Conduct and Account Security",
    index: "V",
    paragraph: [
      "You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.",
      "You agree not to:\n• Use the Service for unlawful or unauthorized purposes\n• Share account access beyond the limits of your subscription plan\n• Attempt to copy, scrape, redistribute, or exploit any part of the Service",
    ],
  },
  {
    heading: "Suspension and Termination",
    index: "VI",
    paragraph: [
      "We reserve the right to suspend or terminate your access to the Service, with or without notice, if you violate these Terms, misuse the Service, or fail to meet payment obligations.",
      "You may discontinue use of the Service at any time by cancelling your subscription or deleting your account.",
    ],
  },
  {
    heading: "Governing Law and Dispute Resolution",
    index: "VII",
    paragraph: [
      "These Terms shall be governed by and construed in accordance with the laws of your Jurisdiction, without regard to conflict of law principles.",
      "Any disputes arising out of or relating to these Terms or the Service shall first be attempted to be resolved through good-faith negotiations and, if unresolved, through binding arbitration in accordance with applicable laws.",
    ],
  },
  {
    heading: "Changes to These Terms",
    index: "VIII",
    paragraph:
      'We may update these Terms from time to time. Any changes will be posted on this page with an updated "Last updated" date. Continued use of the Service after changes become effective constitutes acceptance of the revised Terms.',
  },
  {
    heading: "Contact Information",
    index: "IX",
    paragraph:
      "If you have questions about these Terms, please contact us at: Email: team@storytimeapp.me",
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
  "Unlimited access to a growing library of kids' stories.",
  "Interactive story mode: short quizzes after each story to boost learning.",
  "Pick from soothing, fun voices tailored to your child.",
];

const storiesByAgeImages: Record<AgeGroupType, string> = {
  All: "https://res.cloudinary.com/billmal/image/upload/v1769762827/storytime/assets/generate_an_children_story_book_image_for_the_theme__Mystery_problem_solving__3_1_b57i6x.jpg",
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
