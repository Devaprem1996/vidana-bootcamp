
import { N8NModule, Resource, StudentProgress, Topic } from "../types";

export const TOPICS: Topic[] = [
  {
    id: '1',
    slug: 'n8n',
    title: 'n8n Automation',
    description: 'Master workflow automation with nodes, triggers, and logic.',
    icon: 'Workflow',
    progress: 22,
    totalModules: 9,
    completedModules: 2,
  },
  {
    id: '2',
    slug: 'vibe-coding',
    title: 'Vibe Coding',
    description: 'Learn to code with flow and intuition assisted by AI.',
    icon: 'Code',
    progress: 0,
    totalModules: 5,
    completedModules: 0,
  },
  {
    id: '3',
    slug: 'prompt-engineering',
    title: 'Prompt Engineering',
    description: 'Craft the perfect prompts for LLMs to get desired outputs.',
    icon: 'MessageSquare',
    progress: 5,
    totalModules: 4,
    completedModules: 0,
  },
  {
    id: '4',
    slug: 'ai-tools',
    title: 'AI Tools Suite',
    description: 'Explore the landscape of modern AI productivity tools.',
    icon: 'Cpu',
    progress: 0,
    totalModules: 6,
    completedModules: 0,
  },
];

export const TOPIC_CURRICULUM: Record<string, N8NModule[]> = {
  'n8n': [
    {
      day: 1,
      title: "The Mental Model",
      description: "Understanding the 3-box diagram and core philosophy of automation.",
      timeEstimate: "2 Hours",
      isCompleted: true,
      outcomes: ["Understand Trigger vs Action", "Navigate the Canvas", "Execute first workflow"],
      keyConcepts: ["Nodes", "Connections", "JSON Data Structure"],
      homework: "Create a simple 'Hello World' workflow that triggers manually and logs a message to the console.",
      resources: []
    },
    {
      day: 2,
      title: "Data Flow Visualization",
      description: "How data moves between nodes and how to transform it.",
      timeEstimate: "2.5 Hours",
      isCompleted: true,
      outcomes: ["Map data between nodes", "Understand Items lists", "Use the Set node"],
      keyConcepts: ["Input/Output", "Expressions", "Data Pinning"],
      homework: "Build a workflow that takes hardcoded JSON data about a user and transforms it into a clean list of names.",
      resources: []
    },
    {
      day: 3,
      title: "Triggers & Logic",
      description: "Deep dive into schedules, webhooks, and decision trees.",
      timeEstimate: "3 Hours",
      isCompleted: false,
      outcomes: ["Build a Schedule trigger", "Create an IF node logic", "Handle multiple branches"],
      keyConcepts: ["Cron Expressions", "Boolean Logic", "Switch Node"],
      homework: "Create a workflow that runs every hour. If the minute is even, log 'Even'; if odd, log 'Odd'.",
      resources: []
    },
    {
      day: 4,
      title: "Email & Conditional Routing",
      description: "Personalizing communication based on data conditions.",
      timeEstimate: "3 Hours",
      isCompleted: false,
      outcomes: ["Connect Gmail/Outlook", "Dynamic email bodies", "Routing based on sender"],
      keyConcepts: ["SMTP/IMAP", "HTML in Emails", "Merge Tags"],
      homework: "Simulate an email trigger. If the subject contains 'Urgent', route to a high-priority slack dummy output.",
      resources: []
    },
    {
      day: 5,
      title: "APIs & OAuth",
      description: "Connecting to external services like Google Sheets safely.",
      timeEstimate: "4 Hours",
      isCompleted: false,
      outcomes: ["Authenticate with Google Sheets", "Read/Write rows", "Understand HTTP Request Node"],
      keyConcepts: ["OAuth2", "Credentials", "API Methods (GET/POST)"],
      homework: "Connect to a public API (like CoinGecko), fetch Bitcoin price, and append it to a Google Sheet.",
      resources: []
    },
    {
      day: 6,
      title: "Project Architecture I",
      description: "Planning a complex workflow before building.",
      timeEstimate: "3 Hours",
      isCompleted: false,
      outcomes: ["Diagramming workflows", "Separating concerns", "Modular design"],
      keyConcepts: ["Sub-workflows", "Execute Workflow Node", "State Management"],
      homework: "Draw a diagram (paper or digital) for your final Capstone project. Submit the image.",
      resources: []
    },
    {
      day: 7,
      title: "Project Architecture II",
      description: "Building the core logic of the capstone project.",
      timeEstimate: "4 Hours",
      isCompleted: false,
      outcomes: ["Implementing core business logic", "Testing edge cases", "Data validation"],
      keyConcepts: ["Filter Node", "Code Node (JS)", "Data Transformation"],
      homework: "Implement the main data processing engine of your capstone (no UI triggers yet).",
      resources: []
    },
    {
      day: 8,
      title: "Project Architecture III",
      description: "Finalizing the project and user interfaces.",
      timeEstimate: "4 Hours",
      isCompleted: false,
      outcomes: ["Connecting front-end forms", "Final outputs", "Dashboard reporting"],
      keyConcepts: ["n8n Form Trigger", "Wait Node", "Approvals"],
      homework: "Connect the n8n Form Trigger to your logic from Day 7.",
      resources: []
    },
    {
      day: 9,
      title: "Error Handling & Production",
      description: "Making your workflows bulletproof.",
      timeEstimate: "3 Hours",
      isCompleted: false,
      outcomes: ["Create an Error Workflow", "Try/Catch pattern", "Logging errors to Slack"],
      keyConcepts: ["Error Trigger", "Execution Data", "Retry Policies"],
      homework: "Add an Error Trigger workflow that sends you an email whenever your main workflow fails.",
      resources: []
    },
  ],
  'vibe-coding': [
    {
      day: 1,
      title: "introcductions ",
      description: "Setting up Cursor, Copilot, and understanding the 'Tab' flow.",
      timeEstimate: "2 Hours",
      isCompleted: false,
      outcomes: ["Install Cursor/VS Code", "Configure Copilot", "Understand context window"],
      keyConcepts: ["Context Awareness", "Autocomplete", "Chat Interface"],
      homework: "Set up your environment and use AI to generate a simple HTML/CSS landing page.",
      resources: []
    },
    {
      day: 2,
      title: "Prompt-Driven Development",
      description: "Writing specs for AI to generate high-quality code blocks.",
      timeEstimate: "2.5 Hours",
      isCompleted: false,
      outcomes: ["Write effective code prompts", "Iterative refinement", "Managing hallucinations"],
      keyConcepts: ["Specificity", "Role Prompting", "Step-by-step Instructions"],
      homework: "Write a prompt to generate a React To-Do list component, then refine it to add local storage.",
      resources: []
    },
    {
      day: 3,
      title: "Debugging with AI",
      description: "Using AI to explain errors and suggest fixes.",
      timeEstimate: "2 Hours",
      isCompleted: false,
      outcomes: ["Paste stack traces efficiently", "Rubber duck debugging with AI", "Security checks"],
      keyConcepts: ["Error Analysis", "Log Injection", "Vulnerability Scanning"],
      homework: "Take a broken code snippet provided in resources, find the bug using AI, and fix it.",
      resources: []
    },
    {
      day: 4,
      title: "Refactoring & Optimization",
      description: "Improving code quality and readability with AI assistance.",
      timeEstimate: "2.5 Hours",
      isCompleted: false,
      outcomes: ["Modernize legacy code", "Add comments/docs", "Optimize complexity"],
      keyConcepts: ["Clean Code", "Big O Notation", "Documentation Generation"],
      homework: "Refactor a nested loop function into a cleaner, more readable functional approach using AI.",
      resources: []
    },
    {
      day: 5,
      title: "Micro-App Capstone",
      description: "Building a small utility app entirely with Vibe Coding.",
      timeEstimate: "4 Hours",
      isCompleted: false,
      outcomes: ["End-to-end creation", "Deployment", "Final Polish"],
      keyConcepts: ["MVP Scope", "Deployment", "Vercel/Netlify"],
      homework: "Build and deploy a 'Pomodoro Timer' or 'Currency Converter' using only AI-generated code.",
      resources: []
    }
  ],
  'prompt-engineering': [
    {
      day: 1,
      title: "Core Mechanics",
      description: "The anatomy of a perfect prompt: Context, Instruction, Input, Output.",
      timeEstimate: "2 Hours",
      isCompleted: false,
      outcomes: ["Identify prompt components", "Reduce ambiguity", "Standardize formats"],
      keyConcepts: ["Context", "Instruction", "Few-shot"],
      homework: "Rewrite 3 vague email requests into structured, clear prompts.",
      resources: []
    },
    {
      day: 2,
      title: "Reasoning Strategies",
      description: "Chain of Thought, Tree of Thought, and guiding the model.",
      timeEstimate: "2.5 Hours",
      isCompleted: false,
      outcomes: ["Implement Chain of Thought", "Use Delimiters", "Ask for reasoning"],
      keyConcepts: ["CoT", "Zero-shot CoT", "Self-Consistency"],
      homework: "Create a prompt that solves a complex logic puzzle by forcing the model to show its work.",
      resources: []
    },
    {
      day: 3,
      title: "System Prompts & Personas",
      description: "Configuring the 'Soul' of the AI agent.",
      timeEstimate: "2 Hours",
      isCompleted: false,
      outcomes: ["Define persona constraints", "Tone setting", "Output formatting (JSON/Markdown)"],
      keyConcepts: ["System Message", "Role-playing", "Guardrails"],
      homework: "Design a System Prompt for a 'Socratic Tutor' that never gives answers, only asks questions.",
      resources: []
    },
    {
      day: 4,
      title: "Advanced Prompting",
      description: "Prompt hacking, defense, and recursive prompting.",
      timeEstimate: "3 Hours",
      isCompleted: false,
      outcomes: ["Understand Injection attacks", "Recursive refinement", "Meta-prompting"],
      keyConcepts: ["Prompt Injection", "Evaluation", "Optimization"],
      homework: "Create a prompt that generates other prompts for specific tasks.",
      resources: []
    },
  ],
  'ai-tools': [
    {
      day: 1,
      title: "Text & Writing",
      description: "Deep dive into ChatGPT, Claude, and specialized writing tools.",
      timeEstimate: "2 Hours",
      isCompleted: false,
      outcomes: ["Compare Model strengths", "Long-form content", "Summarization"],
      keyConcepts: ["LLMs", "Context Window", "Tokens"],
      homework: "Generate a blog post using ChatGPT and then critique/edit it using Claude.",
      resources: []
    },
    {
      day: 2,
      title: "Image Generation",
      description: "Midjourney, DALL-E 3, and Flux.",
      timeEstimate: "2.5 Hours",
      isCompleted: false,
      outcomes: ["Prompting for images", "Aspect ratios & Parameters", "In-painting"],
      keyConcepts: ["Diffusion Models", "Seeds", "Styles"],
      homework: "Create a consistent character mascot in 3 different poses.",
      resources: []
    },
    {
      day: 3,
      title: "Audio & Video",
      description: "ElevenLabs, Runway, and HeyGen.",
      timeEstimate: "2.5 Hours",
      isCompleted: false,
      outcomes: ["Voice cloning", "Text-to-Video", "Avatar generation"],
      keyConcepts: ["Multimodal", "Lip-sync", "Synthesis"],
      homework: "Create a 30-second introduction video using an AI avatar and voice.",
      resources: []
    },
    {
      day: 4,
      title: "Research & Analysis",
      description: "Perplexity, Consensus, and Data Analyst tools.",
      timeEstimate: "2 Hours",
      isCompleted: false,
      outcomes: ["Sourcing citations", "Analyzing CSVs", "Academic research"],
      keyConcepts: ["RAG", "Citations", "Data Visualization"],
      homework: "Use Perplexity to research a niche topic and compile a report with citations.",
      resources: []
    },
    {
      day: 5,
      title: "Productivity & Meetings",
      description: "Notion AI, Otter.ai, and Fireflies.",
      timeEstimate: "2 Hours",
      isCompleted: false,
      outcomes: ["Meeting summaries", "Knowledge base management", "Email automation"],
      keyConcepts: ["Transcripts", "Action Items", "Integration"],
      homework: "Set up a Notion database that uses AI properties to auto-tag entries.",
      resources: []
    },
    {
      day: 6,
      title: "Ethics & Safety",
      description: "Copyright, Bias, and the future of work.",
      timeEstimate: "2 Hours",
      isCompleted: false,
      outcomes: ["Identify bias", "Understand usage rights", "Policy creation"],
      keyConcepts: ["Alignment", "Copyright", "Bias"],
      homework: "Write a short policy document for 'Acceptable AI Use' in an office.",
      resources: []
    }
  ]
};

// Flatten curriculum for backward compatibility if needed, though we use the map now
export const N8N_CURRICULUM: N8NModule[] = TOPIC_CURRICULUM['n8n'];

export const ALL_RESOURCES: Resource[] = [
  // N8N
  { id: '1', title: 'n8n Crash Course', type: 'video', url: 'https://www.youtube.com/watch?v=sIq9tKjH3Jc', duration: '45m', tags: ['n8n', 'Fundamentals'], difficulty: 'Beginner' },
  { id: '2', title: 'JSON in n8n', type: 'video', url: 'https://docs.n8n.io/data/json/', duration: '20m', tags: ['n8n', 'Fundamentals'], difficulty: 'Beginner' },
  
  // Vibe Coding
  { id: 'vc1', title: 'Cursor Editor: The Future of Coding', type: 'video', url: 'https://www.cursor.com/', duration: '15m', tags: ['Vibe Coding', 'Tools'], difficulty: 'Beginner' },
  { id: 'vc2', title: 'Prompting for React Components', type: 'article', url: 'https://react.dev/learn', tags: ['Vibe Coding', 'React'], difficulty: 'Intermediate' },
  { id: 'vc3', title: 'Debugging with ChatGPT', type: 'video', url: 'https://openai.com/chatgpt', duration: '10m', tags: ['Vibe Coding', 'Debugging'], difficulty: 'Beginner' },

  // Prompt Engineering
  { id: 'pe1', title: 'The Art of the Prompt', type: 'pdf', url: 'https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-openai-api', tags: ['Prompt Eng', 'Guide'], difficulty: 'Beginner' },
  { id: 'pe2', title: 'Chain of Thought Reasoning', type: 'article', url: 'https://www.promptingguide.ai/techniques/cot', tags: ['Prompt Eng', 'Advanced'], difficulty: 'Advanced' },
  { id: 'pe3', title: 'System Prompts 101', type: 'video', url: 'https://platform.openai.com/docs/guides/prompt-engineering', duration: '12m', tags: ['Prompt Eng', 'System'], difficulty: 'Intermediate' },

  // AI Tools
  { id: 'at1', title: 'Midjourney Masterclass', type: 'video', url: 'https://docs.midjourney.com/', duration: '1h', tags: ['AI Tools', 'Images'], difficulty: 'Intermediate' },
  { id: 'at2', title: 'Perplexity for Research', type: 'video', url: 'https://www.perplexity.ai/', duration: '15m', tags: ['AI Tools', 'Research'], difficulty: 'Beginner' },
  { id: 'at3', title: 'ElevenLabs Voice Cloning', type: 'workflow', url: 'https://elevenlabs.io/', tags: ['AI Tools', 'Audio'], difficulty: 'Advanced' }
];

// Helper to get resources by topic slug (simple filter)
export const getResourcesByTopic = (slug: string) => {
  const tagMap: Record<string, string> = {
    'n8n': 'n8n',
    'vibe-coding': 'Vibe Coding',
    'prompt-engineering': 'Prompt Eng',
    'ai-tools': 'AI Tools'
  };
  const tag = tagMap[slug];
  return ALL_RESOURCES.filter(r => r.tags?.some(t => t.includes(tag) || t === tag));
};

export const N8N_RESOURCES = getResourcesByTopic('n8n');

export const ADMIN_STATS: StudentProgress[] = [
  { studentName: "Alice Johnson", studentId: "s1", n8n: 85, vibeCoding: 10, promptEng: 40, aiTools: 90, lastActive: "2 hours ago" },
  { studentName: "Bob Smith", studentId: "s2", n8n: 20, vibeCoding: 0, promptEng: 10, aiTools: 5, lastActive: "1 day ago" },
  { studentName: "Charlie Davis", studentId: "s3", n8n: 45, vibeCoding: 30, promptEng: 60, aiTools: 20, lastActive: "5 mins ago" },
  { studentName: "Diana Prince", studentId: "s4", n8n: 100, vibeCoding: 90, promptEng: 100, aiTools: 100, lastActive: "3 days ago" },
];