# 🤖 ISSUE_GENERATION_AGENT.md

This file describes the exact steps the agent should take to create a new issue and set up the planning folder for this project.

---

## Steps for Issue Generation Agent

1. **Prompt the User**
   - Ask the user each question from `HOW_TO_WRITE_ISSUES.md`.
   - Collect all answers, clarifying as needed.

2. **Generate Issue Description**
   - Use the provided template in `HOW_TO_WRITE_ISSUES.md`.
   - Fill in all sections with the user's answers.

3. **Determine Issue Number**
   - Use the next available sequential number (e.g., if last is 005, next is 006).
   - Zero-pad to three digits (e.g., `006`).

4. **Create GitHub Issue**
   - Use the GitHub CLI:
     ```sh
     gh issue create --title "[Title]" --body "[Generated Description]" --label "[Type]"
     ```
   - Capture the issue number and URL from the CLI output.

5. **Create Planning Folder**
   - Name the folder: `planning/NNN_short_description/` (e.g., `planning/006_add_login/`).
   - Use a kebab-case, short version of the title for the folder name.

6. **Initialize Folder Structure**
   - Inside the new folder, create:
     - `README.md` (copy of the issue description)
     - `prompts/` (empty, or with the prompt used for this issue as `prompt_NNN.md`)
     - `progress_updates/` (empty)

7. **Create Branch**
   - Create a new git branch:
     ```sh
     git checkout -b issue-NNN-short-description
     ```

8. **Announce Completion**
   - Output the issue URL, branch name, and planning folder path to the user.

---

## Example CLI Commands

```sh
# Create issue
ISSUE_URL=$(gh issue create --title "Add login page" --body "..." --label "feature")

# Create planning folder
mkdir -p planning/006_add_login/prompts planning/006_add_login/progress_updates
cp issue_description.md planning/006_add_login/README.md

# Create branch
git checkout -b issue-006-add-login
```

---

**The agent must follow these steps for every new issue. All planning and progress for the issue must be tracked in the corresponding planning folder.** 