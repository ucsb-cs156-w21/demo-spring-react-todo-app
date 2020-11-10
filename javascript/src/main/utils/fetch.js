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
    throw new Error(json.message);
  }
  if (options?.noJSON) {
    return response;
  }
  return response.json();
}
