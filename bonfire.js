(async () => {
    
    const colors = {
      fg: {
        a: "#ffffff",
        b: "#797979",
      },
      bg: {
        a: "#26242f",
        b: "#34323d",
        c: "#222129",
      },
      brand: {
        a: "#9ec7fb",
        b: "#9191fb",
      },
    };
    
    const windowFeatures = "left=100,top=100,width=320,height=320";
    const ui = window.open("", "", windowFeatures);
    if (!ui?.document?.write) {
      console.error("cannot write to ui document");
      return;
    }
    
    // markup in parentheses to make collapsible in editors
    const markup = (`<!-- ui markup -->
      <!DOCTYPE html>
      <html>
        <head>
          <title>barr</title>
          <style>
            .center-vertical {
              display: flex;
              align-items: center;
            }
            .center-horizontal {
              display: flex;
              justify-content: center;
            }
            .channel {
              margin: 5px;
              border-radius: 3px;
              display: flex;
              align-items: center;
              justify-content: center;
              user-select: none;
              white-space: nowrap;
            }
            .checkmark {
              height: 20px;
              opacity: 25%;
              width: 20px;
            }
            .collapsible {
              cursor: pointer;
            }
            .container {
              cursor: pointer;
              display: flex;
            }
            .container input {
              opacity: 0;
              position: absolute;
            }
            .container:hover input ~ .checkmark {
              opacity: 50%;
            }
            .container input:checked ~ .checkmark {
              opacity: 100%;
            }
            .content {
              display: none;
              overflow: hidden;
            }
            .point {
              border-radius: 50%;
              height: 7px;
              margin-right: 11px;
              width: 7px;
            }
            .shadow {
              box-shadow: 0px 0px 1.5px 0.5px #0008;
            }
            .text {
              user-select: none;
              font-family: sans-serif;
              font-size: 12px;
              color: ${colors.fg.a};
            }
            button {
              background-image: linear-gradient(to right, ${colors.brand.a}, ${colors.brand.b});
              border: none;
              border-radius: 3px;
              color: ${colors.fg.a};
            }
            button:hover {
              opacity: 75%;
              transition-duration: 0.2s;
            }
            button:active {
              opacity: 50%;
            }
            button:disabled {
              opacity: 25%;
            }
          </style>
        </head>
        <body style="background-color: ${colors.bg.a}; margin: 0px; padding: 0px;">
          
          <!-- top panel -->
          <div class="shadow" style="background-color: inherit; left: 0px; position: fixed; top: 0px; width: 100%; z-index: 1;">
            
            <!-- start/stop buttons -->
            <button id="start" style="height: 32px; margin: 5px; width: 100px;" disabled>Start</button>
            <button id="stop" style="height: 32px; margin: 5px; width: 100px;" disabled>Stop</button>
            
            <!-- counters -->
            <div class="text center-vertical" style="float: right; height: 42px; margin-right: 11px;">
              
              <!-- deleted counter -->
              <div class="point" style="background-color: ${colors.brand.a}; outline: 2px solid ${colors.brand.a}7f;"></div>
              <div id="deleted" style="margin-right: 4px;">0</div>
              <div style="margin-right: 16px;">deleted</div>
              
              <!-- failed counter -->
              <div class="point" style="background-color: ${colors.brand.a}; outline: 2px solid ${colors.brand.a}7f;"></div>
              <div id="failed" style="margin-right: 4px;">0</div>
              <div style="margin-right: 8px;">failed</div>
              
            </div>
            
          </div>
          
          <div id="insert" style="margin-top: 47px;"></div>
        </body>
      </html>
    `);
    
    // Warning: Use of the `document.write()` method is strongly discouraged.
    ui.document.write(markup);
    
    const elements = {
      deleted: ui.document.getElementById("deleted"),
      failed: ui.document.getElementById("failed"),
      insert: ui.document.getElementById("insert"),
      start: ui.document.getElementById("start"),
      stop: ui.document.getElementById("stop"),
    };
    
    const version_number = 9; // v6 is default, v9 is used by the client
    const GET = "GET";
    const DELETE = "DELETE";
    
    let phase = GET;
    const reset_rate = 3e3;
    const rates = {
      "GET": {
        target: 2e3,
        rate: reset_rate,
      },
      "DELETE": {
        target: 1e3,
        rate: reset_rate,
      },
      update: function () {
        this.rates[phase].rate = (this.rates[phase].rate -
            this.rates[phase].target) * Math.pow(Math.E, -1e-3) +
            this.rates[phase].target;
      },
    };
    
    const mapping = [];
    
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
    
    elements.start.disabled = false;
    
})();
