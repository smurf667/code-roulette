/*
 * Ensure a (minimally read level) API token is given.
 * The token is stored in local storage to avoid future prompts.
 */
const loader = async (baseURL) => {
  let token = localStorage.getItem('read-token');
  while (true) {
    if (!token) {
      token = window.prompt('Hello friend! Please specify GitLab API read token:');
    }
    const response = await fetch(`${baseURL}/user`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      }});
    if (response && response.status === 200) {
      localStorage.setItem('read-token', token);
      return token;
    }
    token = undefined;
  }
}

export default loader