#!/usr/bin/env bun
import fs from "fs";
import OpenAI from "openai";
import readline from "readline";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import openaiTokenCounter from "openai-gpt-token-counter";
import chalk from "chalk"; // Add chalk import
import {
    writeCode,
    readFile,
    listDirectory,
    runCommand,
    googleSearch,
    viewWebsite,
    countLetter,
    countWords,
    checkEbay,
} from "./functions";
import { handleImage } from "./functions/handleImage";
import { systemPrompt } from "./systemPrompt";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const modelName = "o3-mini";
console.log("Using model: ", modelName);

const GetWriteFileParameters = z.object({
    code: z.string(),
    fileName: z.string(),
});

const GetReadFileParameters = z.object({
    fileName: z.string(),
});

const GetStoryParameters = z.object({
    componentFileName: z.string(),
});

const GetDirectoryParameters = z.object({
    directory: z.string(),
});

const GetRunCommandParameters = z.object({
    command: z.string(),
});

const GetGoogleSearchParameters = z.object({
    query: z.string(),
});

const GetViewWebsiteParameters = z.object({
    url: z.string().url(),
});

const GetCountLettersParameters = z.object({
    letter: z.string(),
    word: z.string(),
});

const GetCountWordsParameters = z.object({
    text: z.string(),
});

const GetHandleImageParameters = z.object({
    imagePath: z.string().nonempty(),
});

const GetCheckEbayParameters = z.object({
    item: z.string(),
});

function createPreamble() {
    console.log(chalk.bold.cyan("Welcome to the Swiss Army Knife Tool"));
    console.log(
        chalk.yellow(
            "This tool is designed to help you with a variety of tasks, including:",
        ),
    );
    console.log(chalk.green("- Writing code"));
    console.log(chalk.green("- Reading files"));
    console.log(chalk.green("- Running commands"));
    console.log(chalk.green("- Searching Google"));
    console.log(chalk.green("- Viewing websites"));
    console.log(chalk.green("- Counting letters and words"));
    console.log(chalk.green("- Handling images"));
    console.log(chalk.green("- Listing directories"));
    console.log(chalk.green("- Checking eBay"));
    console.log(chalk.green("- And more!"));
    console.log("To read images type in read_image FILENAME");
}

interface ChatMessage {
    role: 'system' | 'user' | 'assistant' | 'function';
    content: string | Array<{ type: string; image_url: { url: string } }>;
    name?: string;
}

async function main() {
    createPreamble();
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const systemPromptMessage = {
        role: "system" as const,
        content: systemPrompt,
    };

    let chatHistory: ChatMessage[] = [systemPromptMessage];

    while (true) {
        const query = (await new Promise((resolve) => {
            rl.question(
                chalk.black.bold.bgYellow("Please enter your ai query: "),
                resolve,
            );
        })) as string;
        if (query === "exit") {
            break;
        }
        if (!query || query === null) {
            console.log(query, "No query");
            continue;
        }
        chatHistory.push({ role: "user", content: query });
        if (query.startsWith("read_image")) {
            const imagePath = query.split(" ")[1];
            if (imagePath) {
                let imageBase64;
                try {
                    imageBase64 = await handleImage({ imagePath });
                } catch (error) {
                    console.error("Error handling image:", error);
                    continue;
                }
                chatHistory.push({
                    role: "user",
                    content: [
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:image/jpeg;base64,${imageBase64.base64Image}`,
                            },
                        },
                    ],
                });
            } else {
                console.log("Please provide an image path after 'read_image'");
            }
        }

        const runner = openai.beta.chat.completions.runTools({
            model: modelName,
            messages: chatHistory as ChatCompletionMessageParam[],
            tools: [
                {
                    type: "function",
                    function: {
                        function: writeCode,
                        parameters: zodToJsonSchema(GetWriteFileParameters),
                    },
                },
                {
                    type: "function",
                    function: {
                        function: readFile,
                        parameters: zodToJsonSchema(GetReadFileParameters),
                    },
                },
                {
                    type: "function",
                    function: {
                        function: listDirectory,
                        parameters: zodToJsonSchema(GetDirectoryParameters),
                    },
                },
                {
                    type: "function",
                    function: {
                        function: runCommand,
                        description:
                            "Run a command in the terminal. This is for non interactive commands only and will timeout after 60s",
                        parameters: zodToJsonSchema(GetRunCommandParameters),
                    },
                },
                {
                    type: "function",
                    function: {
                        function: googleSearch,
                        parameters: zodToJsonSchema(GetGoogleSearchParameters),
                    },
                },
                {
                    type: "function",
                    function: {
                        function: viewWebsite,
                        parameters: zodToJsonSchema(GetViewWebsiteParameters),
                    },
                },
                {
                    type: "function",
                    function: {
                        function: countLetter,
                        description: "Count a single letter in a word.",
                        parameters: zodToJsonSchema(GetCountLettersParameters),
                    },
                },
                {
                    type: "function",
                    function: {
                        function: countWords,
                        parameters: zodToJsonSchema(GetCountWordsParameters),
                    },
                },
                {
                    type: "function",
                    function: {
                        function: checkEbay,
                        parameters: zodToJsonSchema(GetCheckEbayParameters),
                    },
                },
            ],
            stream: true,
        });

        let aiReply = '';
        process.stdout.write(chalk.green('')); // Initialize colored output

        for await (const chunk of runner) {
            if (chunk.choices[0]?.delta?.content) {
                const content = chunk.choices[0].delta.content;
                aiReply += content;
                process.stdout.write(chalk.green(content));
            }
        }

        process.stdout.write('\n'); // Add newline after streaming completes

        if (aiReply === '') {
            console.log(runner);
            aiReply = "done";
        }
        chatHistory.push({ role: "assistant", content: aiReply });
        const tokenCount = openaiTokenCounter.chat(chatHistory, "gpt-4");
        console.log("Token Count: ", tokenCount);
    }
}

main().catch(console.error);
