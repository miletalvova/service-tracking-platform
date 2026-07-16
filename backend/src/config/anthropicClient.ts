import Anthropic from '@anthropic-ai/sdk';

export const createClient = () =>
    new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY || '',
    });
