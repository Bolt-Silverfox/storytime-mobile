import { AgeGroupType, DisclaimerData } from "./types";

const SUPPORT_EMAIL = "team@storytimeapp.me";

const privacyPolicyData: DisclaimerData = [
  {
    paragraph: [
      "Storytime (“Storytime,” “we,” “us,” or “our”) respects your privacy and is committed to protecting the personal information of families who use our app and services (the “Service”).",
      "This Privacy Policy explains how we collect, use, store, and protect your information.",
    ],
  },
  {
    title: "Information we collect",
    index: 1,
  },
  {
    title: "Information we provide",
    index: 1.1,
    paragraph: [
      "When you use Storytime, we may collect:",
      { text: "Name", index: 1 },
      { text: "Email address", index: 2 },
      { text: "Parent/guardian details", index: 3 },
      "We collect only what is necessary to operate the Service.",
    ],
  },
  {
    title: "Automatically collected information",
    index: 1.2,
    paragraph: [
      "We may automatically collect:",
      { text: "Device type", index: 1 },
      { text: "Operating system", index: 2 },
      { text: "App usage data", index: 3 },
      { text: "Log information", index: 4 },
      { text: "Crash reports", index: 5 },
      { text: "IP address (approximate location)", index: 6 },
      "This helps us improve performance and reliability.",
    ],
  },
  {
    title: "Payment information",
    index: 1.3,
    paragraph: [
      "Payments are processed by third-party providers (e.g., Apple App Store, Google Play).",
      "We do NOT store:",
      { text: "Full card numbers", index: 1 },
      { text: "Bank details", index: 2 },
      { text: "Payment credentials", index: 3 },
    ],
  },
  {
    title: "Children's privacy (COPPA-Aligned)",
    index: 2,
    paragraph: [
      "Storytime is designed for families and may be used by children under parental supervision.",
      "We:",
      { text: "Require parent/guardian involvement", index: 1 },
      { text: "Limit data collection from children", index: 2 },
      { text: "Do not knowingly sell children's data", index: 3 },
      { text: "Allow parents to request deletion", index: 4 },
      "Parents may contact us at:.",
      `${SUPPORT_EMAIL}`,
      "To:",
      {
        text: "Review data",
        index: 1,
      },
      {
        text: "Delete profiles",
        index: 2,
      },
      {
        text: "Withdraw consent",
        index: 3,
      },
    ],
  },
  {
    title: "How we use information",
    index: 3,
    paragraph: [
      "We use your information to:",
      {
        index: 1,
        text: "Provide and personalize stories",
      },
      {
        index: 2,
        text: "Maintain your account",
      },
      {
        index: 3,
        text: "Process subscriptions",
      },
      {
        index: 4,
        text: "Improve the Service",
      },
      {
        index: 5,
        text: "Send important service notifications",
      },
      {
        index: 6,
        text: "Provide customer support",
      },
      {
        index: 7,
        text: "Ensure safety and prevent abuse",
      },
      "We do not sell personal data.",
    ],
  },
  {
    title: "Data sharing",
    index: 4,
    paragraph: [
      "We only share data with:",
      {
        index: 1,
        text: "Payment processors",
      },
      {
        index: 2,
        text: "Cloud hosting providers",
      },
      {
        index: 3,
        text: "Analytics providers",
      },
      {
        index: 4,
        text: "Legal authorities when required",
      },
      "All partners are required to protect your data.",
      "We do not sell or rent user data.",
    ],
  },
  {
    title: "Data retention",
    index: 5,
    paragraph: [
      "We keep data only as long as necessary to:",
      {
        index: 1,
        text: "Provide the Service",
      },
      {
        index: 2,
        text: "Meet legal obligations",
      },
      {
        index: 3,
        text: "Resolve disputes",
      },
      "You may request deletion at any time.",
    ],
  },
  {
    title: "Your rights",
    index: 6,
    paragraph: [
      { index: 1, text: "Access your data" },
      { index: 2, text: "Correct your data" },
      { index: 3, text: "Delete your data" },
      { index: 4, text: "Restrict processing" },
      { index: 5, text: "Withdraw consent" },
      "To exercise rights:",
      `${SUPPORT_EMAIL}`,
    ],
  },
  {
    title: "Security",
    index: 7,
    paragraph: [
      "We use reasonable administrative, technical, and organizational safeguards to protect your data.",
      "However, no system is 100% secure.",
    ],
  },
  {
    title: "International users",
    index: 8,
    paragraph: [
      "Your data may be processed in countries outside your residence. We take steps to ensure appropriate protection.",
    ],
  },
  {
    title: "Changes to this policy",
    index: 9,
    paragraph: [
      "We may update this Privacy Policy periodically.",
      "If changes are material, we will notify users via the app or email.",
    ],
  },
  {
    title: "Contact Us",
    index: 10,
    paragraph: [`${SUPPORT_EMAIL}`],
  },
];

const termsAndConditionsData: DisclaimerData = [
  {
    title: "Introduction and Acceptance",
    paragraph: [
      "Welcome to Storytime (“Storytime,” “we,” “us,” or “our”). These Terms & Conditions (“Terms”) govern your access to and use of the Storytime mobile application, website, and related services (collectively, the “Service”).",
      "By creating an account or using Storytime, you agree to these Terms. If you do not agree, please do not use the Service.",
    ],
  },
  {
    title: "About Storytime",
    index: 1,
    paragraph: [
      "Storytime is a family-focused storytelling platform designed to provide safe, curated, and engaging stories for children and families. Our goal is to make storytelling joyful, calming, and meaningful for users of all ages",
    ],
  },
  {
    title: "Eligibility",
    index: 2,
    paragraph: [
      "You may use Storytime only if:",
      {
        index: 1,
        text: "You are at least 1 year old, or",
      },
      {
        index: 2,
        text: "You are a parent/legal guardian providing consent for a child's use.",
      },
      "Parents and guardians are responsible for supervising children's use of the app.",
    ],
  },
  {
    title: "Account registration",
    index: 3,
  },
  {
    title: "Creating an Account",
    index: 3.1,
    paragraph: [
      "To access certain features, you may need to create an account and provide accurate information.",
      "You agree to:",
      {
        index: 1,
        text: "Provide truthful information",
      },
      {
        index: 2,
        text: "Keep your login credentials secure",
      },
      {
        index: 3,
        text: "Notify us of any unauthorized access",
      },
      "You are responsible for all activities under your account.",
    ],
  },
  {
    title: "Child profiles",
    index: 3.2,
    paragraph: [
      "If Storytime allows multiple child profiles:",
      {
        index: 1,
        text: "You confirm you have legal authority to create profiles for minors.",
      },
      {
        index: 2,
        text: "You are responsible for managing content preferences and controls.",
      },
    ],
  },
  {
    title: "Subscription plans",
    index: 4,
    paragraph: [
      "Storytime offers the following plans:",
      "FREEMIUM PLAN",
      {
        index: 1,
        text: "Users receive 10 free stories upon signup",
      },
      { index: 2, text: "Users receive 1 free story each month thereafter" },
      { index: 3, text: "Features may be limited" },
      "We reserve the right to modify free limits at any time with notice.",
      "PAID PLAN",
      "Monthly Subscription",
      { index: 1, text: "Billed monthly" },
      { index: 2, text: "Auto-renews unless cancelled" },
      "Annual Subscription",
      { index: 1, text: "Billed yearly" },
      { index: 2, text: "Auto-renews unless cancelled" },
      "Paid plans unlock premium features and expanded access.",
    ],
  },
  {
    title: "Billing & Auto-renewal",
    index: 4.1,
    paragraph: [
      "By subscribing, you agree that:",
      {
        index: 1,
        text: "Payment will be charged to your selected payment method",
      },
      {
        index: 2,
        text: "Subscriptions automatically renew unless cancelled before the renewal date",
      },
      { index: 3, text: "Prices may change with prior notice" },
    ],
  },
  {
    title: "Cancellation",
    index: 4.2,
    paragraph: [
      "You may cancel at any time via:",
      { index: 1, text: "Your app store account (Apple/Google), or" },
      { index: 2, text: "Your Storytime account settings" },
      "IMPORTANT",
      { index: 1, text: "Cancellation stops future billing" },
      {
        index: 2,
        text: "Current billing periods are not-refundable unless required by law",
      },
    ],
  },
  {
    title: "Refunds",
    index: 4.3,
    paragraph: [
      "Except where required by law:",
      { index: 1, text: "All purchases are non-refundable" },
      { index: 2, text: "Partial subscription periods are not refunded" },
      "If you believe you were billed in error, contact:",
      `${SUPPORT_EMAIL}`,
    ],
  },
  {
    title: "Acceptable use",
    index: 5,
    paragraph: [
      "You agree NOT to:",
      { index: 1, text: "Misuse the Service" },
      { index: 2, text: "Attempt to reverse engineer the app" },
      { index: 3, text: "Upload harmful or illegal content" },
      { index: 4, text: "Interfere with the platform's security" },
      {
        index: 5,
        text: "Use Storytime for commercial redistribution without permission",
      },
      "We may suspend or terminate accounts that violate these rules.",
    ],
  },
  {
    title: "Content & intellectual property",
    index: 6,
  },
  {
    title: "Our content",
    index: 6.1,
    paragraph: [
      "All stories, audio, designs, and technology in Storytime are owned by us or our licensors and are protected by copyright and intellectual property laws.",
      "You may:",
      { index: 1, text: "Use content for personal, non-commercial use" },
      {
        index: 2,
        text: "Not copy, resell, or redistribute content without permission",
      },
      "We may suspend or terminate accounts that violate these rules.",
    ],
  },
  {
    title: "User generic content (if applicable)",
    index: 6.2,
    paragraph: [
      "If you submit content (e.g, story inputs, names, preferences):",
      { index: 1, text: "You retain ownership of your content" },
      {
        index: 2,
        text: "You grant Storytime a limited license to use it to operate and improve the Service",
      },
      { index: 3, text: "You confirm you have rights to submit the content" },
    ],
  },
  {
    title: "AI Generated stories",
    index: 7,
    paragraph: [
      "Storytime may use AI to generate personalized stories.",
      "You acknowledge that:",
      { index: 1, text: "AI outputs may vary" },
      { index: 2, text: "Stories are generated automatically" },
      {
        index: 3,
        text: "We do not guarantee factual accuracy in fictional content",
      },
      "Storytime is designed for entertainment and educational purposes.",
    ],
  },
  {
    title: "Child safety & parental responsibility",
    index: 8,
    paragraph: [
      "Storytime is built with families in mind and aims to provide age-appropriate content.",
      "However:",
      {
        index: 1,
        text: "Parents/guardians are responsible for supervising usage",
      },
      { index: 2, text: "Parents should review stories for suitability" },
      {
        index: 3,
        text: "Screen time decisions remain the parent's responsibility",
      },
    ],
  },
  {
    title: "Privacy",
    index: 9,
    paragraph: [
      "Your use of Storytime is also governed by our Privacy Policy.",
      "We are committed to protecting family data and using information only as necessary to provide and improve the Service.",
    ],
  },
  {
    title: "Service availability",
    index: 10,
    paragraph: [
      "We strive to keep Storytime available at all times, but we do not guarantee:",
      {
        index: 1,
        text: "Uninterrupted service",
      },
      { index: 2, text: "Error-free performance" },
      {
        index: 3,
        text: "Permanent availability of specific stories or features",
      },
      "We may modify or discontinue features at any time.",
    ],
  },
  {
    title: "Termination",
    index: 11,
    paragraph: [
      "We may suspend or terminate your access if:",
      { index: 1, text: "You violate these Terms" },
      { index: 2, text: "You misuse the platform" },
      { index: 3, text: "Required by law" },
      "You may stop using Storytime at any time by deleting your account.",
    ],
  },
  {
    title: "Limitation of liability",
    index: 12,
    paragraph: [
      "To the maximum extent permitted by law:",
      "Storytime shall not be liable for:",
      { index: 1, text: "Indirect or consequential damages" },
      { index: 2, text: "Loss of data" },
      { index: 3, text: "Service interruptions" },
      { index: 4, text: "AI-generated content outcomes" },
      "Your use of the Service is at your own risk.",
    ],
  },
  {
    title: "Changes to these terms",
    index: 13,
    paragraph: [
      "We may update these Terms from time to time.",
      "If we make material changes:",
      {
        index: 1,
        text: "We will notify users via the app or email",
      },
      { index: 2, text: "Continued use means you accept the updated Terms" },
    ],
  },
  {
    title: "Governing law",
    index: 14,
    paragraph: [
      "These Terms shall be governed by the laws of:",
      "Your residing country",
    ],
  },
  {
    title: "Contact us",
    index: 15,
    paragraph: ["If you have questions about these Terms:", `${SUPPORT_EMAIL}`],
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
