# Unsplash Image Search Extension

This extension adds image search capabilities to Gemini CLI using the Unsplash API.

## Installation

### Prerequisites

1.  **Get an API Key**:
    - Sign up at [Unsplash Developers](https://unsplash.com/developers).
    - Create a new application to get an Access Key.

2.  **Configure Environment**:
    
    You can either export the key in your shell profile (e.g., `.zshrc`):
    ```bash
    export UNSPLASH_ACCESS_KEY="your_access_key_here"
    ```
    
    OR create a `.env` file in the extension directory with:
    ```
    UNSPLASH_ACCESS_KEY=your_access_key_here
    ```

### Install via Gemini CLI

1.  Run the install command:
    ```bash
    gemini extensions install https://github.com/anilsharmay/unsplash-search
    ```

2.  **IMPORTANT: Install Dependencies**
    The extension requires external libraries. You must install them manually after adding the extension:
    ```bash
    cd ~/.gemini/extensions/unsplash-image-search
    npm install
    ```

3.  **Configure Environment** (if you haven't globally exported the key):
    Create a `.env` file in that same directory:
    ```bash
    echo "UNSPLASH_ACCESS_KEY=your_key_here" > .env
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
