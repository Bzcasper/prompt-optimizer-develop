# Agent Manifest Templates

This directory contains canonical agent manifest templates for the Agent Development Kit (ADK). These YAML files are used to declare the properties and capabilities of an agent.

There are three types of agent manifests provided:
- `orchestrator.yaml`: For agents that manage and delegate tasks to other agents.
- `task-agent.yaml`: For agents that perform specific, high-level tasks.
- `tool-agent.yaml`: For specialized agents that provide access to a specific tool or API.

## Manifest Fields

Each manifest contains the following fields:

- `metadata`: Contains basic information about the agent.
  - `name`: The unique name of the agent (e.g., `orchestrator-agent`).
  - `version`: The semantic version of the agent's implementation.
  - `author`: The name or ID of the agent's creator.
- `manifestVersion`: The version of the manifest schema itself. This allows for schema evolution over time.
- `capabilities`: A list of high-level abilities the agent possesses (e.g., `project_management`, `image_classification`).
- `intentPatterns`: A list of string patterns that can trigger the agent. These are used to map user intents to agent actions. The `*` can be used as a wildcard.
- `tools`: A list of tools the agent is allowed to use, specified with their name and version (e.g., `image_classifier:v1`).
- `modelPreset`: A reference to a predefined model configuration (e.g., `strategic`, `balanced`, `precise`). This determines the AI model and parameters the agent will use.
- `concurrency`: The maximum number of concurrent tasks the agent can handle.
- `promptsPath`: The file path to the directory containing the agent's prompt templates.
- `health`: Configuration for the agent's health checks.
  - `probe`: The endpoint or command to run for the health check (e.g., `/health`).
  - `interval_s`: The interval in seconds at which the health probe is checked.

## Versioning

A dual versioning system is used:

1.  **Agent Version (`metadata.version`)**: This uses **Semantic Versioning (semver)** (e.g., `1.2.3`). It versions the agent's own logic, prompts, and capabilities. This should be incremented by the agent developer whenever the agent's implementation changes.
2.  **Manifest Version (`manifestVersion`)**: This is a simple version number (e.g., `1.0`) for the manifest schema itself. It will only change if the structure of the manifest file (the fields themselves) is updated. This allows tools that parse these manifests to handle different schema versions.
