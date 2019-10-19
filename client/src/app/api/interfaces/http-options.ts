export interface HttpOptions {
  headers?: {
    [name: string]: any;
  };
  params?: {
    [name: string]: any;
  };
  body?: {
    [name: string]: any;
  };
  sendRequestWithoutToken?: boolean;
  responseWithHeaders?: boolean;
  contentTypeAuto?: boolean;
  observe?: string;
  useBaseUrl?: boolean;
}
