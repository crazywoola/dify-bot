import axios, { AxiosResponse, Method } from 'axios';

export const BASE_URL = process.env.DIFY_API_BASE_URL;

export enum RequestMode {
  STREAM = 'stream',
  JSON = 'json'
}

export enum ResponseMode {
  STREAMING = 'streaming',
  BLOCKING = 'blocking'
}

// Define the structure of the route
interface Route {
  method: Method;
  url: () => string;
}

class DifyClient {
  private apiKey: string;
  static routes: { [key: string]: Route } = {
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

  // This method sends a request to the specified url with the given data and parameters
  async sendRequest(
    method: Method,
    url: string,
    data: any = {},
    params: any = {},
    response_mode: ResponseMode = ResponseMode.BLOCKING
  ): Promise<AxiosResponse<any>> {
    const headers = {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };

    try {
      const response = await axios({
        method,
        url: `${BASE_URL}${url}`,
        headers,
        data,
        params,
        responseType:
          response_mode === ResponseMode.STREAMING
            ? RequestMode.STREAM
            : RequestMode.JSON
      });

      return response;
    } catch (error) {
      console.error(
        `Error occurred while making a ${method} request to ${url}`,
        error
      );
      throw error;
    }
  }

  // This method retrieves the application data
  getApplication(): Promise<AxiosResponse<any>> {
    return this.sendRequest(
      DifyClient.routes.application.method,
      DifyClient.routes.application.url()
    );
  }

  // This method creates a chat message
  createChatMessage(
    inputs: any,
    query: string,
    user: string,
    conversation_id: string | null = null,
    response_mode: ResponseMode = ResponseMode.STREAMING
  ): Promise<AxiosResponse<any>> {
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

  // This method creates a completion message
  createCompletionMessage(
    inputs: any,
    query: string,
    user: string,
    response_mode: ResponseMode = ResponseMode.STREAMING
  ): Promise<AxiosResponse<any>> {
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
