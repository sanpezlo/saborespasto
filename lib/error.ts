import { Dispatch, SetStateAction } from "react";
import { ZodError } from "zod";

import { ErrorResponse, ErrorResponseSchema } from "@/types/ErrorResponse";
import { ErrorModalProps } from "@/components/errorModal";

export function parseErrorResponse(e: unknown): ErrorResponse {
  const parsed = ErrorResponseSchema.safeParse(e);
  if (parsed.success) {
    return parsed.data;
  } else if (e instanceof Error) {
    return { error: { message: e.toString(), err: e } };
  } else if (e === undefined) {
    return {
      error: { message: "deriveError was passed a value of `undefined`." },
    };
  } else {
    return {
      error: {
        message: "deriveError was passed a value that was not an Error.",
        err: e,
      },
    };
  }
}

export function handleError(raw: unknown, response: Response): never {
  throw parseErrorResponse(
    raw ?? {
      error: { message: `${response.status}: ${response.statusText}` },
      status: response.status,
    }
  );
}

export function handleErrorModal(
  error: unknown,
  setErrorModal: Dispatch<SetStateAction<ErrorModalProps | null>>
) {
  if (error instanceof ZodError) {
    return setErrorModal({
      title: "Error: Datos inválidos",
      description: "",
      list: error.issues.map((issue) => issue.message),
    });
  }

  const e = parseErrorResponse(error);
  if (parseInt("" + e.status) >= 400 && parseInt("" + e.status) < 500) {
    return setErrorModal({
      title: "Error: Datos inválidos",
      description: e.error.message,
      list: [],
    });
  }

  return setErrorModal({
    title: "Error",
    description: "Ha ocurrido un error inesperado",
    list: [],
  });
}
