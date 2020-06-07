import { Request, Response } from 'express';

class TestController {
  show(request: Request, response: Response) {
    return response.json({ message: 'Hello World' });
  }
}

export default TestController;