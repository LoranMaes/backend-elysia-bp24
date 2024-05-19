import { regexEmail } from "./regex";

export function isValidEmail(email: string) {
  return regexEmail.test(email);
}
