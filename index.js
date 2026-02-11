import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import axios from 'axios';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';

// Manual .env loading
try {
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
      }
    });
  }
} catch (e) {
  // Ignore .env errors
}

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

if (!UNSPLASH_ACCESS_KEY) {
  console.error("Error: Missing UNSPLASH_ACCESS_KEY environment variable.");
  process.exit(1);
}

const server = new McpServer({
  name: "unsplash-search",
  version: "1.0.0"
});

server.tool(
  "search_photos",
  "Search for high-quality photos on Unsplash",
  {
    query: z.string().describe("The search query (e.g., 'nature', 'cats')"),
    page: z.number().default(1).describe("Page number to retrieve results from"),
    per_page: z.number().default(5).describe("Number of photos per page (default: 5)")
  },
  async ({ query, page, per_page }) => {
    try {
      const response = await axios.get(`https://api.unsplash.com/search/photos`, {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
        },
        params: {
          query,
          page,
          per_page,
          orientation: "landscape" // defaulting to landscape for better display
        }
      });

      if (!response.data || !response.data.results) {
        return {
          content: [{ type: "text", text: "No results found or invalid response format." }]
        };
      }

      const results = response.data.results.map(photo => ({
        id: photo.id,
        description: photo.description || photo.alt_description || "No description",
        url: photo.urls.regular,
        download_url: photo.links.download,
        photographer: photo.user.name,
        likes: photo.likes
      }));

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(results, null, 2)
          }
        ]
      };
    } catch (error) {
      const errorMessage = error.response?.data?.errors?.join(', ') || error.message;
      return {
        content: [
          {
            type: "text",
            text: `Error fetching photos from Unsplash: ${errorMessage}`
          }
        ],
        isError: true
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Unsplash MCP Server started on stdio");
}

main().catch((error) => {
  console.error("Fatal error starting server:", error);
  process.exit(1);
});
