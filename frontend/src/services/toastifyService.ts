import { toast } from "react-toastify";

type ResponseError = {
  response: { data?: { message?: string | string[] } };
};
type FrontError = {
  message: string;
};
class ToastifyService {
  error(msg: ResponseError | FrontError) {
    const message = this.errorMessageExtractor(msg);
    if (Array.isArray(message)) message.forEach((err) => toast.error(err));
    else toast.error(message);
  }

  success(msg: string) {
    toast.success(msg);
  }

  info(msg: string) {
    toast.info(msg);
  }

  private errorMessageExtractor(err: ResponseError | FrontError) {
    let message: string | string[] = "Unknown Error has accured!";
    if ("response" in err) {
      if (err.response.data?.message) message = err.response.data?.message;
    } else if (err.message) message = err.message;
    return message;
  }
}

export const toastifyService = new ToastifyService();
