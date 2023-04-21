import { ErrorResponse } from "@/types/ErrorResponse";

export type SSP<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: ErrorResponse;
    };
