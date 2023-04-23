import { ZodSchema } from "zod";

import { API_ADDRESS } from "@/lib/config";
import { handleError, parseErrorResponse } from "@/lib/error";
import { SSP } from "@/types/SSP";

type Opts<T> = {
  schema?: ZodSchema<T>;
  query?: URLSearchParams;
  refresh?: boolean;
};

export type APIOptions<T> = Opts<T> & RequestInit;

export function apiFetcherSWR<T>(opts?: APIOptions<T>) {
  return (path: string): Promise<T> =>
    apiFetcher(path, { ...opts }).then(({ data }) => data);
}

export function apiFetcherSSP<T>(
  path: string,
  opts?: APIOptions<T>
): Promise<SSP<T>> {
  return apiFetcher(path, { ...opts })
    .then(({ data }) => ({
      success: true as const,
      data,
    }))
    .catch((e) => ({
      success: false as const,
      error: parseErrorResponse(e),
    }));
}

export async function apiFetcher<T>(
  path: string,
  opts?: APIOptions<T>
): Promise<{ data: T; response: Response }> {
  const pathWithQuery = `${path}${
    opts?.query ? "?" + opts.query.toString() : ""
  }`;

  const request = buildRequest(pathWithQuery, { ...opts });
  const response = await fetch(request);
  const data = await getData(response);

  if (!isSuccessStatus(response.status)) {
    if (response.status === 401 && !opts?.refresh) {
      const request = buildRequest("/refresh", {
        method: "POST",
      });
      const response = await fetch(request);
      if (isSuccessStatus(response.status)) {
        return apiFetcher(path, { ...opts, refresh: true });
      }
    }
    handleError(data, response);
  }

  return { data: opts?.schema?.parse(data) ?? (data as T), response: response };
}

export const buildRequest = (path: string, opts?: RequestInit): Request => {
  const req = new Request(`${API_ADDRESS}${path}`, {
    mode: "cors",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    ...opts,
  });
  return req;
};

export function isSuccessStatus(code: number) {
  return code >= 200 && code <= 299;
}

export async function getData(response: Response): Promise<unknown> {
  return response.json();
}

function isJSON(response: Response): boolean {
  const contentType = response.headers.get("Content-Type");
  return contentType === "application/json";
}

function getTokens() {}
