/**
 * Location-scoped admin authentication (client-side gate).
 * Publish still requires a fine-grained GitHub token (manager setup).
 */
(function (window) {
  "use strict";

  var cfg = window.UNITED_ADMIN_CONFIG;
  if (!cfg) {
    throw new Error("UNITED_ADMIN_CONFIG missing — load admin/config.js first");
  }

  function toHex(buffer) {
    return Array.from(new Uint8Array(buffer))
      .map(function (b) {
        return b.toString(16).padStart(2, "0");
      })
      .join("");
  }

  function sha256Hex(text) {
    var data = new TextEncoder().encode(text);
    return crypto.subtle.digest("SHA-256", data).then(toHex);
  }

  function findAccount(username) {
    var key = String(username || "")
      .trim()
      .toLowerCase();
    var locations = cfg.locations;
    for (var id in locations) {
      if (!Object.prototype.hasOwnProperty.call(locations, id)) continue;
      if (locations[id].username === key) return locations[id];
    }
    return null;
  }

  function readSession() {
    try {
      var raw = sessionStorage.getItem(cfg.sessionKey);
      if (!raw) return null;
      var session = JSON.parse(raw);
      if (!session || !session.locationId || !cfg.locations[session.locationId]) {
        return null;
      }
      return session;
    } catch (e) {
      return null;
    }
  }

  function writeSession(location) {
    var session = {
      locationId: location.id,
      label: location.label,
      loggedInAt: new Date().toISOString()
    };
    sessionStorage.setItem(cfg.sessionKey, JSON.stringify(session));
    return session;
  }

  function clearSession() {
    sessionStorage.removeItem(cfg.sessionKey);
  }

  function getPublishToken() {
    try {
      return localStorage.getItem(cfg.tokenKey) || "";
    } catch (e) {
      return "";
    }
  }

  function setPublishToken(token) {
    var value = String(token || "").trim();
    if (!value) {
      localStorage.removeItem(cfg.tokenKey);
      return;
    }
    localStorage.setItem(cfg.tokenKey, value);
  }

  function login(username, password) {
    var account = findAccount(username);
    if (!account) {
      return Promise.resolve({ ok: false, error: "Invalid username or password." });
    }
    return sha256Hex(password).then(function (hash) {
      if (hash !== account.passwordHash) {
        return { ok: false, error: "Invalid username or password." };
      }
      var session = writeSession(account);
      return { ok: true, session: session, location: account };
    });
  }

  function requireSession() {
    var session = readSession();
    if (!session) {
      window.location.replace("/admin/");
      return null;
    }
    return {
      session: session,
      location: cfg.locations[session.locationId]
    };
  }

  window.UnitedAdminAuth = {
    login: login,
    logout: clearSession,
    getSession: readSession,
    requireSession: requireSession,
    getPublishToken: getPublishToken,
    setPublishToken: setPublishToken,
    getLocation: function (id) {
      return cfg.locations[id] || null;
    }
  };
})(window);
