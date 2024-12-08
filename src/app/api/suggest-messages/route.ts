// import { createOpenAI } from '@ai-sdk/openai';
// import { streamText } from 'ai'; // Assuming this library handles streaming responses

// // Allow streaming responses up to 30 seconds
// export const maxDuration = 30;

// export async function POST(req: Request) {
//     try {
//         // Define the prompt
//         const prompt = `
//   Create a list of three open-ended and engaging questions formatted as a single string. 
//   Each question should be separated by "||". These questions are for an anonymous social 
//   messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid 
//   personal or sensitive topics, focusing instead on universal themes that encourage friendly 
//   interaction. 

//   For example, your output should be structured like this:
//   "What's a hobby you've recently started? || If you could have dinner with any historical figure, who would it be? || What's a simple thing that makes you happy?".

//   Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.
// `;

//         // Initialize the OpenAI client
//         const openai = createOpenAI({
//             apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is securely stored
//         });

//         // Generate a completion using the appropriate method
//         const response = await openai.completion('gpt-3.5-turbo-instruct', {
//             messages: [{ role: 'user', content: prompt }], // Pass prompt in the correct format
//             max_tokens: 400,
//             stream: true,
//         });

//         // Process the streaming response
//         const stream = streamText(response); // Assumes `streamText` processes OpenAI's streaming response

//         // Return the streaming response
//         return new Response(stream, {
//             headers: {
//                 'Content-Type': 'text/event-stream', // Correct content type for streaming
//             },
//         });
//     } catch (error) {
//         console.error('Error during POST request:', error);

//         // Handle OpenAI-specific errors
//         if (error instanceof openai.errors.OpenAIError) {
//             return new Response(
//                 JSON.stringify({ error: error.message }),
//                 { status: 400, headers: { 'Content-Type': 'application/json' } }
//             );
//         }

//         // Handle generic errors
//         return new Response(
//             JSON.stringify({ error: 'An unexpected error occurred.' }),
//             { status: 500, headers: { 'Content-Type': 'application/json' } }
//         );
//     }
// }
