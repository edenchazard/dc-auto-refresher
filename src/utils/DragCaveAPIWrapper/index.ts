import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import axios from 'axios';

type DragonCode = string;

interface APIDragon {
  id: DragonCode;
  name: string | null;
  owner: string;
  start: string;
  hatch: string | number;
  grow: string | number;
  death: string | number;
  views: number;
  unique: number;
  clicks: number;
  gender: '' | 'Male' | 'Female';
  hoursleft: number;
  parent_f: string;
  parent_m: string;
}

// Base API response
interface BaseAPIResponse {
  errors: Array<[0 | 1 | 2 | 3 | 4, string]>;
}

// Collection of dragons
interface APIDragonCollectionResult {
  dragons: Record<DragonCode, APIDragon>;
}

class DragCaveAPIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'APIError';
  }
}

// TODO add API response checking
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function checkDragons(dragons: Record<string, APIDragon>): void {
  // Function to validate API response from dragcave
  // Only checks the fields we need.
  function validate(responseObj: APIDragon): boolean {
    const props = ['grow', 'death', 'start', 'hatch', 'hoursleft'];

    // check every prop and ensure it exists in the API result
    for (const prop of props) {
      if (!(prop in responseObj)) {
        // as soon as one fails, short-circuit.
        return false;
      }
    }

    return true;
  }

  if (dragons !== undefined) {
    // Dragon data was returned, but the API response doesn't
    // match the layout we're expecting.
    for (const code in dragons) {
      if (!validate(dragons[code]))
        throw new DragCaveAPIError(`Unexpected dragon data for ${code}`);
    }
  }
}

class DragCaveAPIWrapper {
  private readonly http: AxiosInstance;

  constructor(private readonly apiKey: string) {
    this.http = axios.create({
      baseURL: `https://dragcave.net/api/${this.apiKey}/json`,
      headers: {
        'User-Agent': 'DragCave API Wrapper',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  private async _call<ExpectedResponse>(
    endpoint: string,
    // Key is the expected 'root' of the json
    // containing our result data, such as dragons.
    key: keyof ExpectedResponse,
    options: AxiosRequestConfig = {},
  ) {
    // perform pre-call checks, such as making sure the dev
    // doesn't utilise an url parameter. this could conflict
    // with our endpoint.
    if ('url' in options)
      throw new DragCaveAPIError('options parameter should not contain url');

    try {
      type FullResponse = ExpectedResponse & BaseAPIResponse;

      // get data from API
      const req = await this.http.request<FullResponse>({
        ...options,
        url: endpoint,
      });

      const { data } = req;
      const hasErrors = data.errors.length > 0;

      return {
        errors: data.errors.map((e) => ({ code: e[0], message: e[1] })),
        data: hasErrors ? null : (data[key] as ExpectedResponse[typeof key]),
      };
    } catch (ex: unknown) {
      console.log(ex);
      // todo add logging
      throw new DragCaveAPIError(
        `Unexpected response while trying to use the Dragcave API.`,
      );
    }
  }

  private async _get<ExpectedResponse>(
    endpoint: string,
    key: keyof ExpectedResponse,
    options: AxiosRequestConfig = {},
  ) {
    return await this._call<ExpectedResponse>(endpoint, key, {
      ...options,
      method: 'GET',
    });
  }

  private async _post<ExpectedResponse>(
    endpoint: string,
    key: keyof ExpectedResponse,
    data: Record<string, string>,
    options: AxiosRequestConfig = {},
  ) {
    return await this._call<ExpectedResponse>(endpoint, key, {
      ...options,
      method: 'POST',
      data: new URLSearchParams(data),
    });
  }

  async view(code: DragonCode) {
    const response = await this._get<APIDragonCollectionResult>(
      `/view/${code}`,
      'dragons',
    );

    // checkDragons(response.data);

    return {
      ...response,
      // rewrite the data object to reference the single dragon
      // it just makes things tidier
      data: response.data === null ? null : response.data[code],
    };
  }

  /*
    WARNING: THE API DOESN'T RETURN AN ERROR IF A NON-EXISTENT DRAGON
    IS SPECIFIED.
  */
  async massView(codes: DragonCode[]) {
    const response = await this._post<APIDragonCollectionResult>(
      `/massview`,
      'dragons',
      {
        ids: codes.join(','),
      },
    );

    // checkDragons(response.data);

    return response;
  }

  async info() {
    const response = await this._get<{
      data: {
        publickey: string;
        host: string;
        ip: string;
        returnurl: string;
      };
    }>(`/info`, 'data');
    return response;
  }
}

export { DragCaveAPIWrapper, DragCaveAPIError };
export type { APIDragon };
