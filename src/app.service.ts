import { Injectable } from '@nestjs/common';
import * as QNA from '@tensorflow-models/qna';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-cpu';

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
