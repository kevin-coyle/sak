# Swiss Army Knife (sak)

A versatile command-line tool powered by AI that helps you with various tasks including code generation, file operations, web searches, and more.

## Features

- 🖥️ Write and manage code files
- 📁 Read files and list directories
- 🔍 Search Google
- 🌐 View and scrape websites
- 📊 Count letters and words in text
- 🖼️ Handle and analyze images
- 🛍️ Check eBay listings
- ⌨️ Run system commands
- And more!

## Prerequisites

- [Bun](https://bun.sh/) - Fast all-in-one JavaScript runtime
- OpenAI API key
- (Optional) Google Search API key for search functionality

## Installation

1. Clone the repository
2. Install dependencies:
```bash
bun install
```

3. Create a `.env` file with your API keys:
```env
OPENAI_API_KEY=your_key_here
GOOGLE_SEARCH_API_KEY=your_key_here  # Optional
```

## Usage

Run the tool using Bun:

```bash
bun run index.ts
```

Or use the CLI command after installation:

```bash
sak
```

The tool provides an interactive prompt where you can enter your queries. It uses an LLM to understand and execute your requests using various built-in functions.

### Special Commands

- `read_image FILENAME` - Analyze an image file
- `exit` - Exit the application

## Available Functions

- `writeCode` - Generate and save code files
- `readFile` - Read file contents
- `listDirectory` - List directory contents
- `runCommand` - Execute system commands
- `googleSearch` - Perform Google searches
- `viewWebsite` - View and scrape website content
- `countLetter` - Count occurrences of a letter in text
- `countWords` - Count words in text
- `checkEbay` - Search eBay listings
- `handleImage` - Process and analyze images

## Dependencies

- chalk
- dotenv
- google-search-results-nodejs
- ollama
- openai
- puppeteer
- turndown
- zod
- And more

## Development

This project uses TypeScript and is built with Bun. To contribute or modify:

1. Make your changes
2. Test locally using `bun run index.ts`
3. Build using Bun's bundler if needed

## License

[Add your license information here]

## Testing Instructions

To run the tests for this project, you can use the following command:

```bash
bun test
```

This command will run all the tests in the project and display the results in the terminal.
