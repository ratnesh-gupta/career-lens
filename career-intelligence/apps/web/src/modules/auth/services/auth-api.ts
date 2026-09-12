import type {
  AuthResponse,
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  User,
} from "@careerlens/shared-types";

import { http } from "@/services/api-client";
import { EP } from "@/services/endpoints";

export const authApi = {
  login: (input: LoginInput) => http.post<AuthResponse>(EP.AUTH_LOGIN, input),

  register: (input: RegisterInput) => http.post<AuthResponse>(EP.AUTH_REGISTER, input),

  logout: () => http.post<null>(EP.AUTH_LOGOUT),

  me: () => http.get<User>(EP.AUTH_ME),

  forgotPassword: (input: ForgotPasswordInput) =>
    http.post<{ message: string }>(EP.AUTH_FORGOT_PASSWORD, input),

  resetPassword: (input: ResetPasswordInput) =>
    http.post<{ message: string }>(EP.AUTH_RESET_PASSWORD, input),

  verifyEmail: (token: string) =>
    http.post<{ message: string }>(EP.AUTH_VERIFY_EMAIL, { token }),
};
