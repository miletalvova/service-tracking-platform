import { createClient } from '../config/anthropicClient.js';
import type {
    TextBlock,
    Base64ImageSource,
    Tool,
    ToolUseBlock,
    ContentBlock,
    MessageParam,
} from '@anthropic-ai/sdk/resources';
import createError from 'http-errors';

const client = createClient();

export interface AIRequestClassification {
    service: string;
    priority: 'Low' | 'Medium' | 'High';
    cleanDescription: string;
}

export interface AIRequestUrgency {
    isUrgent: boolean;
    reason: string;
}

class AIService {
    async classifyRequest(description: string): Promise<AIRequestClassification> {
        if (!description.trim()) {
            throw createError(400, 'Description cannot be empty');
        }
        if (description.length > 1000) {
            throw createError(400, 'Description is too long. Maximum length is 1000 characters.');
        }
        if (description.length < 10) {
            throw createError(400, 'Description is too short. Please provide more details.');
        }

        const systemPrompt = `You are a service request classifier. 
        You ONLY output valid JSON. No markdown, no explanation, no backticks. Just raw JSON.`;

        const response = await client.messages.create({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 300,
            system: systemPrompt,
            messages: [
                {
                    role: 'user',
                    content: `Classify this service request:. 
                    
                    Request: ${description}

                    Return ONLY this JSON structure:
                    {
                        "service": "Plumbing | Electrical | IT Support | Cleaning | "Cooking" etc, whatever service category best fits the request",
                        "priority": "Low" | "Medium" | "High",
                        "cleanDescription": string // a cleaned up version of the original description, removing any irrelevant details or noise
                    }`,
                },
                {
                    role: 'assistant',
                    content: '{',
                },
            ],
        });

        const text = '{' + (response.content[0] as TextBlock).text;
        try {
            /* console.log("AI classification response:", text); */
            return JSON.parse(text) as AIRequestClassification;
        } catch (error) {
            const match = text.match(/({[\s\S]*})/);

            if (match) return JSON.parse(match[0]) as AIRequestClassification;

            console.error('Failed to parse AI response as JSON:', text);

            throw createError(502, 'AI response was not valid JSON');
        }
    }

    async detectUrgency(description: string): Promise<AIRequestUrgency> {
        if (!description.trim()) {
            throw createError(400, 'Description cannot be empty');
        }
        if (description.length > 1000) {
            throw createError(400, 'Description is too long. Maximum length is 1000 characters.');
        }
        if (description.length < 10) {
            throw createError(400, 'Description is too short. Please provide more details.');
        }

        const urgencyTools: Tool = {
            name: 'urgencyDetector',
            description:
                'Detects if a service request is urgent if it involves safety risks, flooding, power outages, or other critical issues.',
            input_schema: {
                type: 'object',
                properties: {
                    isUrgent: {
                        type: 'boolean',
                        description: 'Whether the request should be flagged as urgent',
                    },
                    reason: {
                        type: 'string',
                        description: 'Brief reason why this is urgent.',
                    },
                },
                required: ['isUrgent', 'reason'],
            },
        };

        const systemPrompt = `You are an urgency detector. Use the urgencyDetector tool to classify the request.`;

        const response = await client.messages.create({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 300,
            system: systemPrompt,
            messages: [
                {
                    role: 'user',
                    content: `Analyze this service request for urgency: ${description}`,
                },
            ],
            tools: [urgencyTools],
            tool_choice: { type: 'any' },
        });

        const toolUse = response.content.find(
            (block): block is ToolUseBlock => block.type === 'tool_use'
        );
        if (toolUse) {
            return toolUse.input as { isUrgent: boolean; reason: string };
        }
        return { isUrgent: false, reason: 'No urgency detected' };
    }

    async recommendTechnician(serviceRequest: any, technicians: any[]) {
        const systemPrompt = `You are a technician recommender. 
        You ONLY output valid JSON. No markdown, no explanation, no backticks. Just raw JSON.`;

        const response = await client.messages.create({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 300,
            system: systemPrompt,
            messages: [
                {
                    role: 'user',
                    content: `Given this service request: ${JSON.stringify(serviceRequest)}, recommend the best technician from this list: ${JSON.stringify(technicians)}.
                    Return ONLY JSON with this structure:
                    {
                    "technicianId": number,
                    "reason": string (brief explanation of why this technician is the best fit for the request)
                    }
                    `,
                },
                {
                    role: 'assistant',
                    content: '{',
                },
            ],
        });

        const text = '{' + (response.content[0] as TextBlock).text;

        try {
            return JSON.parse(text);
        } catch (err) {
            throw createError(502, 'AI service returned an invalid response');
        }
    }
}

export default new AIService();
