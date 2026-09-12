import { authHandlers } from "./auth.handlers";
import { resumeHandlers } from "./resume.handlers";
import { scoreHandlers } from "./score.handlers";

export const handlers = [...authHandlers, ...resumeHandlers, ...scoreHandlers];
