# 🗂️ PROJECT_MANAGEMENT.md

## Overview

All project management for this repository is handled via **GitHub Issues**, **Pull Requests (PRs)**, and a structured `planning/` directory. This ensures every piece of work is tracked, documented, and reviewable, with clear prompts and progress logs for each task.

---

## Workflow Summary

1. **New Work = New Issue**
   - Every new feature, bugfix, or task begins as a GitHub Issue.
   - Issues are created using a standardized prompt (see `HOW_TO_WRITE_ISSUES.md`).
   - Each issue gets a corresponding folder in `planning/`, named with a zero-padded number and a short description (e.g., `001_create_nextjs_skeleton/`).

2. **Prompt-Driven Issue Creation**
   - The agent (or user) runs a script or prompt that asks a series of questions (see `HOW_TO_WRITE_ISSUES.md`) to gather all necessary details for the issue description.
   - The agent then creates the GitHub Issue and the corresponding planning folder.

3. **Branching and Development**
   - After the issue is created, a new git branch is created for the work (e.g., `issue-001-create-nextjs-skeleton`).
   - All code, documentation, and planning for the issue is done in this branch and within the issue's planning folder.

4. **Progress Tracking**
   - Progress updates, notes, and sub-prompts are stored in `progress_updates/` within the issue folder.
   - Prompts used for this issue are stored in `prompts/`.

5. **Pull Request and Review**
   - When work is ready, a PR is opened referencing the issue.
   - The PR is reviewed, discussed, and merged following standard GitHub flow.

---

## Directory Structure

```
planning/
   PROJECT_MANAGEMENT.md         # This file
   HOW_TO_WRITE_ISSUES.md        # List of questions/prompts for issue creation
   ISSUE_GENERATION_AGENT.md     # Prompt for the agent to automate issue/folder creation
   001_create_nextjs_skeleton/   # Folder for issue #1
        README.md                # Description of the issue
        prompts/                 # Prompts used in this issue
             prompt_001.md       # ...
        progress_updates/        # Progress notes, logs, etc.
   002_some_other_task/          # Folder for issue #2
        ...
```

---

## Step-by-Step: Creating and Managing Work

1. **Start New Work**
   - Run the agent/script to start a new issue.
   - Answer the questions from `HOW_TO_WRITE_ISSUES.md`.
   - The agent creates the GitHub Issue and a new folder in `planning/` (e.g., `002_feature_x/`).

2. **Branch Creation**
   - The agent (or user) creates a new branch named `issue-XXX-short-description`.

3. **Work and Documentation**
   - All planning, prompts, and progress for the issue are kept in the issue's planning folder.
   - Code and docs are committed to the branch.

4. **Progress Updates**
   - Use `progress_updates/` to log status, blockers, and decisions.
   - Use `prompts/` to store any prompts or scripts used for this issue.

5. **Pull Request**
   - When ready, open a PR referencing the issue.
   - Review, discuss, and merge.

6. **Close Issue**
   - After merge, close the issue and mark the planning folder as complete.

---

## Automation & GitHub CLI

- The agent uses the GitHub CLI (`gh`) to automate issue creation, branch creation, and PRs.
- All scripts and prompts should be designed to work with the CLI for maximum reproducibility.

---

## Naming Conventions

- **Folders:** `NNN_short_description/` (e.g., `003_add_auth_flow/`)
- **Branches:** `issue-NNN-short-description` (e.g., `issue-003-add-auth-flow`)
- **Prompts:** `prompts/prompt_NNN.md`
- **Progress:** `progress_updates/update_YYYYMMDD.md`

---

## Benefits
- **Traceability:** Every change is linked to an issue and a planning folder.
- **Transparency:** All prompts, decisions, and progress are logged.
- **Reproducibility:** Anyone can follow the planning folder to understand the context and steps for any issue.

---

For details on writing issues and prompts, see `HOW_TO_WRITE_ISSUES.md` and `ISSUE_GENERATION_AGENT.md`. 
