import { AgeGroupType, DisclaimerData } from "./types";

const SUPPORT_EMAIL = "team@storytimeapp.me";

const androidPrivacyPolicyData: DisclaimerData = [
  {
    paragraph: [
      "At Storytime4Kids, we are deeply committed to protecting the privacy of families who use our Services. This Privacy Policy explains how we collect, use, share, and protect information when you use the Storytime4Kids mobile application and website. We comply with the Children's Online Privacy Protection Act (COPPA), the General Data Protection Regulation (GDPR), Google Play data safety requirements.",
    ],
  },
  {
    title: "Overview and Our Commitment",
    index: 1,
    paragraph: [
      "Storytime4Kids is a children's storytelling platform operated for use by parents and guardians on behalf of their children. Accounts are held exclusively by adults, children do not have independent accounts on our platform. We are committed to:",
      {
        text: "Collecting only the minimum information necessary to operate our Services",
        index: 1,
      },
      { text: "Never selling personal data to third parties", index: 2 },
      {
        text: "Never using children's information for advertising  or behavioral profiling",
        index: 3,
      },
      {
        text: "Providing parents with full transparency and control over their data",
        index: 3,
      },
      {
        text: "Complying with all applicable data protection laws worldwide",
        index: 5,
      },
    ],
  },
  {
    title: "Information We Collect",
    index: 2,
  },
  {
    title: "Information You Provide to Us",
    index: 2.1,
    paragraph: [
      "When you create a parent/guardian account, we may collect:",
      { text: "Name (parent/guardian name)", index: 1 },
      { text: "Email address", index: 2 },
      { text: "Password (stored in encrypted form)", index: 3 },
      { text: "Profile preferences and settings", index: 4 },
      "We do not collect names, birthdates, photographs, or any other personally identifiable information from children.",
    ],
  },
  {
    title: "Information Collected Automatically",
    index: 2.2,
    paragraph: [
      "When you use our Services, we may automatically collect:",
      { text: "Device type, model, and operating system version", index: 1 },
      {
        text: "Unique device identifiers (such as advertising ID or device ID)",
        index: 2,
      },
      { text: "App version and usage data", index: 3 },
      { text: "Log data, including access times and IP adresses.", index: 4 },
      {
        text: "Story listening history and reading progress (to enable bookmarks and continue-reading eatures)",
        index: 5,
      },
      { text: "Crash reports and performance diagnostics", index: 6 },
      "This information is collected for the purpose of improving the App, diagnosing technical issues, and ensuring the Service functions correctly.",
    ],
  },
  {
    title: "Information We Do Not Collect",
    index: 2.3,
    paragraph: [
      "We specifically do not collect the following:",
      {
        text: "Children's nams, photos, or direct personal identifiers",
        index: 1,
      },
      {
        text: "Precise geolocation data",
        index: 2,
      },
      { text: "Social media profile data", index: 3 },
      {
        text: "Sensitive personal data such as health, biometric, or financial information beyond what is processed by Google for payment",
        index: 4,
      },
    ],
  },
  {
    title: "How We Use Your Information",
    index: 3,
    paragraph: [
      "We use collected information for the following purposes:",
      {
        text: "to create and manage your parent/guardian account Account Creation and Management:",
        index: 1,
      },
      {
        text: "to provide, personalise, and improve your storytelling experience Service Delivery:",
        index: 2,
      },
      {
        text: "to suggest age-appropriate stories based on general preferences you provide Content Recommendations:",
        index: 3,
      },
      {
        text: "to send important service updates, security notices, and support responses Communications:",
        index: 4,
      },
      {
        text: "to diagnose bugs, improve performance, and enhance the App's features Technical Improvement:",
        index: 5,
      },
      {
        text: "to comply with applicable laws, respond to lawful requests, and enforce our Terms Legal Compliance:",
        index: 6,
      },
      "We do not use your information for targeted advertising. We do not sell, rent, or trade your personal information to third parties for their own marketing purposes.",
    ],
  },
  {
    title: "Children's Privacy - COPPA Compliance",
    index: 4,
    paragraph: [
      "Storytime4Kids does not knowingly collect personal information from children under 13 (or under 16 where applicable under GDPR).",
      "All account registration is performed by parents or guardians aged 18 or older. Children access the App's story content through their parent's account.\nWe do not:",
      { text: "Allow children to create user accounts", index: 1 },
      {
        text: "Knowingly collect personal information directly from children",
        index: 2,
      },
      {
        text: "Use children's usage data for advertising or behavioural profiling",
        index: 3,
      },
      {
        text: "Share children's information with third parties for commercial purposes",
        index: 4,
      },
      `If we discover that we have inadvertently collected personal information from a child without verifiable parental consent, we will delete such information promptly. If you believe we have collected information from your child, please contact us at ${SUPPORT_EMAIL}.`,
      "Parents and guardians have the right to review information collected from their account, request deletion of information, and withdraw consent at any time by contacting us.",
    ],
  },
  {
    title: "Legal Basis for Processing (GDPR)",
    index: 5,
    paragraph: [
      "For users in the European Economic Area, United Kingdom, or other regions where GDPR applies, our legal bases for processing personal data are:",
      {
        index: 1,
        text: "processing required to provide the Services you have requested Contractual Necessity:",
      },
      {
        index: 2,
        text: "improving our Services, preventing fraud, and ensuring platform security Legitimate Interests:",
      },
      {
        index: 3,
        text: "compliance with applicable legal requirements Legal Obligation:",
      },
      {
        index: 4,
        text: "where we have requested and received your explicit consent for specific processing activities Consent:",
      },
      "You have the right to withdraw consent at any time where consent is the basis for processing, without affecting the lawfulness of processing based on consent before its withdrawal.",
    ],
  },
  {
    title: "How We Share Your Information",
    index: 6,
  },
  {
    title: "Service Providers",
    index: 6.1,
    paragraph: [
      "We share information with trusted third-party service providers who assist in operating our Services. These providers are contractually bound to process your data only in accordance with our instructions and applicable data protection law. Categories of service providers include:",
      {
        index: 1,
        text: "Cloud infrastructure and hosting providers",
      },
      {
        index: 2,
        text: "AI voice generation and content delivery technology providers",
      },
      {
        index: 3,
        text: "Analytics providers (using anonymised or aggregated data only)",
      },
      {
        index: 3,
        text: "Customer support tools",
      },
    ],
  },
  {
    title: "Platform Providers",
    index: 6.2,
    paragraph: [
      "Google LLC. process payment information for purchases made through it’s app store. Their handling of such information is governed by their own privacy policies, not ours.",
    ],
  },
  {
    title: "Legal Requirements",
    index: 6.3,
    paragraph: [
      "We may disclose information when we believe in good faith that disclosure is necessary to comply with applicable law, respond to legal process, protect the rights or safety of our users or the public, or enforce our Terms.",
    ],
  },
  {
    title: "Business Transfers",
    index: 6.4,
    paragraph: [
      "In the event of a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred to the acquiring entity. We will provide notice before your information becomes subject to a different privacy policy.",
    ],
  },
  {
    title: "We Do Not Sell Data",
    index: 6.5,
    paragraph: [
      "We do not sell, rent, or otherwise commercially disclose your personal information or your child's usage data to any third party.",
    ],
  },
  {
    title: "Data Retention",
    index: 7,
    paragraph: [
      "We retain your personal information for as long as your account is active or as necessary to provide our Services. Specifically:",
      {
        index: 1,
        text: "Account information is retained for the duration of your account and deleted within 30 days of account deletion request",
      },
      {
        index: 2,
        text: "Usage and analytics data may be retained in anonymised or aggregated form for up to 24 months for service improvement purposes",
      },
      {
        index: 3,
        text: "Legal and compliance records may be retained for longer periods as required by applicable law",
      },
      "You may request deletion of your account and associated data at any time. See Section 10 (Your Rights) for details.",
    ],
  },
  {
    title: "Data Security",
    index: 8,
    paragraph: [
      "We implement appropriate technical and organisational security measures to protect your information against unauthorised access, alteration, disclosure, or destruction. Our security measures include:",
      {
        index: 1,
        text: "Encryption of data in transit using industry-standard TLS/SSL protocols",
      },
      {
        index: 2,
        text: "Encryption of passwords and sensitive account data at rest",
      },
      {
        index: 3,
        text: "Regular security assessments and vulnerability testing",
      },
      {
        index: 4,
        text: "Access controls limiting employee access to personal data on a need-to-know basis",
      },
      {
        index: 5,
        text: "Incident response procedures for managing data breaches",
      },
      "While we take reasonable precautions, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security of your information.",
      "In the event of a data breach that poses a risk to your rights and freedoms, we will notify you and applicable regulatory authorities as required by law.",
    ],
  },
  {
    title: "Cookies and Tracking Technologies",
    index: 9,
    paragraph: [
      "Our App may use limited tracking technologies such as analytics SDKs to understand how users interact with the Services. We do not use tracking technologies for advertising or cross-app tracking of children.",
      "On our website (storytimeapp.me), we may use cookies necessary for the website to function, as well as analytics cookies. You can manage cookie preferences through your browser settings.",
    ],
  },
  {
    title: "Your Rights",
    index: 10,
    paragraph: [
      "Depending on your location, you may have the following rights regarding your personal information:",
      {
        index: 1,
        text: "to request a copy of the personal data we hold about you Right of Access:",
      },
      {
        index: 2,
        text: "to request correction of inaccurate or incomplete data Right to Rectification:",
      },
      {
        index: 3,
        text: "to request deletion of your personal data Right to Erasure:",
      },
      {
        index: 4,
        text: "to request that we limit the processing of your data in certain circumstances Right to Restriction:",
      },
      {
        index: 5,
        text: "to receive your data in a structured, machine-readable format Right to Portability:",
      },
      {
        index: 6,
        text: "to object to processing based on legitimate interests Right to Object:",
      },
      {
        index: 7,
        text: "to withdraw consent at any time where consent is the basis for processing Right to Withdraw Consent:",
      },
      `To exercise any of these rights, please contact us at ${SUPPORT_EMAIL}. We will respond to your request within 30 days (or as required by applicable law). We may need to verify your identity before processing your request.`,
      "If you are a California resident, you have additional rights under the CCPA, including the right to know about personal information sold or disclosed, the right to opt out of the sale of personal information, and the right to non-discrimination for exercising your CCPA rights.",
    ],
  },
  {
    title: "International Data Transfers",
    index: 11,
    paragraph: [
      "Your information may be processed and stored in countries other than your own. We ensure that any international transfers of personal data comply with applicable data protection laws, including through the use of appropriate safeguards such as Standard Contractual Clauses where required.",
    ],
  },
  {
    title: "How We Share Your Information",
    index: 12,
  },
  {
    title: "Google Play Store",
    index: 12.1,
    paragraph: [
      "In compliance with Google Play's Developer Policy:",
      {
        index: 1,
        text: "We provide accurate disclosures in our Google Play Data Safety section consistent with this Privacy Policy",
      },
      {
        index: 2,
        text: "We handle user data in accordance with Google's Families Policy, given our app targets children's content",
      },
      {
        index: 3,
        text: "We do not integrate advertising SDKs that collect data for personalised advertising in the children's experience",
      },
      {
        index: 4,
        text: "Subscription management and cancellation is available through Google Play account settings",
      },
    ],
  },
  {
    title: "Third-Party Links and Services",
    index: 13,
    paragraph: [
      "Our App may contain links to third-party websites or services. We are not responsible for the privacy practices of those third parties. We encourage you to review the privacy policies of any third-party services you access through our App.",
    ],
  },
  {
    title: "Changes to This Privacy Policy",
    index: 14,
    paragraph: [
      "We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or for other reasons. We will notify you of material changes by updating the 'Last Updated' date and, where appropriate, by sending an in-app notification or email.",
      "If we make material changes that affect how we handle children's information, we will provide prominent notice and, where required by COPPA or other applicable law, seek parental consent before implementing such changes.",
    ],
  },
  {
    title: "Contact US and Data Protection Inquiries",
    index: 15,
    paragraph: [
      "If you have any questions, concerns, or complaints about this Privacy Policy or our data practices, please contact us:",
    ],
  },
  {
    title: "Storytime4Kids — Privacy Team",
    paragraph: [
      `Website: storytimeapp.me\nEmail: ${SUPPORT_EMAIL}\nContact Page: storytimeapp.me/contact-us`,
      "If you are located in the European Economic Area and have concerns about our data practices that we have not resolved satisfactorily, you have the right to lodge a complaint with your local data protection authority.",
      "We are committed to working with you to resolve any privacy concerns promptly and fairly.",
    ],
  },
];
const iosPrivacyPolicyData: DisclaimerData = [
  {
    paragraph: [
      "At Storytime4Kids, we are deeply committed to protecting the privacy of families who use our Services. This Privacy Policy explains how we collect, use, share, and protect information when you use the Storytime4Kids mobile application and website. We comply with the Children's Online Privacy Protection Act (COPPA), the General Data Protection Regulation (GDPR), Apple App Store privacy requirements data safety requirements.",
    ],
  },
  {
    title: "Overview and Our Commitment",
    index: 1,
    paragraph: [
      "Storytime4Kids is a children's storytelling platform operated for use by parents and guardians on behalf of their children. Accounts are held exclusively by adults, children do not have independent accounts on our platform. We are committed to:",
      {
        text: "Collecting only the minimum information necessary to operate our Services",
        index: 1,
      },
      { text: "Never selling personal data to third parties", index: 2 },
      {
        text: "Never using children's information for advertising  or behavioral profiling",
        index: 3,
      },
      {
        text: "Providing parents with full transparency and control over their data",
        index: 3,
      },
      {
        text: "Complying with all applicable data protection laws worldwide",
        index: 5,
      },
    ],
  },
  {
    title: "Information We Collect",
    index: 2,
  },
  {
    title: "Information You Provide to Us",
    index: 2.1,
    paragraph: [
      "When you create a parent/guardian account, we may collect:",
      { text: "Name (parent/guardian name)", index: 1 },
      { text: "Email address", index: 2 },
      { text: "Password (stored in encrypted form)", index: 3 },
      { text: "Profile preferences and settings", index: 4 },
      "We do not collect names, birthdates, photographs, or any other personally identifiable information from children.",
    ],
  },
  {
    title: "Information Collected Automatically",
    index: 2.2,
    paragraph: [
      "When you use our Services, we may automatically collect:",
      { text: "Device type, model, and operating system version", index: 1 },
      {
        text: "Unique device identifiers (such as advertising ID or device ID)",
        index: 2,
      },
      { text: "App version and usage data", index: 3 },
      { text: "Log data, including access times and IP adresses.", index: 4 },
      {
        text: "Story listening history and reading progress (to enable bookmarks and continue-reading eatures)",
        index: 5,
      },
      { text: "Crash reports and performance diagnostics", index: 6 },
      "This information is collected for the purpose of improving the App, diagnosing technical issues, and ensuring the Service functions correctly.",
    ],
  },
  {
    title: "Information We Do Not Collect",
    index: 2.3,
    paragraph: [
      "We specifically do not collect the following:",
      {
        text: "Children's nams, photos, or direct personal identifiers",
        index: 1,
      },
      {
        text: "Precise geolocation data",
        index: 2,
      },
      { text: "Social media profile data", index: 3 },
      {
        text: "Sensitive personal data such as health, biometric, or financial information beyond what is processed by Apple for payment",
        index: 4,
      },
    ],
  },
  {
    title: "How We Use Your Information",
    index: 3,
    paragraph: [
      "We use collected information for the following purposes:",
      {
        text: "to create and manage your parent/guardian account Account Creation and Management:",
        index: 1,
      },
      {
        text: "to provide, personalise, and improve your storytelling experience Service Delivery:",
        index: 2,
      },
      {
        text: "to suggest age-appropriate stories based on general preferences you provide Content Recommendations:",
        index: 3,
      },
      {
        text: "to send important service updates, security notices, and support responses Communications:",
        index: 4,
      },
      {
        text: "to diagnose bugs, improve performance, and enhance the App's features Technical Improvement:",
        index: 5,
      },
      {
        text: "to comply with applicable laws, respond to lawful requests, and enforce our Terms Legal Compliance:",
        index: 6,
      },
      "We do not use your information for targeted advertising. We do not sell, rent, or trade your personal information to third parties for their own marketing purposes.",
    ],
  },
  {
    title: "Children's Privacy - COPPA Compliance",
    index: 4,
    paragraph: [
      "Storytime4Kids does not knowingly collect personal information from children under 13 (or under 16 where applicable under GDPR).",
      "All account registration is performed by parents or guardians aged 18 or older. Children access the App's story content through their parent's account.\nWe do not:",
      { text: "Allow children to create user accounts", index: 1 },
      {
        text: "Knowingly collect personal information directly from children",
        index: 2,
      },
      {
        text: "Use children's usage data for advertising or behavioural profiling",
        index: 3,
      },
      {
        text: "Share children's information with third parties for commercial purposes",
        index: 4,
      },
      `If we discover that we have inadvertently collected personal information from a child without verifiable parental consent, we will delete such information promptly. If you believe we have collected information from your child, please contact us at ${SUPPORT_EMAIL}.`,
      "Parents and guardians have the right to review information collected from their account, request deletion of information, and withdraw consent at any time by contacting us.",
    ],
  },
  {
    title: "Legal Basis for Processing (GDPR)",
    index: 5,
    paragraph: [
      "For users in the European Economic Area, United Kingdom, or other regions where GDPR applies, our legal bases for processing personal data are:",
      {
        index: 1,
        text: "processing required to provide the Services you have requested Contractual Necessity:",
      },
      {
        index: 2,
        text: "improving our Services, preventing fraud, and ensuring platform security Legitimate Interests:",
      },
      {
        index: 3,
        text: "compliance with applicable legal requirements Legal Obligation:",
      },
      {
        index: 4,
        text: "where we have requested and received your explicit consent for specific processing activities Consent:",
      },
      "You have the right to withdraw consent at any time where consent is the basis for processing, without affecting the lawfulness of processing based on consent before its withdrawal.",
    ],
  },
  {
    title: "How We Share Your Information",
    index: 6,
  },
  {
    title: "Service Providers",
    index: 6.1,
    paragraph: [
      "We share information with trusted third-party service providers who assist in operating our Services. These providers are contractually bound to process your data only in accordance with our instructions and applicable data protection law. Categories of service providers include:",
      {
        index: 1,
        text: "Cloud infrastructure and hosting providers",
      },
      {
        index: 2,
        text: "AI voice generation and content delivery technology providers",
      },
      {
        index: 3,
        text: "Analytics providers (using anonymised or aggregated data only)",
      },
      {
        index: 3,
        text: "Customer support tools",
      },
    ],
  },
  {
    title: "Platform Providers",
    index: 6.2,
    paragraph: [
      "Apple LLC. process payment information for purchases made through it’s respective app store. Their handling of such information is governed by their own privacy policies, not ours.",
    ],
  },
  {
    title: "Legal Requirements",
    index: 6.3,
    paragraph: [
      "We may disclose information when we believe in good faith that disclosure is necessary to comply with applicable law, respond to legal process, protect the rights or safety of our users or the public, or enforce our Terms.",
    ],
  },
  {
    title: "Business Transfers",
    index: 6.4,
    paragraph: [
      "In the event of a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred to the acquiring entity. We will provide notice before your information becomes subject to a different privacy policy.",
    ],
  },
  {
    title: "We Do Not Sell Data",
    index: 6.5,
    paragraph: [
      "We do not sell, rent, or otherwise commercially disclose your personal information or your child's usage data to any third party.",
    ],
  },
  {
    title: "Data Retention",
    index: 7,
    paragraph: [
      "We retain your personal information for as long as your account is active or as necessary to provide our Services. Specifically:",
      {
        index: 1,
        text: "Account information is retained for the duration of your account and deleted within 30 days of account deletion request",
      },
      {
        index: 2,
        text: "Usage and analytics data may be retained in anonymised or aggregated form for up to 24 months for service improvement purposes",
      },
      {
        index: 3,
        text: "Legal and compliance records may be retained for longer periods as required by applicable law",
      },
      "You may request deletion of your account and associated data at any time. See Section 10 (Your Rights) for details.",
    ],
  },
  {
    title: "Data Security",
    index: 8,
    paragraph: [
      "We implement appropriate technical and organisational security measures to protect your information against unauthorised access, alteration, disclosure, or destruction. Our security measures include:",
      {
        index: 1,
        text: "Encryption of data in transit using industry-standard TLS/SSL protocols",
      },
      {
        index: 2,
        text: "Encryption of passwords and sensitive account data at rest",
      },
      {
        index: 3,
        text: "Regular security assessments and vulnerability testing",
      },
      {
        index: 4,
        text: "Access controls limiting employee access to personal data on a need-to-know basis",
      },
      {
        index: 5,
        text: "Incident response procedures for managing data breaches",
      },
      "While we take reasonable precautions, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security of your information.",
      "In the event of a data breach that poses a risk to your rights and freedoms, we will notify you and applicable regulatory authorities as required by law.",
    ],
  },
  {
    title: "Cookies and Tracking Technologies",
    index: 9,
    paragraph: [
      "Our App may use limited tracking technologies such as analytics SDKs to understand how users interact with the Services. We do not use tracking technologies for advertising or cross-app tracking of children.",
      "On our website (storytimeapp.me), we may use cookies necessary for the website to function, as well as analytics cookies. You can manage cookie preferences through your browser settings.",
      "We comply with Apple's App Tracking Transparency (ATT) framework requirements. If our App uses your device's advertising identifier, we will request your permission through Apple's ATT prompt before doing so.",
    ],
  },
  {
    title: "Your Rights",
    index: 10,
    paragraph: [
      "Depending on your location, you may have the following rights regarding your personal information:",
      {
        index: 1,
        text: "to request a copy of the personal data we hold about you Right of Access:",
      },
      {
        index: 2,
        text: "to request correction of inaccurate or incomplete data Right to Rectification:",
      },
      {
        index: 3,
        text: "to request deletion of your personal data Right to Erasure:",
      },
      {
        index: 4,
        text: "to request that we limit the processing of your data in certain circumstances Right to Restriction:",
      },
      {
        index: 5,
        text: "to receive your data in a structured, machine-readable format Right to Portability:",
      },
      {
        index: 6,
        text: "to object to processing based on legitimate interests Right to Object:",
      },
      {
        index: 7,
        text: "to withdraw consent at any time where consent is the basis for processing Right to Withdraw Consent:",
      },
      `To exercise any of these rights, please contact us at ${SUPPORT_EMAIL}. We will respond to your request within 30 days (or as required by applicable law). We may need to verify your identity before processing your request.`,
      "If you are a California resident, you have additional rights under the CCPA, including the right to know about personal information sold or disclosed, the right to opt out of the sale of personal information, and the right to non-discrimination for exercising your CCPA rights.",
    ],
  },
  {
    title: "International Data Transfers",
    index: 11,
    paragraph: [
      "Your information may be processed and stored in countries other than your own. We ensure that any international transfers of personal data comply with applicable data protection laws, including through the use of appropriate safeguards such as Standard Contractual Clauses where required.",
    ],
  },
  {
    title: "How We Share Your Information",
    index: 12,
  },
  {
    title: "Apple Play Store",
    index: 12.1,
    paragraph: [
      "In compliance with Apple's App Store Review Guidelines:",
      {
        index: 1,
        text: "We provide this Privacy Policy within the App and on our App Store listing",
      },
      {
        index: 2,
        text: "We request only permissions necessary for the App's functionality",
      },
      {
        index: 3,
        text: "We comply with Apple's data use and sharing requirements",
      },
      {
        index: 4,
        text: "We support Apple's App Tracking Transparency framework",
      },
      {
        index: 5,
        text: "Subscription management and cancellation is available through Apple ID Account Settings",
      },
    ],
  },
  {
    title: "Third-Party Links and Services",
    index: 13,
    paragraph: [
      "Our App may contain links to third-party websites or services. We are not responsible for the privacy practices of those third parties. We encourage you to review the privacy policies of any third-party services you access through our App.",
    ],
  },
  {
    title: "Changes to This Privacy Policy",
    index: 14,
    paragraph: [
      "We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or for other reasons. We will notify you of material changes by updating the 'Last Updated' date and, where appropriate, by sending an in-app notification or email.",
      "If we make material changes that affect how we handle children's information, we will provide prominent notice and, where required by COPPA or other applicable law, seek parental consent before implementing such changes.",
    ],
  },
  {
    title: "Contact US and Data Protection Inquiries",
    index: 15,
    paragraph: [
      "If you have any questions, concerns, or complaints about this Privacy Policy or our data practices, please contact us:",
    ],
  },
  {
    title: "Storytime4Kids — Privacy Team",
    paragraph: [
      `Website: storytimeapp.me\nEmail: ${SUPPORT_EMAIL}\nContact Page: storytimeapp.me/contact-us`,
      "If you are located in the European Economic Area and have concerns about our data practices that we have not resolved satisfactorily, you have the right to lodge a complaint with your local data protection authority.",
      "We are committed to working with you to resolve any privacy concerns promptly and fairly.",
    ],
  },
];

const iosTermsAndConditionsData: DisclaimerData = [
  {
    paragraph: [
      "IMPORTANT: Please read these Terms and Conditions carefully before downloading or using the Storytime4Kids application. By creating an account or using our Services, you confirm that you are at least 18 years of age and agree to be bound by these Terms on behalf of yourself and any children in your care who use the application.",
    ],
  },
  {
    title: "Acceptance of Terms",
    index: 1,
    paragraph: [
      "These Terms and Conditions ('Terms') constitute a legally binding agreement between you ('User', 'Parent', or 'Guardian') and Storytime4Kids ('Company', 'we', 'us', or 'our') governing your access to and use of the Storytime4Kids mobile application ('App'), website at storytimeapp.me, and all related services (collectively, the 'Services').",
      "By accessing or using our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, you must not access or use our Services.",
      "These Terms apply to all users of the Services, including parents, guardians, and any other adults who create accounts to manage children's access to the App.",
    ],
  },
  {
    title: "Description of Services",
    index: 2,
    paragraph: [
      "Storytime4Kids provides an interactive storytelling platform designed for children, operated exclusively through adult parent or guardian accounts. Our Services include:",
      {
        index: 1,
        text: "A curated library of 5,000+ age-appropriate stories across genres including Adventure, Mystery, Comedy, Fantasy, Sci-Fi, and Action",
      },
      {
        index: 2,
        text: "AI-powered voice narration with expressive, natural tones",
      },
      {
        index: 3,
        text: "Interactive and passive listening modes",
      },
      {
        index: 4,
        text: "Read-along functionality with AI integration",
      },
      {
        index: 5,
        text: "Parental controls for content selection and management",
      },
      {
        index: 6,
        text: "Weekly updated story library with new content",
      },
      "Our Services are designed for use by children under direct parental or guardian supervision. Account registration and management is exclusively available to adults aged 18 and over.",
    ],
  },
  {
    title: "Eligibility and Account Registration",
    index: 3,
  },
  {
    title: "Age Requirement",
    index: 3.1,
    paragraph: [
      "You must be at least 18 years of age to create an account and use our Services. By registering, you represent and warrant that you are at least 18 years old. We do not knowingly permit individuals under 18 to create accounts.",
    ],
  },
  {
    title: "Children's Use",
    index: 3.2,
    paragraph: [
      "The App's content is designed for children; however, account creation and management is restricted to adults. Children do not have independent accounts. Parents and guardians are responsible for supervising their children's use of the App and for ensuring that use is appropriate for their child's age and maturity level.",
    ],
  },
  {
    title: "Account Accuracy",
    index: 3.3,
    paragraph: [
      "You agree to provide accurate, current, and complete information when creating your account and to keep this information up to date. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.",
    ],
  },
  {
    title: "Account Security",
    index: 3.4,
    paragraph: [
      `You must immediately notify us at ${SUPPORT_EMAIL} of any unauthorized access to or use of your account. We are not liable for any loss or damage arising from your failure to safeguard your account credentials.`,
    ],
  },
  {
    title: "Subscription, Payments and Billing",
    index: 4,
  },
  {
    title: "Free and Paid Tiers",
    index: 4.1,
    paragraph: [
      "Storytime4Kids may offer both free and premium subscription plans. Details of current pricing, features, and billing cycles are displayed within the App and on our website. We reserve the right to modify our pricing and features at any time with reasonable notice.",
    ],
  },
  {
    title: "In-App Purchases (Apple App Store)",
    index: 4.2,
    paragraph: [
      "If you download the App via the Apple App Store, all purchases, subscriptions, and billing are processed by Apple Inc. in accordance with Apple's terms and conditions. Apple's payment processing policies govern all transactions made through the App Store. We do not have access to your payment card information for App Store purchases.",
      "Subscriptions purchased through the App Store automatically renew unless auto-renewal is turned off at least 24 hours before the end of the current subscription period. You can manage or cancel subscriptions in your Apple ID Account Settings.",
    ],
  },
  {
    title: "Refunds",
    index: 4.3,
    paragraph: [
      `Refund requests for App Store purchases must be directed to Apple. We are unable to process refunds for purchases made through third-party platforms. For direct purchases (if applicable), please contact us at ${SUPPORT_EMAIL}`,
    ],
  },
  { title: "Acceptable Use", index: 5 },
  {
    title: "Permitted use",
    index: 5.1,
    paragraph: [
      "You may use our Services solely for lawful, personal, non-commercial purposes in accordance with these Terms. You agree to use the App responsibly and in a manner that does not harm other users or the integrity of the platform.",
    ],
  },
  {
    title: "Prohibited Conduct",
    index: 5.2,
    paragraph: [
      "You agree NOT to:",
      {
        index: 1,
        text: "Use the Services for any unlawful purpose or in violation of any applicable laws or regulations",
      },
      {
        index: 2,
        text: "Attempt to reverse-engineer, decompile, disassemble, or otherwise derive the source code of the App",
      },
      {
        index: 3,
        text: "Circumvent, disable, or interfere with security features of the App",
      },
      {
        index: 4,
        text: "Transmit any harmful, offensive, abusive, or objectionable content",
      },
      {
        index: 5,
        text: "Impersonate any person or entity or misrepresent your affiliation with any person or entity",
      },
      {
        index: 6,
        text: "Scrape, crawl, or systematically collect data from the App without prior written consent",
      },
      {
        index: 7,
        text: "Use automated tools, bots, or scripts to access or interact with the Services",
      },
      {
        index: 8,
        text: "Share, sublicense, sell, or commercially exploit any content from our Services",
      },
      {
        index: 9,
        text: "Attempt to gain unauthorized access to any part of the Services or related systems",
      },
    ],
  },
  {
    title: "Intellectual Property",
    index: 6,
  },
  {
    title: "Our content",
    index: 6.1,
    paragraph: [
      "All content within the Storytime4Kids App, including but not limited to stories, text, audio recordings, AI-generated voices, illustrations, graphics, logos, user interface elements, and software code, is owned by or licensed to Storytime4Kids and is protected by copyright, trademark, and other applicable intellectual property laws.",
    ],
  },
  {
    title: "Limited License",
    index: 6.2,
    paragraph: [
      "We grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Services for personal, non-commercial purposes on devices that you own or control. This license does not include the right to copy, modify, distribute, sell, or create derivative works from our content.",
    ],
  },
  {
    title: "Restrictions",
    index: 6.3,
    paragraph: [
      "You may not reproduce, distribute, publicly display, or create derivative works from any content within the App without our prior written permission. Any unauthorized use of our intellectual property may result in termination of your account and legal action.",
    ],
  },
  {
    title: "Privacy and Children's Data",
    index: 7,
    paragraph: [
      "The privacy of children is of paramount importance to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. Our Privacy Policy is fully compliant with:",
      {
        index: 1,
        text: "The Children's Online Privacy Protection Act (COPPA)",
      },
      {
        index: 2,
        text: "The General Data Protection Regulation (GDPR) and UK GDPR",
      },
      {
        index: 3,
        text: "The California Consumer Privacy Act (CCPA)",
      },
      {
        index: 4,
        text: "Apple App Store Review Guidelines regarding privacy",
      },
      "We do not create accounts for children and do not knowingly collect personal data directly from children. All data collection pertains to parent/guardian account holders only. Please review our Privacy Policy at storytimeapp.me/privacy-policy for complete details.",
    ],
  },
  {
    title: "Parental Controls and Responsibilities",
    index: 8,
    paragraph: [
      "As a parent or guardian using our Services, you accept full responsibility for:",
      {
        index: 1,
        text: "Supervising your child's access to and use of the App",
      },
      {
        index: 2,
        text: "Ensuring the App content is age-appropriate for your specific child",
      },
      {
        index: 3,
        text: "Managing screen time and usage in a manner appropriate for your child's wellbeing",
      },
      {
        index: 4,
        text: "Maintaining the security of your account and preventing unauthorized access by your child to account management features",
      },
      {
        index: 5,
        text: "Reviewing and managing the parental control settings provided within the App",
      },
      "We provide parental controls to assist you in managing your child's experience, but these controls are supplementary tools, ultimate supervision responsibility remains with you as the parent or guardian.",
    ],
  },
  {
    title: "Third-Party Services and Links",
    index: 9,
    paragraph: [
      "Our Services may integrate with or link to third-party services. These include, but may not be limited to, Apple App Store and third-party AI voice generation technology. We are not responsible for the content, privacy practices, or terms of any third-party services. Your use of third-party services is at your own risk and is governed by those services' respective terms.",
    ],
  },
  {
    title: "Disclaimers and Limitation of Liability",
    index: 10,
  },
  {
    title: "Disclaimer of Warranties",
    index: 10.1,
    paragraph: [
      "THE SERVICES ARE PROVIDED ON AN 'AS IS' AND 'AS AVAILABLE' BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, WE DISCLAIM ALL WARRANTIES, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.",
      "We do not warrant that the Services will be uninterrupted, error-free, or free of viruses or other harmful components. We make no warranty regarding the accuracy, completeness, or reliability of any content within the App.",
    ],
  },
  {
    title: "Limitation of Liability",
    index: 10.2,
    paragraph: [
      "TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, STORYTIME4KIDS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF, OR INABILITY TO USE, THE SERVICES. OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS SHALL NOT EXCEED THE AMOUNT YOU PAID TO US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.",
    ],
  },
  {
    title: "Apple Specific Disclaimer",
    index: 10.3,
    paragraph: [
      "In accordance with Apple App Store requirements, we acknowledge that Apple Inc. are not parties to these Terms and bear no responsibility or liability with respect to the Services. Any claims relating to the Services must be directed to us, not to Apple.",
    ],
  },
  {
    title: "Indemnification",
    index: 11,
    paragraph: [
      "You agree to indemnify, defend, and hold harmless Storytime4Kids, its affiliates, officers, directors, employees, and agents from any claims, liabilities, damages, losses, or expenses (including reasonable legal fees) arising from your use of the Services, your violation of these Terms, or your violation of any rights of another party.",
    ],
  },
  {
    title: "Termination",
    index: 12,
  },
  {
    title: "By You",
    index: 12.1,
    paragraph: [
      `You may terminate your account at any time by contacting us at ${SUPPORT_EMAIL} or by using the account deletion feature within the App. Termination does not entitle you to a refund of any subscription fees already paid.`,
    ],
  },
  {
    title: "By Us",
    index: 12.2,
    paragraph: [
      "We reserve the right to suspend or terminate your account and access to the Services, without prior notice, if we determine that you have violated these Terms, engaged in fraudulent activity, or if required by applicable law.",
    ],
  },
  {
    title: "Effect of Termination",
    index: 12.3,
    paragraph: [
      "Upon termination, your license to use the Services ends immediately. We will handle your data in accordance with our Privacy Policy and applicable law. Sections of these Terms that by their nature should survive termination shall continue to apply.",
    ],
  },
  {
    title: "Governing Law and Dispute Resolution",
    index: 13,
    paragraph: [
      "These Terms shall be governed by and construed in accordance with applicable law. Any disputes arising under these Terms shall first be attempted to be resolved through good-faith negotiation. If we cannot resolve a dispute informally, you agree that disputes will be resolved through binding arbitration or the courts of competent jurisdiction, as applicable in your region.\nNothing in this section limits your rights to pursue claims with applicable consumer protection authorities or to seek emergency injunctive relief from courts.",
    ],
  },
  {
    title: "Changes to These Terms",
    index: 14,
    paragraph: [
      "We reserve the right to update or modify these Terms at any time. We will notify you of material changes by updating the 'Last Updated' date at the top of this document and, where appropriate, by sending you an in-app notification or email. Your continued use of the Services after changes become effective constitutes your acceptance of the revised Terms.",
      "We recommend reviewing these Terms periodically to stay informed of any updates.",
    ],
  },
  {
    title: "Severability and Entire Agreement",
    index: 15,
    paragraph: [
      "If any provision of these Terms is found to be unenforceable or invalid, that provision shall be modified to the minimum extent necessary to make it enforceable, and all remaining provisions shall continue in full force and effect..",
      "These Terms, together with our Privacy Policy, constitute the entire agreement between you and Storytime4Kids regarding the Services and supersede all prior agreements and understandings.",
    ],
  },

  {
    title: "Contact information",
    index: 16,
    paragraph: [
      "If you have any questions, concerns, or requests regarding these Terms, please contact us at:",
      "Storytime4Kids",
      `Website: storytimeapp.me\nEmail: ${SUPPORT_EMAIL} \nContact Page: storytimeapp.me/contact-us`,
      "We will endeavor to respond to all inquiries within 5 business days.",
    ],
  },
];
const androidTermsAndConditionsData: DisclaimerData = [
  {
    paragraph: [
      "IMPORTANT: Please read these Terms and Conditions carefully before downloading or using the Storytime4Kids application. By creating an account or using our Services, you confirm that you are at least 18 years of age and agree to be bound by these Terms on behalf of yourself and any children in your care who use the application.",
    ],
  },
  {
    title: "Acceptance of Terms",
    index: 1,
    paragraph: [
      "These Terms and Conditions ('Terms') constitute a legally binding agreement between you ('User', 'Parent', or 'Guardian') and Storytime4Kids ('Company', 'we', 'us', or 'our') governing your access to and use of the Storytime4Kids mobile application ('App'), website at storytimeapp.me, and all related services (collectively, the 'Services').",
      "By accessing or using our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, you must not access or use our Services.",
      "These Terms apply to all users of the Services, including parents, guardians, and any other adults who create accounts to manage children's access to the App.",
    ],
  },
  {
    title: "Description of Services",
    index: 2,
    paragraph: [
      "Storytime4Kids provides an interactive storytelling platform designed for children, operated exclusively through adult parent or guardian accounts. Our Services include:",
      {
        index: 1,
        text: "A curated library of 5,000+ age-appropriate stories across genres including Adventure, Mystery, Comedy, Fantasy, Sci-Fi, and Action",
      },
      {
        index: 2,
        text: "AI-powered voice narration with expressive, natural tones",
      },
      {
        index: 3,
        text: "Interactive and passive listening modes",
      },
      {
        index: 4,
        text: "Read-along functionality with AI integration",
      },
      {
        index: 5,
        text: "Parental controls for content selection and management",
      },
      {
        index: 6,
        text: "Weekly updated story library with new content",
      },
      "Our Services are designed for use by children under direct parental or guardian supervision. Account registration and management is exclusively available to adults aged 18 and over.",
    ],
  },
  {
    title: "Eligibility and Account Registration",
    index: 3,
  },
  {
    title: "Age Requirement",
    index: 3.1,
    paragraph: [
      "You must be at least 18 years of age to create an account and use our Services. By registering, you represent and warrant that you are at least 18 years old. We do not knowingly permit individuals under 18 to create accounts.",
    ],
  },
  {
    title: "Children's Use",
    index: 3.2,
    paragraph: [
      "The App's content is designed for children; however, account creation and management is restricted to adults. Children do not have independent accounts. Parents and guardians are responsible for supervising their children's use of the App and for ensuring that use is appropriate for their child's age and maturity level.",
    ],
  },
  {
    title: "Account Accuracy",
    index: 3.3,
    paragraph: [
      "You agree to provide accurate, current, and complete information when creating your account and to keep this information up to date. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.",
    ],
  },
  {
    title: "Account Security",
    index: 3.4,
    paragraph: [
      `You must immediately notify us at ${SUPPORT_EMAIL} of any unauthorized access to or use of your account. We are not liable for any loss or damage arising from your failure to safeguard your account credentials.`,
    ],
  },
  {
    title: "Subscription, Payments and Billing",
    index: 4,
  },
  {
    title: "Free and Paid Tiers",
    index: 4.1,
    paragraph: [
      "Storytime4Kids may offer both free and premium subscription plans. Details of current pricing, features, and billing cycles are displayed within the App and on our website. We reserve the right to modify our pricing and features at any time with reasonable notice.",
    ],
  },
  {
    title: "In-App Purchases (Google App Store)",
    index: 4.2,
    paragraph: [
      "If you download the App via the Google Play Store, all purchases, subscriptions, and billing are processed by Google LLC in accordance with Google Play's terms of service. Subscriptions purchased through Google Play automatically renew unless cancelled at least 24 hours before the renewal date. You can manage subscriptions in your Google Play account settings.",
    ],
  },
  {
    title: "Refunds",
    index: 4.3,
    paragraph: [
      `Refund requests for Google Play purchases must be directed to Google. We are unable to process refunds for purchases made through third-party platforms. For direct purchases (if applicable), please contact us at ${SUPPORT_EMAIL}`,
    ],
  },
  { title: "Acceptable Use", index: 5 },
  {
    title: "Permitted use",
    index: 5.1,
    paragraph: [
      "You may use our Services solely for lawful, personal, non-commercial purposes in accordance with these Terms. You agree to use the App responsibly and in a manner that does not harm other users or the integrity of the platform.",
    ],
  },
  {
    title: "Prohibited Conduct",
    index: 5.2,
    paragraph: [
      "You agree NOT to:",
      {
        index: 1,
        text: "Use the Services for any unlawful purpose or in violation of any applicable laws or regulations",
      },
      {
        index: 2,
        text: "Attempt to reverse-engineer, decompile, disassemble, or otherwise derive the source code of the App",
      },
      {
        index: 3,
        text: "Circumvent, disable, or interfere with security features of the App",
      },
      {
        index: 4,
        text: "Transmit any harmful, offensive, abusive, or objectionable content",
      },
      {
        index: 5,
        text: "Impersonate any person or entity or misrepresent your affiliation with any person or entity",
      },
      {
        index: 6,
        text: "Scrape, crawl, or systematically collect data from the App without prior written consent",
      },
      {
        index: 7,
        text: "Use automated tools, bots, or scripts to access or interact with the Services",
      },
      {
        index: 8,
        text: "Share, sublicense, sell, or commercially exploit any content from our Services",
      },
      {
        index: 9,
        text: "Attempt to gain unauthorized access to any part of the Services or related systems",
      },
    ],
  },
  {
    title: "Intellectual Property",
    index: 6,
  },
  {
    title: "Our content",
    index: 6.1,
    paragraph: [
      "All content within the Storytime4Kids App, including but not limited to stories, text, audio recordings, AI-generated voices, illustrations, graphics, logos, user interface elements, and software code, is owned by or licensed to Storytime4Kids and is protected by copyright, trademark, and other applicable intellectual property laws.",
    ],
  },
  {
    title: "Limited License",
    index: 6.2,
    paragraph: [
      "We grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Services for personal, non-commercial purposes on devices that you own or control. This license does not include the right to copy, modify, distribute, sell, or create derivative works from our content.",
    ],
  },
  {
    title: "Restrictions",
    index: 6.3,
    paragraph: [
      "You may not reproduce, distribute, publicly display, or create derivative works from any content within the App without our prior written permission. Any unauthorized use of our intellectual property may result in termination of your account and legal action.",
    ],
  },
  {
    title: "Privacy and Children's Data",
    index: 7,
    paragraph: [
      "The privacy of children is of paramount importance to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. Our Privacy Policy is fully compliant with:",
      {
        index: 1,
        text: "The Children's Online Privacy Protection Act (COPPA)",
      },
      {
        index: 2,
        text: "The General Data Protection Regulation (GDPR) and UK GDPR",
      },
      {
        index: 3,
        text: "The California Consumer Privacy Act (CCPA)",
      },
      {
        index: 4,
        text: "Google Play Developer Policy Centre requirements",
      },
      "We do not create accounts for children and do not knowingly collect personal data directly from children. All data collection pertains to parent/guardian account holders only. Please review our Privacy Policy at storytimeapp.me/privacy-policy for complete details.",
    ],
  },
  {
    title: "Parental Controls and Responsibilities",
    index: 8,
    paragraph: [
      "As a parent or guardian using our Services, you accept full responsibility for:",
      {
        index: 1,
        text: "Supervising your child's access to and use of the App",
      },
      {
        index: 2,
        text: "Ensuring the App content is age-appropriate for your specific child",
      },
      {
        index: 3,
        text: "Managing screen time and usage in a manner appropriate for your child's wellbeing",
      },
      {
        index: 4,
        text: "Maintaining the security of your account and preventing unauthorized access by your child to account management features",
      },
      {
        index: 5,
        text: "Reviewing and managing the parental control settings provided within the App",
      },
      "We provide parental controls to assist you in managing your child's experience, but these controls are supplementary tools, ultimate supervision responsibility remains with you as the parent or guardian.",
    ],
  },
  {
    title: "Third-Party Services and Links",
    index: 9,
    paragraph: [
      "Our Services may integrate with or link to third-party services. These include, but may not be limited to Google Play Store, and third-party AI voice generation technology. We are not responsible for the content, privacy practices, or terms of any third-party services. Your use of third-party services is at your own risk and is governed by those services' respective terms.",
    ],
  },
  {
    title: "Disclaimers and Limitation of Liability",
    index: 10,
  },
  {
    title: "Disclaimer of Warranties",
    index: 10.1,
    paragraph: [
      "THE SERVICES ARE PROVIDED ON AN 'AS IS' AND 'AS AVAILABLE' BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, WE DISCLAIM ALL WARRANTIES, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.",
      "We do not warrant that the Services will be uninterrupted, error-free, or free of viruses or other harmful components. We make no warranty regarding the accuracy, completeness, or reliability of any content within the App.",
    ],
  },
  {
    title: "Limitation of Liability",
    index: 10.2,
    paragraph: [
      "TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, STORYTIME4KIDS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF, OR INABILITY TO USE, THE SERVICES. OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS SHALL NOT EXCEED THE AMOUNT YOU PAID TO US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.",
    ],
  },
  {
    title: "Google Specific Disclaimer",
    index: 10.3,
    paragraph: [
      "In accordance with and Google Play requirements, we acknowledge that Google LLC is not party to these Terms and bear no responsibility or liability with respect to the Services. Any claims relating to the Services must be directed to us, not to Google.",
    ],
  },
  {
    title: "Indemnification",
    index: 11,
    paragraph: [
      "You agree to indemnify, defend, and hold harmless Storytime4Kids, its affiliates, officers, directors, employees, and agents from any claims, liabilities, damages, losses, or expenses (including reasonable legal fees) arising from your use of the Services, your violation of these Terms, or your violation of any rights of another party.",
    ],
  },
  {
    title: "Termination",
    index: 12,
  },
  {
    title: "By You",
    index: 12.1,
    paragraph: [
      `You may terminate your account at any time by contacting us at ${SUPPORT_EMAIL} or by using the account deletion feature within the App. Termination does not entitle you to a refund of any subscription fees already paid.`,
    ],
  },
  {
    title: "By Us",
    index: 12.2,
    paragraph: [
      "We reserve the right to suspend or terminate your account and access to the Services, without prior notice, if we determine that you have violated these Terms, engaged in fraudulent activity, or if required by applicable law.",
    ],
  },
  {
    title: "Effect of Termination",
    index: 12.3,
    paragraph: [
      "Upon termination, your license to use the Services ends immediately. We will handle your data in accordance with our Privacy Policy and applicable law. Sections of these Terms that by their nature should survive termination shall continue to apply.",
    ],
  },
  {
    title: "Governing Law and Dispute Resolution",
    index: 13,
    paragraph: [
      "These Terms shall be governed by and construed in accordance with applicable law. Any disputes arising under these Terms shall first be attempted to be resolved through good-faith negotiation. If we cannot resolve a dispute informally, you agree that disputes will be resolved through binding arbitration or the courts of competent jurisdiction, as applicable in your region.\nNothing in this section limits your rights to pursue claims with applicable consumer protection authorities or to seek emergency injunctive relief from courts.",
    ],
  },
  {
    title: "Changes to These Terms",
    index: 14,
    paragraph: [
      "We reserve the right to update or modify these Terms at any time. We will notify you of material changes by updating the 'Last Updated' date at the top of this document and, where appropriate, by sending you an in-app notification or email. Your continued use of the Services after changes become effective constitutes your acceptance of the revised Terms.",
      "We recommend reviewing these Terms periodically to stay informed of any updates.",
    ],
  },
  {
    title: "Severability and Entire Agreement",
    index: 15,
    paragraph: [
      "If any provision of these Terms is found to be unenforceable or invalid, that provision shall be modified to the minimum extent necessary to make it enforceable, and all remaining provisions shall continue in full force and effect..",
      "These Terms, together with our Privacy Policy, constitute the entire agreement between you and Storytime4Kids regarding the Services and supersede all prior agreements and understandings.",
    ],
  },

  {
    title: "Contact information",
    index: 16,
    paragraph: [
      "If you have any questions, concerns, or requests regarding these Terms, please contact us at:",
      "Storytime4Kids",
      `Website: storytimeapp.me\nEmail: ${SUPPORT_EMAIL} \nContact Page: storytimeapp.me/contact-us`,
      "We will endeavor to respond to all inquiries within 5 business days.",
    ],
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
  androidPrivacyPolicyData,
  iosPrivacyPolicyData,
  iosTermsAndConditionsData,
  androidTermsAndConditionsData,
  storyCategoriesColours,
  subscriptionBenefits,
  storiesByAgeImages,
};
