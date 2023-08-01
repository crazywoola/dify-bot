export const BASE_URL = "https://api.dify.ai/v1/";

export enum RequestMode {
  STREAM = "stream",
  JSON = "json",
}

export enum ResponseMode {
  STREAMING = "streaming",
  BLOCKING = "blocking",
}

class DifyClient {
  private apiKey: string;
  static routes = {
    application: {
      method: "GET",
      url: () => `/parameters`,
    },
    createChatMessage: {
      method: "POST",
      url: () => `/chat-messages`,
    },
  };

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async sendRequest(
    method: string,
    url: string,
    data: any = {},
    response_mode: ResponseMode = ResponseMode.BLOCKING
  ) {
    const headers = {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
    };

    const requestOptions: RequestInit = {
      method,
      headers,
    };

    if (method === "POST" || method === "PATCH" || method === "PUT") {
      requestOptions.body = JSON.stringify(data);
    }

    const response = await fetch(`${BASE_URL}${url}`, requestOptions);

    if (response_mode === ResponseMode.STREAMING) {
      const responseData = await response.text();
      return responseData;
    } else {
      const responseData = await response.json();
      return responseData;
    }
  }

  async getApplication() {
    return this.sendRequest(
      DifyClient.routes.application.method,
      DifyClient.routes.application.url()
    );
  }

  async createChatMessage(
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
      conversation_id,
    };
    return this.sendRequest(
      DifyClient.routes.createChatMessage.method,
      DifyClient.routes.createChatMessage.url(),
      data,
      response_mode
    );
  }
}

export default DifyClient;
