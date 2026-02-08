
import { useApiError } from "@/lib/use-api-error";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthApi } from "./auth.api";
import { TLoginRequest, TRegisterRequest } from "./auth.types";
import { useAuth } from "./auth.context";

export const useLogin = () => {
  const router = useRouter();
  const { setUser } = useAuth();
  const { getErrorMessage } = useApiError();

  return useMutation({
    mutationKey: ["login"],

    mutationFn: (payload: TLoginRequest) => AuthApi.login(payload),

    onSuccess: (data) => {
      Cookies.set("accessToken", data.tokens.accessToken)
      Cookies.set("refreshToken", data.tokens.refreshToken)
      setUser(data.user);
      router.push("/");
    },

    onError: (error: unknown) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

export const useRegister = () => {
  const router = useRouter();
  const { getErrorMessage } = useApiError();

  return useMutation({
    mutationKey: ["register"],

    mutationFn: (payload: TRegisterRequest) => AuthApi.register(payload),

    onSuccess: () => {
      router.push("/login");
    },

    onError: (error: unknown) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};
