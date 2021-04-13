export const GetUserWords = async ({ userId }, token, cb) => {
  const rawResponse = await fetch(`/users/${userId}/words/`, {
    method: 'GET',
    withCredentials: true,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });
  const content = await rawResponse.json();
  cb(content);
};
