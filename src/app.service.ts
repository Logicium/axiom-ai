import { Injectable } from '@nestjs/common';
import * as QNA from '@tensorflow-models/qna';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-cpu';

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
}
