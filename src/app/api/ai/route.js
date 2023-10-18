import { NextResponse } from 'next/server';

import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';
import { LLMChain } from 'langchain/chains';

export const POST = async (request) => {
  try {
    const { text } = await request.json();

    const model = new OpenAI({ temperature: 1 });
    const template =
      'Rewrite this paragraph in the style of hemingway. Use an active voice. Use a subject / object sentence structure.\n paragraph: {paragraph}';

    const prompt = new PromptTemplate({
      template,
      inputVariables: ['paragraph'],
    });

    const chain = new LLMChain({ llm: model, prompt });

    const result = await chain.call({ paragraph: text });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }

  return NextResponse.json(result, { status: 200 });
};
