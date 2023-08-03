import axios from 'axios';
export const BASE_URL = 'https://api.dify.ai/v1';

export enum RequestMode {
  STREAM = 'stream',
  JSON = 'json'
}

export enum ResponseMode {
  STREAMING = 'streaming',
  BLOCKING = 'blocking'
}

class DifyClient {
  private apiKey: string;
  static routes = {
    application: {
      method: 'GET',
      url: () => `/parameters`
    },
    createCompletionMessage: {
      method: 'POST',
      url: () => `/completion-messages`
    },
    createChatMessage: {
      method: 'POST',
      url: () => `/chat-messages`
    }
  };

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async sendRequest(
    method: string,
    url: string,
    data: any = {},
    params: any = {},
    response_mode: ResponseMode = ResponseMode.BLOCKING
  ) {
    const headers = {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };
    let response;
    if (response_mode === ResponseMode.STREAMING) {
      response = axios({
        method,
        url: `${BASE_URL}${url}`,
        headers,
        data,
        params,
        responseType: RequestMode.STREAM
      });
    } else {
      response = axios({
        method,
        url: `${BASE_URL}${url}`,
        headers,
        data,
        params,
        responseType: RequestMode.JSON
      });
    }

    return response;
  }

  getApplication() {
    return this.sendRequest(
      DifyClient.routes.application.method,
      DifyClient.routes.application.url()
    );
  }

  createChatMessage(
    inputs: any,
    query: string,
    user: string,
    conversation_id: string | null = null,
    response_mode: ResponseMode = ResponseMode.STREAMING
  ) {
    const data = {
      inputs,
      query,
      user,
      response_mode,
      conversation_id
    };
    return this.sendRequest(
      DifyClient.routes.createChatMessage.method,
      DifyClient.routes.createChatMessage.url(),
      data,
      {},
      response_mode
    );
  }

  createCompletionMessage(
    inputs: any,
    query: string,
    user: string,
    response_mode: ResponseMode = ResponseMode.STREAMING
  ) {
    const data = {
      inputs,
      query,
      user,
      response_mode
    };
    return this.sendRequest(
      DifyClient.routes.createCompletionMessage.method,
      DifyClient.routes.createCompletionMessage.url(),
      data,
      {},
      response_mode
    );
  }
}

export default DifyClient;
