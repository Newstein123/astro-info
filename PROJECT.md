# PROJECT.md

## 🎯 Project Goal

Build an **autonomous content platform** that:

- Publishes **daily informational content**
- Fetches and displays **latest news automatically**
- Requires **minimal to zero manual intervention**
- Continuously grows content over time

The system should behave like a **self-running content engine**.

---

## 🧠 Core Concept

This project is designed as an **agentic system**, where:

- Tasks are handled by independent agents
- Each agent performs a specific responsibility
- The system runs on a scheduled loop
- Outputs are stored and served automatically

---

## ⚙️ System Architecture

```text
Scheduler (cron)
        ↓
News Agent ───────→ JSON Storage
        ↓
Content Agent ───→ JSON Storage
        ↓
Review Agent ────→ Clean & Improve Data
        ↓
Frontend → Displays Content
```

---

## 🧩 Core Workflows

### 1. News Workflow

Runs automatically on a schedule.

#### Steps:

1. Fetch latest articles from external sources
2. Extract relevant content
3. Process using AI:
   - Generate title
   - Create summaries (multiple formats if needed)
   - Add tags/categories

4. Validate output
5. Store in JSON file

---

### 2. Content Workflow (Daily Content)

Runs once per day.

#### Steps:

1. Generate a new topic (or random selection)
2. Use AI to create structured content:
   - Title
   - Explanation(s)
   - Additional insights (optional)

3. Review and refine content
4. Store in JSON file

---

### 3. Review Workflow (Quality Control)

Runs after content generation.

#### Steps:

1. Validate correctness and clarity
2. Improve structure and readability
3. Ensure consistency across entries
4. Prevent low-quality or duplicate content

---

## 🗂️ Storage Strategy

- Use **JSON files** as the primary data store
- Each content type has its own file

### Rules:

- Always read before writing
- Prevent duplicate entries
- Keep structure consistent
- Append new entries only

---

## ⏰ Automation Flow

The system runs via a scheduler:

### Daily Execution:

1. Run News Agent
2. Run Content Agent
3. Run Review Agent

### Output:

- New content is added automatically
- Existing data is improved over time

---

## 🤖 Agent Roles

### News Agent

- Responsible for external data ingestion
- Transforms raw data into structured content

---

### Content Agent

- Generates original content
- Ensures variety and consistency

---

### Review Agent

- Acts as a quality filter
- Improves and validates outputs

---

## 🔁 System Behavior

The system operates in continuous loops:

```text
Generate → Review → Store → Repeat
```

- No manual triggering required
- System improves incrementally
- Content library grows over time

---

## 📦 Data Flow

```text
External Sources → News Agent → JSON

AI Generation → Content Agent → JSON

JSON → Frontend → Users
```

---

## ⚠️ Constraints

- Keep system lightweight (no heavy frameworks required)
- Avoid unnecessary complexity
- Prioritize reliability over advanced features
- Ensure outputs are consistent and structured

---

## 🚀 Future Extensions

- Multi-language support
- Content categorization and filtering
- Search functionality
- AI-powered Q&A system
- Social media automation (content reuse)

---

## 🧠 System Philosophy

- Automate repetitive work
- Minimize human intervention
- Focus on consistency over perfection
- Build systems that scale with time, not effort

---

## ✅ Definition of Success

The system is successful when:

- It runs daily without failure
- New content is generated consistently
- Data remains structured and usable
- Minimal manual input is required

---

END OF FILE
