import { authHandlers } from "./auth.handlers";
import { profileHandlers } from "./profile.handlers";
import { publicHandlers } from "./public.handlers";
import { resumeHandlers } from "./resume.handlers";
import { scoreHandlers } from "./score.handlers";

export const handlers = [
  ...authHandlers,
  ...profileHandlers,
  ...resumeHandlers,
  ...scoreHandlers,
  ...publicHandlers,
];
