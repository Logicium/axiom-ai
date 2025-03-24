import { Injectable } from '@nestjs/common';
import * as QNA from '@tensorflow-models/qna';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-cpu';
import {GoogleGenerativeAI} from '@google/generative-ai';
import * as process from "process";
import { pipeline } from '@huggingface/transformers';

@Injectable()
export class AppService {

  getHello(): string {
    return 'Hello World!';
  }

  async postInference(question:string,passage:string) {
    const model = await QNA.load();
    console.log(question,passage);
    const answers = await model.findAnswers(question, passage);
    console.log('Answers: ',answers);
    return answers;
  }

  async generateGeminiResponse(dream: string){
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? 'api_key');
    const model = genAI.getGenerativeModel({model:"gemini-2.0-flash"})
    const prompt = "Explain the meaning of this dream: "+ dream;

    const result = await model.generateContent(prompt);
    console.log(result.response.text());
    return result.response.text();
  }

  async generateInterpret(question:string,passage:string){
    const generator = await pipeline('text-generation', 'Xenova/distilgpt2');
    const text = passage + ' The meaning of this dream is ';
    console.log(text);
    const output = await generator(text, {
      temperature: 3,
      max_new_tokens: 300,
      repetition_penalty: 1.5,
      no_repeat_ngram_size: 2,
      num_beams: 2,
      num_return_sequences: 2,
    });
    console.log(output);
    return output;
  }
}
