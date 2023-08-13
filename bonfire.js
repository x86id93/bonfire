(async () => {
  
  // hex codes used to theme the ui
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
      a: "#91a1f9",
      b: "#9ec9f7",
    },
  };
  
  // types and values as specified in Discord documentation
  const types = {
    channel: {
      GUILD_TEXT:          0,
      DM:                  1,
      GUILD_VOICE:         2,
      GROUP_DM:            3,
      GUILD_CATEGORY:      4,
      GUILD_ANNOUNCEMENT:  5,
      ANNOUNCEMENT_THREAD: 10,
      PUBLIC_THREAD:       11,
      PRIVATE_THREAD:      12,
      GUILD_STAGE_VOICE:   13,
      GUILD_DIRECTORY:     14,
      GUILD_FORUM:         15,
      GUILD_MEDIA:         16,
    },
    message: {
      DEFAULT:                                      0,
      RECIPIENT_ADD:                                1,
      RECIPIENT_REMOVE:                             2,
      CALL:                                         3,
      CHANNEL_NAME_CHANGE:                          4,
      CHANNEL_ICON_CHANGE:                          5,
      CHANNEL_PINNED_MESSAGE:                       6,
      USER_JOIN:                                    7,
      GUILD_BOOST:                                  8,
      GUILD_BOOST_TIER_1:                           9,
      GUILD_BOOST_TIER_2:                           10,
      GUILD_BOOST_TIER_3:                           11,
      CHANNEL_FOLLOW_ADD:                           12,
      GUILD_DISCOVERY_DISQUALIFIED:                 14,
      GUILD_DISCOVERY_REQUALIFIED:                  15,
      GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING: 16,
      GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING:   17,
      THREAD_CREATED:                               18,
      REPLY:                                        19,
      CHAT_INPUT_COMMAND:                           20,
      THREAD_STARTER_MESSAGE:                       21,
      GUILD_INVITE_REMINDER:                        22,
      CONTEXT_MENU_COMMAND:                         23,
      AUTO_MODERATION_ACTION:                       24,
      ROLE_SUBSCRIPTION_PURCHASE:                   25,
      INTERACTION_PREMIUM_UPSELL:                   26,
      STAGE_START:                                  27,
      STAGE_END:                                    28,
      STAGE_SPEAKER:                                29,
      STAGE_TOPIC:                                  31,
      GUILD_APPLICATION_PREMIUM_SUBSCRIPTION:       32,
    },
  };
  
  // ui markup (no categories)
  const markup = `<!DOCTYPE html>
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
        background-image: url('data:image/svg+xml; utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path fill="rgba(255, 255, 255, 1.0)" d="m395-387 264-263q11-11 25-10.5t25 11.5q11 11 11 25t-11 25L421-311q-11 11-25.5 11T370-311L251-430q-11-11-11-25t11-25q11-11 25-11t25 11l94 93Z"/></svg>');
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
        cursor: pointer;
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
        cursor: pointer;
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
    <div class="shadow" style="background-color: inherit; left: 0px; position: fixed; top: 0px; width: 100%; z-index: 1;">
      <div class="center-vertical" style="float: left; height: 42px; width: 350px;">
        <button id="start" style="height: 32px; margin: 5px; width: 100px;" disabled>Start</button>
        <button id="stop" style="height: 32px; margin: 5px; width: 100px;" disabled>Stop</button>
        <div style="margin-left: 8px; background-image: linear-gradient(to right, ${colors.brand.a}20, ${colors.brand.b}20); border-radius: 50%; width: 20px; height: 20px;">
          <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20">
            <defs>
              <linearGradient id="brand" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color: ${colors.brand.a}; stop-opacity: 1"/>
                <stop offset="100%" style="stop-color: ${colors.brand.b}; stop-opacity: 1"/>
              </linearGradient>
            </defs>
            <path fill="url(#brand)" d="M192-384q0-95 45-174t99-136.5q54-57.5 99-89.5l45-32v119q0 30 21 51t52 21q17 0 30.5-7t24.5-20l16-20q63 36 104 117t40 170q-1 78-37.5 142.5T628-138q16-23 24-49t8-53q0-33-11.5-64T614-360L480-510 346-360q-23 25-34.5 56T300-240q0 28 8.5 54.5T334-136q-66-39-104-105t-38-143Zm288-18 80 90q14 15 21 33.5t7 38.5q0 45-31.5 76.5T480-132q-45 0-76.5-31.5T372-240q0-20 7-38.5t21-33.5l80-90Z"/>
          </svg>
        </div>
        <div class="text" style="margin-left: 8px;">bonfire 0.9.0</div>
      </div>
      <div class="text center-vertical" style="float: right; height: 42px; margin-right: 11px;">
        <div class="point" style="background-color: ${colors.brand.a}; outline: 2px solid ${colors.brand.a}7f;"></div>
        <div id="deleted" style="margin-right: 4px;">0</div>
        <div style="margin-right: 16px;">deleted</div>
        <div class="point" style="background-color: ${colors.brand.a}; outline: 2px solid ${colors.brand.a}7f;"></div>
        <div id="failed" style="margin-right: 4px;">0</div>
        <div style="margin-right: 8px;">failed</div>
      </div>
    </div>
    <div id="insert" style="margin-top: 47px;"></div>
  </body>
</html>`;
  const ui = window.open("", "", "left=100,top=100,width=320,height=320");
  if (!ui?.document?.write) {
    throw new Error("Cannot write to document; check if pop-ups are blocked");
  }
  ui.document.write(markup);
  
  const elems = {
    deleted: ui.document.getElementById("deleted"),
    failed: ui.document.getElementById("failed"),
    insert: ui.document.getElementById("insert"),
    start: ui.document.getElementById("start"),
    stop: ui.document.getElementById("stop"),
  };
  
  // maps category IDs to arrays of channel IDs
  const mapping = [];
  
  // ui deleted and failed counters
  let deleted = 0;
  let failed = 0;
  
  // Discord API version number
  const version_number = 9;

  const GET = "GET";
  const DELETE = "DELETE";
  let phase = GET;
  const resetRate = 3e3;
  const rates = {
    "GET": {
      target: 2e3,
      rate: resetRate,
    },
    "DELETE": {
      target: 1e3,
      rate: resetRate,
    },
    update: function () {
      rates[phase].rate = (rates[phase].rate -
          rates[phase].target) * Math.pow(Math.E, -1e-3) +
          rates[phase].target;
    },
  };
  
  class MarkupBuilder {
    constructor() {
      this.markup = "";
    }
    
    openCategory(name, id) {
      name = name.replace(/[^a-z0-9:,. ]/gi, "");
      this.markup += `
<div class="channel text" style="width: calc(100% - 10px); margin: 5px; background-color: ${colors.bg.b}; height: 32px;">
<label class="container" style="margin-left: 11px; margin-right: 18px;">
  <input id="${id}" type="checkbox">
  <span class="checkmark"></span>
</label>
<div class="collapsible center-vertical" style="height: 42px; width: 100%;">${name}</div>
</div>
<div class="content">`;
    }
    
    addChannel(name, id) {
      this.alternate = !this.alternate;
      name = name.replace(/[^a-z0-9:,. ]/gi, "");
      this.markup += `
<div class="channel text" style="width: calc(100% - 10px); margin: 5px; background-color: ${colors.bg.b}44; height: 20px;">
  <label class="container" style="margin-left: 11px; margin-right: 18px;">
    <input id="${id}" type="checkbox">
    <span class="checkmark"></span>
  </label>
  <div class="center-vertical" style="width: 100%;">${name}</div>
  <div id="status_${id}" class="center-horizontal center-vertical" style="width: 100px; margin-left: 5px; background-color: ${colors.bg.b}; height: 20px; border-radius: 3px;">pending</div>
</div>`;
    }
    
    closeCategory() {
      this.markup += `
<div style="margin-top: 36px;"></div>
</div>`;
    }
    
    get() {
      return this.markup;
    }
  }
  
  function updateStatus(id, s) {
    const elem = ui.document.getElementById(`status_${id}`);
    elem.textContent = s;
    switch (s) {
      case "active":
        elem.style.color = colors.fg.a;
        elem.style.backgroundImage = `linear-gradient(to right, ${colors.brand.a}, ${colors.brand.b})`;
        elem.style.opacity = "100%";
        break;
      
      case "queued":
        elem.style.color = colors.fg.a;
        elem.style.backgroundImage = `linear-gradient(to right, ${colors.brand.a}, ${colors.brand.b})`;
        elem.style.opacity = "50%";
        break;
      
      case "pending":
      case "done":
      case "skipped":
      default:
        elem.style.color = colors.fg.b;
        elem.style.backgroundImage = "none";
        elem.style.backgroundColor = colors.bg.b;
        elem.style.opacity = "100%";
        break;
    }
  }
  
  function makeCategoriesCollapsible() {
    const collapsible = ui.document.getElementsByClassName("collapsible");
    for (let i = 0; i < collapsible.length; i++) {
      collapsible[i].addEventListener("click", function () {
        this.classList.toggle("active");
        const style = this.parentElement.nextElementSibling.style;
        style.display = style.display === "block" ? "none" : "block";
      });
    }
  }
  
  async function api(endpoint, method, token) {
    const wait = async (ms) => new Promise(v => setTimeout(v, ms));
    phase = method;
    const resource = `https://discord.com/api/v${version_number}${endpoint}`;
    const options = {
      method: method,
      headers: {
        "Authorization": token,
      },
    };
    while (true) {
      await wait(rates[phase].rate);
      let response;
      try {
        response = await fetch(resource, options);
      } catch (exceptionVar) {
        console.error(exceptionVar);
        rates[phase].rate = resetRate;
      }
      let retryAfter = resetRate;
      for (const [k, v] of response.headers)
        if (k === "retry-after")
          retryAfter = v * 1e3;
      switch (response.status) {
        case 200:
        case 204:
          break;
        
        case 202:
          await wait(retryAfter);
          continue;
        
        case 429:
          await wait(retryAfter);
          rates[phase].target = rates[phase].rate * 1.1;
          rates[phase].rate = resetRate;
          continue;
        
        default:
          throw new Error("Unexpected HTTP status code");
      }
      return response;
    }
  }
  
  async function search(channel, token, authorId, offset) {
    const isGuild = channel.hasOwnProperty("guild_id");
    let query = isGuild ? `/guilds/${channel.guild_id}/messages/search?` +
                            `author_id=${authorId}` +
                            `&channel_id=${channel.id}` +
                            `&include_nsfw=true`
                        : `/channels/${channel.id}/messages/search?` +
                            `author_id=${authorId}`;
    if (offset)
      query += `&offset=${offset}`;
    const response = await api(query, GET, token);
    if (response)
      return await response.json();
    return null;
  }
  
  async function remove(message, token) {
    const response = await api(
      `/channels/${message.channel_id}/messages/${message.id}`, DELETE, token);
    if (response?.status === 204) {
      console.log("deleted message");
      elems.deleted.textContent = ++deleted;
      return true;
    }
    console.log("failed to delete message");
    elems.failed.textContent = ++failed;
    return false;
  }
  
  async function getChannels(token) {
    const response = await api("/users/@me/channels", GET, token);
    const channels = await response.json();
    return channels;
  }
  
  async function getGuilds(token) {
    const response = await api("/users/@me/guilds", GET, token);
    const guilds = await response.json();
    return guilds;
  }
  
  async function getGuildChannels(guild, token) {
    const response = await api(`/guilds/${guild.id}/channels`, GET, token);
    const guildChannels = await response.json();
    return guildChannels;
  }
  
  function toggle(e) {
    const state = ui.document.getElementById(e.target.id).checked;
    for (const v of mapping[e.target.id])
      ui.document.getElementById(v).checked = state;
  }
  
  function getCredentials() {
    window.dispatchEvent(new Event("beforeunload"));
    const iframe = document.body.appendChild(document.createElement("iframe"));
    const localStorage = iframe.contentWindow.localStorage;
    const token = JSON.parse(localStorage.token);
    const userId = JSON.parse(localStorage.user_id_cache);
    const credentials = {
      token: token,
      userId: userId,
    };
    return credentials;
  }
  
  const { token, userId } = getCredentials();
  const aggregate = [];
  
  console.log("requesting channels");
  const channels = await getChannels(token);
  mapping["channels"] = [];
  
  // build category
  let builder = new MarkupBuilder();
  builder.openCategory("channels", "channels");
  for (const channel of channels) {
    aggregate.push(channel);
    mapping["channels"].push(channel.id);
    let name;
    switch (channel.type) {
      case types.channel.DM:
        name = channel.recipients[0].username;
        break;
      
      case types.channel.GROUP_DM:
        name = "You, ";
        for (const recipient of channel.recipients) {
          name += ` ${recipient.username}`;
        }
        break;
      
      default:
        throw new Error("Unknown channel type");
    }
    builder.addChannel(name, channel.id);
  }
  builder.closeCategory();
  
  // insert category
  elems.insert.insertAdjacentHTML("beforeend", builder.get());
  ui.document.getElementById("channels")
             .addEventListener("change", e => toggle(e));
  
  console.log("requesting guilds");
  const guilds = await getGuilds(token);
  for (const guild of guilds) {
    
    console.log("requesting guild channels");
    const guildChannels = guild.channels = await getGuildChannels(guild, token);
    mapping[guild.id] = [];
    
    // build category
    let builder = new MarkupBuilder();
    builder.openCategory(guild.name, guild.id);
    for (const guildChannel of guildChannels) {
      if (![
        types.channel.GUILD_TEXT,
        types.channel.GUILD_VOICE
      ].includes(guildChannel.type)) {
        continue;
      }
      aggregate.push(guildChannel);
      mapping[guild.id].push(guildChannel.id);
      builder.addChannel(guildChannel.name, guildChannel.id);
    }
    builder.closeCategory();
    
    // insert category
    elems.insert.insertAdjacentHTML("beforeend", builder.get());
    ui.document.getElementById(guild.id)
               .addEventListener("change", e => toggle(e));
    
  }
  makeCategoriesCollapsible();
  
  elems.start.addEventListener("click", async () => {
    stop = false;
    console.group("start");
    elems.start.disabled = true;
    elems.stop.disabled = false;
    
    const intervalId = setInterval(rates.update(), 1e3);
    const cleanup = () => {
      clearInterval(intervalId);
      elems.start.disabled = false;
      elems.stop.disabled = true;
      aggregate.forEach(v => updateStatus(v.id, "pending"));
      console.log("stopped");
      console.groupEnd();
    };
    
    // push selected channels to `todo` array
    let todo = [];
    for (const channel of aggregate) {
      const checked = ui.document.getElementById(channel.id).checked;
      if (checked)
        todo.push(channel);
      updateStatus(channel.id, checked ? "queued" : "skipped"); // update ui
    }
    
    while (todo.length) {
      for (const channel of todo) {
        updateStatus(channel.id, "active");
        console.log("determining page counts");
        if (stop) {
          cleanup();
          return;
        }
        
        // pages past 201 are unavailable, there are 25 messages per page
        let results = await search(channel, token, userId, 0);
        const totalPages = Math.ceil(results.total_results / 25);
        channel.active = totalPages > 201; // flag as unfinished if >201 pages
        const indexedPages = Math.min(totalPages, 201) - 1;
        
        // iterate backwards to avoid waiting for deleted pages to fill
        for (let offset = indexedPages * 25; offset >= 0; offset -= 25) {
          console.log(`requesting page with offset ${offset}`);
          if (stop) {
            cleanup();
            return;
          }
          let results = await search(channel, token, userId, offset);
          if (results)
            for (const message of results.messages) {
              if (![types.message.DEFAULT, types.message.REPLY].includes(message[0].type))
                continue;
              if (stop) {
                cleanup();
                return;
              }
              
              // delete the message
              await remove(message[0], token);
              
            }
        }
        
        // update ui
        updateStatus(channel.id, channel.active ? "queued" : "done");
        
      }
      todo = todo.filter(v => v.active);
    }
    cleanup();
    stop = true;
  });
  
  elems.stop.addEventListener("click", () => {
    elems.start.disabled = false;
    elems.stop.disabled = true;
    stop = true;
    console.log("set stop flag");
  });
  
  // enable the start button
  elems.start.disabled = false;
  
})();
