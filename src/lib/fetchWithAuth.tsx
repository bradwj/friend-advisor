import { Auth } from "../Auth.js";

export function fetchWithAuth (auth: Auth | undefined, input: any, init?: any | undefined) {
  if (auth) {
    init = init || {};
    init.headers = init.headers || {};
    // @ts-ignore
    init.headers.Authorization = "Bearer " + auth.userData.accessToken;
  }
  return fetch(input, init);
}
