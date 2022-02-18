import { Auth } from "../Auth.js";

export function fetchWithAuth (auth: Auth | undefined, url: string, init?: any | undefined) {
  if (url.startsWith("/")) {
    throw new TypeError("URLs should not start with a slash!");
  }

  const basePath = process.env.NODE_ENV === "development" ? "http://localhost:5001/friend-advisor/us-central1/app/" : "https://us-central1-friend-advisor.cloudfunctions.net/app/";
  url = (new URL(url, basePath)).href;

  if (auth) {
    init = init || {};
    init.headers = init.headers || {};
    // @ts-ignore
    init.headers.Authorization = "Bearer " + auth.userData.accessToken;
  }
  return fetch(url, init);
}
