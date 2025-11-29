
/**
 * SEED MODULES SCRIPT
 * ----------------------------------------------------------------------------
 * 1. Open Supabase Dashboard > SQL Editor.
 * 2. Copy the content inside `SEED_MODULES_SQL` below.
 * 3. Run it.
 * ----------------------------------------------------------------------------
 */

export const SEED_MODULES_SQL = `
-- CLEAR EXISTING MODULES TO PREVENT DUPLICATES
DELETE FROM public.modules;

-- N8N CURRICULUM
INSERT INTO public.modules (topic_slug, day_number, title, description, time_estimate, outcomes, key_concepts, homework_description) VALUES
('n8n', 1, 'The Mental Model', 'Understanding the 3-box diagram and core philosophy of automation.', '2 Hours', ARRAY['Understand Trigger vs Action', 'Navigate the Canvas', 'Execute first workflow'], ARRAY['Nodes', 'Connections', 'JSON Data Structure'], 'Create a simple Hello World workflow that triggers manually and logs a message.'),
('n8n', 2, 'Data Flow Visualization', 'How data moves between nodes and how to transform it.', '2.5 Hours', ARRAY['Map data between nodes', 'Understand Items lists', 'Use the Set node'], ARRAY['Input/Output', 'Expressions', 'Data Pinning'], 'Build a workflow that takes hardcoded JSON data and transforms it.'),
('n8n', 3, 'Triggers & Logic', 'Deep dive into schedules, webhooks, and decision trees.', '3 Hours', ARRAY['Build a Schedule trigger', 'Create an IF node logic', 'Handle multiple branches'], ARRAY['Cron Expressions', 'Boolean Logic', 'Switch Node'], 'Create a workflow that runs every hour with conditional logic.'),
('n8n', 4, 'Email & Conditional Routing', 'Personalizing communication based on data conditions.', '3 Hours', ARRAY['Connect Gmail/Outlook', 'Dynamic email bodies', 'Routing based on sender'], ARRAY['SMTP/IMAP', 'HTML in Emails', 'Merge Tags'], 'Simulate an email trigger that routes based on subject line.'),
('n8n', 5, 'APIs & OAuth', 'Connecting to external services like Google Sheets safely.', '4 Hours', ARRAY['Authenticate with Google Sheets', 'Read/Write rows', 'Understand HTTP Request Node'], ARRAY['OAuth2', 'Credentials', 'API Methods'], 'Connect to a public API and append data to a Google Sheet.'),
('n8n', 6, 'Project Architecture I', 'Planning a complex workflow before building.', '3 Hours', ARRAY['Diagramming workflows', 'Separating concerns', 'Modular design'], ARRAY['Sub-workflows', 'Execute Workflow Node', 'State Management'], 'Draw a diagram for your final Capstone project.'),
('n8n', 7, 'Project Architecture II', 'Building the core logic of the capstone project.', '4 Hours', ARRAY['Implementing core business logic', 'Testing edge cases', 'Data validation'], ARRAY['Filter Node', 'Code Node (JS)', 'Data Transformation'], 'Implement the main data processing engine of your capstone.'),
('n8n', 8, 'Project Architecture III', 'Finalizing the project and user interfaces.', '4 Hours', ARRAY['Connecting front-end forms', 'Final outputs', 'Dashboard reporting'], ARRAY['n8n Form Trigger', 'Wait Node', 'Approvals'], 'Connect the n8n Form Trigger to your logic from Day 7.'),
('n8n', 9, 'Error Handling & Production', 'Making your workflows bulletproof.', '3 Hours', ARRAY['Create an Error Workflow', 'Try/Catch pattern', 'Logging errors to Slack'], ARRAY['Error Trigger', 'Execution Data', 'Retry Policies'], 'Add an Error Trigger workflow that sends emails on failure.');

-- VIBE CODING CURRICULUM
INSERT INTO public.modules (topic_slug, day_number, title, description, time_estimate, outcomes, key_concepts, homework_description) VALUES
('vibe-coding', 1, 'Introductions', 'Setting up Cursor, Copilot, and understanding the Tab flow.', '2 Hours', ARRAY['Install Cursor/VS Code', 'Configure Copilot', 'Understand context'], ARRAY['Context Awareness', 'Autocomplete', 'Chat Interface'], 'Set up your environment and generate a landing page.'),
('vibe-coding', 2, 'Prompt-Driven Development', 'Writing specs for AI to generate high-quality code blocks.', '2.5 Hours', ARRAY['Write effective code prompts', 'Iterative refinement', 'Managing hallucinations'], ARRAY['Specificity', 'Role Prompting', 'Step-by-step'], 'Write a prompt to generate a React To-Do list component.'),
('vibe-coding', 3, 'Debugging with AI', 'Using AI to explain errors and suggest fixes.', '2 Hours', ARRAY['Paste stack traces efficiently', 'Rubber duck debugging', 'Security checks'], ARRAY['Error Analysis', 'Log Injection', 'Vulnerability Scanning'], 'Take a broken code snippet and fix it using AI.'),
('vibe-coding', 4, 'Refactoring & Optimization', 'Improving code quality and readability with AI assistance.', '2.5 Hours', ARRAY['Modernize legacy code', 'Add comments/docs', 'Optimize complexity'], ARRAY['Clean Code', 'Big O Notation', 'Documentation'], 'Refactor a nested loop function into a cleaner approach.'),
('vibe-coding', 5, 'Micro-App Capstone', 'Building a small utility app entirely with Vibe Coding.', '4 Hours', ARRAY['End-to-end creation', 'Deployment', 'Final Polish'], ARRAY['MVP Scope', 'Deployment', 'Vercel/Netlify'], 'Build and deploy a simple utility app using only AI-generated code.');

-- PROMPT ENGINEERING CURRICULUM
INSERT INTO public.modules (topic_slug, day_number, title, description, time_estimate, outcomes, key_concepts, homework_description) VALUES
('prompt-engineering', 1, 'Core Mechanics', 'The anatomy of a perfect prompt.', '2 Hours', ARRAY['Identify prompt components', 'Reduce ambiguity', 'Standardize formats'], ARRAY['Context', 'Instruction', 'Few-shot'], 'Rewrite 3 vague email requests into structured prompts.'),
('prompt-engineering', 2, 'Reasoning Strategies', 'Chain of Thought and guiding the model.', '2.5 Hours', ARRAY['Implement Chain of Thought', 'Use Delimiters', 'Ask for reasoning'], ARRAY['CoT', 'Zero-shot CoT', 'Self-Consistency'], 'Create a prompt that solves a logic puzzle by showing work.'),
('prompt-engineering', 3, 'System Prompts & Personas', 'Configuring the Soul of the AI agent.', '2 Hours', ARRAY['Define persona constraints', 'Tone setting', 'Output formatting'], ARRAY['System Message', 'Role-playing', 'Guardrails'], 'Design a System Prompt for a Socratic Tutor.'),
('prompt-engineering', 4, 'Advanced Prompting', 'Prompt hacking, defense, and recursive prompting.', '3 Hours', ARRAY['Understand Injection attacks', 'Recursive refinement', 'Meta-prompting'], ARRAY['Prompt Injection', 'Evaluation', 'Optimization'], 'Create a prompt that generates other prompts.');

-- AI TOOLS CURRICULUM
INSERT INTO public.modules (topic_slug, day_number, title, description, time_estimate, outcomes, key_concepts, homework_description) VALUES
('ai-tools', 1, 'Text & Writing', 'Deep dive into ChatGPT, Claude, and specialized tools.', '2 Hours', ARRAY['Compare Model strengths', 'Long-form content', 'Summarization'], ARRAY['LLMs', 'Context Window', 'Tokens'], 'Generate a blog post and critique it with another AI.'),
('ai-tools', 2, 'Image Generation', 'Midjourney, DALL-E 3, and Flux.', '2.5 Hours', ARRAY['Prompting for images', 'Aspect ratios', 'In-painting'], ARRAY['Diffusion Models', 'Seeds', 'Styles'], 'Create a consistent character mascot in 3 poses.'),
('ai-tools', 3, 'Audio & Video', 'ElevenLabs, Runway, and HeyGen.', '2.5 Hours', ARRAY['Voice cloning', 'Text-to-Video', 'Avatar generation'], ARRAY['Multimodal', 'Lip-sync', 'Synthesis'], 'Create a 30-second intro video with AI avatar.'),
('ai-tools', 4, 'Research & Analysis', 'Perplexity, Consensus, and Data Analyst tools.', '2 Hours', ARRAY['Sourcing citations', 'Analyzing CSVs', 'Academic research'], ARRAY['RAG', 'Citations', 'Data Visualization'], 'Use Perplexity to research a niche topic with citations.'),
('ai-tools', 5, 'Productivity & Meetings', 'Notion AI, Otter.ai, and Fireflies.', '2 Hours', ARRAY['Meeting summaries', 'Knowledge base management', 'Email automation'], ARRAY['Transcripts', 'Action Items', 'Integration'], 'Set up a Notion database with AI properties.'),
('ai-tools', 6, 'Ethics & Safety', 'Copyright, Bias, and the future of work.', '2 Hours', ARRAY['Identify bias', 'Understand usage rights', 'Policy creation'], ARRAY['Alignment', 'Copyright', 'Bias'], 'Write a policy document for Acceptable AI Use.');
`;
