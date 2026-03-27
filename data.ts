import { AgeGroupType } from "./types";

const privacyPolicyData: {
  title: string;
  paragraph: string;
  number: string;
}[] = [
  {
    title: "Information We Collect",
    paragraph:
      "We collect the following information to provide and improve the Storytime service: your email address and name (at registration), profile photo (if uploaded), reading progress and story preferences, app usage and interaction patterns, device tokens for push notifications, and purchase/transaction data for subscription management.",
    number: "I",
  },
  {
    title: "How We Use the Information",
    paragraph:
      "We use the collected information to personalize reading content, track achievements, remember story preferences, process subscriptions, send push notifications about new content, and improve the app experience.",
    number: "II",
  },
  {
    title: "How We Protect Your Data",
    paragraph:
      "We use secure storage systems, encrypted data handling, and industry-standard security practices. All data is transmitted over HTTPS and sensitive credentials are stored in secure device storage.",
    number: "III",
  },
  {
    title: "Third-Party Services",
    paragraph:
      "We use the following third-party services that may process limited data: Firebase Cloud Messaging (push notification delivery and device tokens), Firebase Crashlytics (crash reports and device diagnostics, linked to your user ID for debugging), and Sentry (error monitoring, linked to your user ID and email for issue resolution). These services process data according to their own privacy policies and do not use your data for advertising purposes.",
    number: "IV",
  },
  {
    title: "Your Rights",
    paragraph:
      "You can request to view, update, or delete any information stored about you at any time by contacting us or using the Delete Account feature in the app. We will respond to data requests within 30 days. For users in the European Economic Area, you also have the right to data portability, the right to object to processing, and the right to lodge a complaint with your local supervisory authority.",
    number: "V",
  },
  {
    title: "Data Retention",
    paragraph:
      "We retain your personal data for as long as your account is active. If you delete your account, we will remove your personal data within 30 days, except where we are required to retain it by law or for legitimate business purposes (e.g., transaction records).",
    number: "VI",
  },
  {
    title: "Updates to This Policy",
    paragraph:
      "We may update this policy occasionally. Users will be notified of important changes through the app or email.",
    number: "VII",
  },
  {
    title: "Contact Us",
    paragraph: "Email: team@storytimeapp.me",
    number: "VIII",
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
      "These Terms and Conditions (\"Terms\") form a legally binding agreement between you (\"User\") and Storytime (\"Company,\" \"we,\" \"us,\" or \"our\") governing your access to and use of our website, mobile application, and digital content services (collectively, the \"Service\").",
      "By accessing, using, or subscribing to the Service, you confirm that you have read, understood, and agree to be bound by these Terms. If you do not agree, you must not access or use the Service.",
    ],
  },
  {
    heading: "The Service and Age Restrictions",
    index: "II",
    paragraph: [
      "Storytime provides access to a curated digital library of stories, audio, video, and related educational content designed to support literacy and imagination.",
      "You must be at least 18 years old to create an account, make payments, and accept these Terms.",
    ],
  },
  {
    heading: "Subscriptions, Payments, and Free Trials",
    index: "III",
    paragraph: [
      "1.Subscription\nWe offer various subscription plans, including monthly and annual options. Plan details and pricing are displayed at the time of purchase.",
      "2. Automatic Renewal\nAll paid subscriptions automatically renew at the applicable rate unless cancelled before the end of the current billing period.",
      "3. Billing and Cancellation\nSubscription management and cancellations are handled through your App Store or Google Play account.",
    ],
  },
  {
    heading: "Intellectual Property Rights",
    index: "IV",
    paragraph: [
      "All content and materials made available through the Service, including stories, narration, illustrations, graphics, trademarks, and software, are the exclusive property of Storytime or its licensors and are protected by applicable intellectual property laws.",
      "You are granted a limited, non-exclusive, non-transferable license to access and use the Service for personal, non-commercial purposes only. You may not copy, reproduce, distribute, modify, or publicly display any content without prior written consent.",
    ],
  },
  {
    heading: "User Conduct and Account Security",
    index: "V",
    paragraph: [
      "You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.",
      "You agree not to:\n 1. Use the Service for unlawful or unauthorized purposes.\n 2. Share account access beyond the limits of your subscription plan.\n 3. Attempt to copy, scrape, redistribute, or exploit any part of the Service.",
    ],
  },
  {
    heading: "Suspension and Termination",
    index: "VI",
    paragraph:
      "We reserve the right to suspend or terminate your access to the Service, with or without notice, if you violate these Terms, misuse the Service, or fail to meet payment obligations.\nYou may discontinue use of the Service at any time by cancelling your subscription or deleting your account.",
  },
  {
    heading: "Governing Law and Dispute Resolution",
    index: "VII",
    paragraph: [
      "These Terms shall be governed by and construed in accordance with the laws of your Jurisdiction, without regard to conflict of law principles.",
      "Any disputes arising out of or relating to these Terms or the Service shall first be attempted to be resolved through good-faith negotiations and, if unresolved, through binding arbitration in accordance with applicable laws",
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
      "If you have any questions about these terms, please contact us at: \nEmail: team@storytimeapp.me",
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

const subscriptionBenefits = [
  "Unlimited access to a growing library of stories.",
  "Interactive story mode: short quizzes after each story to boost learning.",
  "Pick from soothing, fun voices tailored to you.",
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
  termsAndConditionsData,
  storiesByAgeImages,
};