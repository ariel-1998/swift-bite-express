import { toast } from "react-toastify";
import { ZodError } from "zod";

export type ResponseError = {
  response: { data?: { message?: string | string[] } };
};
export type FrontError = {
  message: string | string[];
};

const defaultErr = "Unknown Error has accured!";

class ToastifyService {
  error(err: ResponseError | FrontError | ZodError) {
    const message = this.errorMessageExtractor(err);
    toast.error(message);
  }

  success(msg: string) {
    toast.success(msg);
  }

  info(msg: string) {
    toast.info(msg);
  }

  private valideAndExtractError(error: string | string[] | unknown) {
    if (!Array.isArray(error)) {
      if (typeof error !== "string") return defaultErr;
      return error;
    }
    if (typeof error[0] !== "string") return defaultErr;
    return error[0];
  }

  private errorMessageExtractor(
    err: ResponseError | FrontError | ZodError | Error
  ) {
    if (typeof err !== "object") return defaultErr;
    if (err instanceof ZodError) {
      return err.issues[0]?.message || "Invalid Input Data";
    }

    if ("response" in err) {
      if (err.response.data?.message) {
        return this.valideAndExtractError(err.response.data?.message);
      }
    }
    if ("message" in err) return this.valideAndExtractError(err.message);

    return defaultErr;
  }
}

export const toastifyService = new ToastifyService();
