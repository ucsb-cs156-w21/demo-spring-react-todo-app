import unfetch from "isomorphic-unfetch";

export async function fetchWithToken(url, getToken, options) {
  const token = await getToken();
  const response = await unfetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status >= 400 && response.status < 600) {
    const json = await response.json();
    throw new Error("HTTP Error " + json.status + ": " + json.message);
  }
  if (options?.noJSON || response.status === 204) {
    return response;
  }
  return response.json();
}
