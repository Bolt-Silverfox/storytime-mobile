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
  parentAccountManagement: [
    {
      q: "What is this app and how does it help my child?",
      a: "The app helps children improve reading and comprehension through stories, short quizzes, and daily challenges. Kids read or listen to stories, answer simple questions, and build skills through consistent practice.",
    },
    {
      q: "What age range is the app designed for?",
      a: "The app is built for children aged 1-12 with stories, quizzes automatically adjusted to match each child's reading level.",
    },
    {
      q: "Do I need a parent account to use the app?",
      a: "Yes. A parent account is required to create child profiles, manage safety settings, and access subscription features.",
    },
    {
      q: "Can I add more than one child?",
      a: "Yes! You can add multiple child profiles and personalize each child's reading level and interests.",
    },
    {
      q: "How do I edit or delete my child's profile?",
      a: "Go to Parent Dashboard → Child Profile → Edit / Delete.",
    },
    {
      q: "Can I monitor my child's activity?",
      a: "Yes. Parents can view reading activity, quiz completion, and engagement patterns through a simple Parent Dashboard.",
    },
  ],
  usingTheApp: [
    {
      q: "How does my child use the app?",
      a: "Your child selects a story, reads or listens, completes a short quiz afterward, and can also try the daily challenge.",
    },
    {
      q: "Can my child use the app without help?",
      a: "Yes. The app is designed to be child-friendly and easy to navigate independently.",
    },
    {
      q: "Can the app be used on more than one device?",
      a: "Yes. Progress syncs across devices so your child can continue where they left off.",
    },
    {
      q: "How long does a typical session take?",
      a: "Most sessions last 5–15 minutes, making it ideal for daily reading habits.",
    },
    {
      q: "What happens if my child skips a day?",
      a: "Nothing bad happens. Daily challenges reset, and children can continue at their own pace.",
    },
  ],
  safety: [
    {
      q: "Can I control what content my child sees?",
      a: `Absolutely, You can set filters by:
  –Age
  –Genre
  –Reading difficulty
  –Story themes`,
    },
    {
      q: "Is the app child-safe?",
      a: "Yes. The app follows child safety laws like COPPA and GDPR-K, and requires parent consent before a child profile is created.",
    },
    {
      q: "Can my child make purchases inside the app?",
      a: "No. All purchases are restricted to the parent section.",
    },
    {
      q: "Can I set time limits?",
      a: "Yes. You can set daily usage limits during onboarding or anytime in your settings.",
    },
  ],
  storiesAndAudio: [
    {
      q: "Are new stories added?",
      a: "We add new stories and illustrations regularly, so the library stays fresh and exciting.",
    },
    {
      q: "What kinds of stories are available?",
      a: "The app includes age-appropriate stories across different themes, as well as AI-generated stories tailored to your child's level.",
    },
    {
      q: "What is AI story generation?",
      a: "AI story generation creates new, original stories based on your child's age and reading level, so content never feels repetitive.",
    },
    {
      q: "Can my child listen instead of reading?",
      a: "Yes. Stories can be read aloud using built-in AI voices, making it accessible for early readers.",
    },
    {
      q: "Can parents record their own voice for stories?",
      a: "Yes. Parents can record their voice so children can listen to familiar, comforting narration anytime.",
    },
    {
      q: "Are quizzes included after every story?",
      a: "Yes. Each story includes a short quiz to help reinforce understanding and comprehension.",
    },
  ],
  subscription: [
    {
      q: "How does the 14-day free trial work?",
      a: "You get full access for 14 days. If you don't cancel before the end of the trial, your plan will renew automatically.",
    },
    {
      q: "How do I cancel my subscription?",
      a: "You can cancel anytime from your App Store / Google Play settings or inside the Parent Dashboard.",
    },
    {
      q: "Will I lose saved stories if I cancel?",
      a: "No. You'll still see your saved stories, but premium ones will be locked until you resubscribe.",
    },
    {
      q: "Is the app free to use?",
      a: "The app offers free access with optional premium features for expanded content and personalization.",
    },
    {
      q: "What does the premium subscription include?",
      a: "Premium unlocks more stories, AI-generated content, voice features, and enhanced progress insights.",
    },
    {
      q: "Can multiple children use one subscription?",
      a: "Yes. One subscription supports multiple child profiles within the same family.",
    },
  ],
  privacy: [
    {
      q: "Is the content safe for children?",
      a: "Yes. All stories and audio are filtered to ensure they are age-appropriate and safe for children.",
    },
    {
      q: "What data does the app collect?",
      a: "Only minimal usage data is collected to personalize content and track progress. No unnecessary personal data is required.",
    },
    {
      q: "Is my child's data secure?",
      a: "Yes. All data is encrypted and stored securely.",
    },
    {
      q: "Does the app follow child privacy laws?",
      a: "Yes. The app complies with COPPA and GDPR to protect children's privacy.",
    },
    {
      q: "Can I delete my child's data?",
      a: "Yes. When you delete a child profile, all related data is permanently removed.",
    },
  ],
  troubleshooting: [
    {
      q: "The app won't load for my child — what do I do?",
      a: "Try restarting the app or reconnecting to the internet. If you're offline, make sure the story was downloaded.",
    },
    {
      q: "Audio isn't playing. How do I fix it?",
      a: "Check your device sound settings and the app's internal volume toggle.",
    },
  ],
};

