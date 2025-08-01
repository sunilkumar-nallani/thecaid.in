// Mock data for CAID terminal commands
export const mockData = {
  system: {
    version: "1.0",
    status: "secure",
    welcomeMessage: "Welcome to the frontline against synthetic media."
  },
  
  about: {
    name: "CAID - Content Authenticity Initiative for Detection",
    mission: "A deep-tech initiative solving the $5.7T synthetic media problem by 2030.",
    description: "Our mission: Distinguish real from synthetic media with precision.",
    urgency: "The problem is critical. The market is massive. The action is now."
  },
  
  roadmap: {
    milestones: [
      {
        id: 1,
        target: "SEP 2025",
        product: "Blockchain-based Browser Plugin (Beta)",
        function: "Enables a community of users to help identify and flag potential AI-generated media, creating a distributed ledger of trust.",
        status: "In Development"
      },
      {
        id: 2,
        target: "Q1/Q2 2026",
        product: "Automated Detection Engine v1.0",
        function: "An advanced algorithm for automatic synthetic media detection, powered by extensive R&D.",
        status: "R&D Phase"
      }
    ]
  },
  
  team: {
    founders: [
      {
        name: "Sriram Saiteja",
        role: "CEO, Founder",
        focus: "Vision, Strategy, Business Development"
      },
      {
        name: "Sunil Kumar Nallani",
        role: "CTO, Co-founder",
        focus: "Technology, R&D, Product Development"
      }
    ]
  },
  
  funding: {
    stage: "Seed funding round",
    target: "Building R&D team",
    focus: "Accelerating product development",
    market: "$5.7T synthetic media detection by 2030",
    seeking: [
      "Seed-level accelerators",
      "Technology investors",
      "Strategic partners"
    ]
  },
  
  contact: {
    email: "[PLACEHOLDER - team@caid.io]",
    demo: "[PLACEHOLDER - Schedule demo video call]",
    pitch: "[PLACEHOLDER - Request pitch deck]"
  },
  
  commands: [
    { command: "help", description: "Show this help message" },
    { command: "about", description: "Learn about CAID" },
    { command: "roadmap", description: "View development timeline" },
    { command: "team", description: "Meet the founders" },
    { command: "funding", description: "Investment opportunities" },
    { command: "contact", description: "Get in touch" },
    { command: "clear", description: "Clear terminal" }
  ]
};

export default mockData;