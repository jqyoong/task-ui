import axios, { Axios, AxiosError, AxiosRequestConfig, AxiosResponse, CreateAxiosDefaults } from 'axios';
import querystring from 'query-string';

import { resolvePromise } from '@/lib/utils';

interface ErrorResponse {
  message: string;
  frontend_type: string;
  details: Record<string, unknown>;
  id: string;
  // Add other fields that your API returns in an error response
}

class API {
  #baseUrl: string;
  #settings: CreateAxiosDefaults;
  #api: Axios;

  constructor(env?: Partial<NodeJS.ProcessEnv>) {
    this.#baseUrl = env?.API_BASE_URL ?? 'http://localhost:3000';

    this.#settings = {
      baseURL: this.#baseUrl,
      timeout: 20 * 60 * 1000,
    };

    this.#api = axios.create(this.#settings);
  }

  async validateSessionToken(
    promise: Promise<unknown>
  ): Promise<[error: AxiosError<ErrorResponse> | null, response: AxiosResponse | null]> {
    const [error, response] = await resolvePromise(promise);

    if (error) {
      if (error.response && error.response.status === 401) {
        // logout user here
      }

      if (!error.response) {
        // error from axios, not from api server
        const errorResponse = {
          data: {
            message: error,
          },
        };
        error.response = errorResponse;
      }
    }

    return [error, response];
  }

  // CRUD
  get({
    path,
    qs = null,
    api = this.#api,
    config = {},
  }: {
    path: string;
    qs?: Record<string, unknown> | null;
    api?: Axios;
    config?: AxiosRequestConfig;
  }) {
    const queryParams = Object.assign({}, qs || {});
    const queryString = querystring.stringify(queryParams);

    return this.validateSessionToken(api.get(`${path}${qs ? `?${queryString}` : ''}`, config));
  }

  post({ path, payload, config = {}, api = this.#api }: { path: string; payload?: unknown; config?: AxiosRequestConfig; api?: Axios }) {
    return this.validateSessionToken(api.post(path, payload, config));
  }

  put({ path, payload, api = this.#api, config = {} }: { path: string; payload?: unknown; api?: Axios; config?: AxiosRequestConfig }) {
    return this.validateSessionToken(api.put(path, payload, config));
  }

  patch({ path, payload, config = {}, api = this.#api }: { path: string; payload?: unknown; config?: AxiosRequestConfig; api?: Axios }) {
    return this.validateSessionToken(api.patch(path, payload, config));
  }

  delete({ path, config, api = this.#api }: { path: string; config?: AxiosRequestConfig; api?: Axios }) {
    return this.validateSessionToken(api.delete(path, config));
  }
}

export default API;
