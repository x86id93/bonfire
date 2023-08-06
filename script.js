(async () => {
  
  const version_number = 9; // v6 is default, v9 is used by the client
  const GET = "GET";
  const DELETE = "DELETE";
  
  /**
   * Wrapper function for `fetch()` to streamline use of the Discord API.
   * @async
   * @param {string} endpoint - Discord API endpoint.
   * @param {string} method - Options method.
   * @param {string} token - Options headers authorization.
   */
  async function api(endpoint, method, token) {
    async function wait(ms) {
      console.log(`waiting ${ms}ms`);
      return new Promise(v => setTimeout(v, ms));
    }
    if (method !== GET || method !== DELETE) {
      console.error(`unaccepted method: ${method}`);
      return null;
    }
    phase = method;
    const resource = `https://discord.com/api/v${version_number}` + endpoint;
    const options = {
      method: method,
      headers: {
        "Authorization": token,
      },
    };
    while (true) {
      await wait(rates[phase].rate);
      const response = await fetch(resource, options);
      let retryAfter = reset_rate;
      for (const [k, v] of response.headers)
        if (k === "retry-after")
          retryAfter = v * 1e3; // convert to ms
      switch (response.status) {
        case 200: // OK
        case 204: // No Content
          break;
        case 202: // Accepted
          await wait(retryAfter);
          continue;
        case 429: // Too Many Requests
          await wait(retryAfter);
          rates[phase].target = rates[phase].rate * 1.1;
          rates[phase].rate = reset_rate;
          continue;
        default:
          console.error(`unexpected HTTP status code: ${response.status}`);
          return null;
      }
      return response;
    }
  }
  
  /**
   * Creates a search query and returns the response from the Discord API.
   * @async
   * @param {Object} channel - Represents a guild or DM channel within
   *                           Discord.
   * @param {string} token - Options headers authorization.
   * @param {string} user_id_cache - Author ID.
   * @param {number} offset - Number of results to skip.
   */
  async function search(channel, token, user_id_cache, offset) {
    // the client only uses multiples of 25 as offsets
    if (offset % 25 !== 0) {
      console.error(`offset not a multiple of 25: ${offset}`);
      return null;
    }
    const isGuild = channel.hasOwnProperty("guild_id");
    let query;
    if (isGuild)
      query = `/guilds/${channel.guild_id}/messages/search?` +
          `author_id=${user_id_cache}` +
          `&channel_id=${channel.id}` + // specify guild channel
          `&include_nsfw=true`;
    else
      query = `/channels/${channel.id}/messages/search?` +
          `author_id=${user_id_cache}`;
    if (offset)
      query += `&offset=${offset}`;
    const response = await api(query, GET, token);
    if (response)
      return await response.json();
    console.error("no response");
    return null;
  }
  
})();
