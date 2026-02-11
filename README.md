# Unsplash Image Search Extension

This extension adds image search capabilities to Gemini CLI using the Unsplash API.

## Installation

1.  **Get an API Key**:
    - Sign up at [Unsplash Developers](https://unsplash.com/developers).
    - Create a new application to get an Access Key.

2.  **Link the Extension**:
    Navigate to this directory and run:
    ```bash
    gemini extensions link .
    ```

3.  **Configure Environment**:
    Set the `UNSPLASH_ACCESS_KEY` environment variable. You can do this in your shell profile (e.g., `.zshrc` or `.bashrc`):
    ```bash
    export UNSPLASH_ACCESS_KEY="your_access_key_here"
    ```
    Alternatively, you can create a `.env` file in the root of your project where you run Gemini CLI (if supported by your setup).

## Usage

Once installed and configured, you can ask Gemini to find images:

> "Find me a picture of a sunset on a beach."
> "Search for high-quality photos of coding setups."

 The extension exposes a `search_photos` tool that Gemini will use automatically.
