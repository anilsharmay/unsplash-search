# Unsplash Image Search Extension

This extension adds image search capabilities to Gemini CLI using the Unsplash API.

## Installation

### Prerequisites

1.  **Get an API Key**:
    - Sign up at [Unsplash Developers](https://unsplash.com/developers).
    - Create a new application to get an Access Key.

2.  **Configure Environment**:
    Set the `UNSPLASH_ACCESS_KEY` environment variable in your shell profile (e.g., `.zshrc` or `.bashrc`), or pass it before running the CLI.
    ```bash
    export UNSPLASH_ACCESS_KEY="your_access_key_here"
    ```

### Install via Gemini CLI

You can install this extension directly from the GitHub repository:

```bash
gemini extensions install https://github.com/anilsharmay/unsplash-search
```

## Usage

Once installed and configured, run `gemini` and ask for images naturally:

> "Find me a picture of a sunset on a beach."

> "Search for high-quality photos of coding setups."

The extension exposes a `search_photos` tool that Gemini will use automatically.

## Development

To develop locally:

1. Clone the repository.
2. Install dependencies: `npm install`
3. Link the extension: `gemini extensions link .`
