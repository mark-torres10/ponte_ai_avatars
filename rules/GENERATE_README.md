# 🧠 GENERATE_README.md

You are an intelligent assistant tasked with generating a clean, professional `README.md` for a client-facing project repository.

---

## 🔍 Instructions

Scan the contents of this repo using the folder structure and file contents as cues.

Then, generate a `README.md` that follows the standard structure and includes appropriate, human-readable summaries where possible.

Use heuristics to infer missing data (e.g., tech stack from codebase, goals from discovery notes), and leave `[PLACEHOLDER]` tags where human confirmation is needed.

---

## 🧱 README Template Structure

Follow this structure exactly, substituting `[PLACEHOLDER]` sections with your best guess or inferred content:

---

```markdown
# 🧠 Project: [Client Name / Project Title]

> [Short one-liner that describes what this project is building or solving.]

---

## 🗂 Overview

- **Client**: [Client Name]
- **Contact**: [Client Contact Name & Email]
- **Project Start**: [Start Date]
- **Expected Delivery**: [Delivery Date or Milestones]
- **Status**: [Ongoing / In Review / Completed]

---

## 🎯 Objectives

[List 2–5 core objectives based on client briefs or meeting notes.]

---

## 🔧 Tech Stack

| Layer       | Tools / Frameworks             |
|-------------|--------------------------------|
| Frontend    | [Infer from codebase]          |
| Backend     | [Infer from codebase]          |
| Storage     | [Infer if applicable]          |
| Deployment  | [Vercel / Docker / Render / etc.] |
| Others      | [LLM / Redis / Zapier / etc.]  |

---

## 📁 Folder Structure

| Folder      | Description |
|-------------|-------------|
| `admin/`     | Contracts, invoices, NDAs |
| `discovery/` | Notes, research, strategy |
| `code/`      | Frontend/backend source code |
| `outputs/`   | Final deliverables, demos |
| `misc/`      | Reference files, transcripts, sandbox work |

---

## 🚧 Development Setup

```bash
# Infer actual setup instructions if found in package.json or README
npm install
npm run dev
```

---

## 📬 Communication Log

| Date       | Interaction            | Summary                        |
|------------|------------------------|--------------------------------|
| [Infer from meeting notes in discovery/] |

---

## ✅ Deliverables Checklist

[List inferred deliverables from discovery or PRD files.]

---

## 📎 Related Files & Links

- [Figma / Loom / Notion links if referenced]
- [Proposal or Contract PDFs in /admin]

---

## 💬 Notes

[Add any outstanding open questions, known limitations, or context found in discovery/strategy_thoughts.md]

---
```

---

## 🔁 Output Format

Return only the filled-in `README.md` content, formatted in Markdown.

If unsure about any field, write `[PLACEHOLDER]` instead of fabricating.

---

```
