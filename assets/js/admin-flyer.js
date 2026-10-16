/**
 * Replace (never delete) location flyer PDFs via GitHub Contents API.
 */
(function (window) {
  "use strict";

  var cfg = window.UNITED_ADMIN_CONFIG;

  function apiHeaders(token) {
    return {
      Accept: "application/vnd.github+json",
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28"
    };
  }

  function contentsUrl(path) {
    return (
      "https://api.github.com/repos/" +
      cfg.github.owner +
      "/" +
      cfg.github.repo +
      "/contents/" +
      path
    );
  }

  function fileToBase64(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () {
        var result = String(reader.result || "");
        var comma = result.indexOf(",");
        resolve(comma >= 0 ? result.slice(comma + 1) : result);
      };
      reader.onerror = function () {
        reject(new Error("Could not read the selected PDF."));
      };
      reader.readAsDataURL(file);
    });
  }

  function getFileMeta(path, token) {
    var url =
      contentsUrl(path) +
      "?ref=" +
      encodeURIComponent(cfg.github.branch);
    return fetch(url, { headers: apiHeaders(token) }).then(function (res) {
      if (res.status === 404) {
        return { sha: null };
      }
      if (!res.ok) {
        return res.json().catch(function () {
          return {};
        }).then(function (body) {
          var msg =
            (body && body.message) ||
            "GitHub lookup failed (" + res.status + ")";
          throw new Error(msg);
        });
      }
      return res.json();
    });
  }

  function putFile(path, base64, sha, token, message) {
    var body = {
      message: message,
      content: base64,
      branch: cfg.github.branch
    };
    if (sha) body.sha = sha;

    return fetch(contentsUrl(path), {
      method: "PUT",
      headers: apiHeaders(token),
      body: JSON.stringify(body)
    }).then(function (res) {
      return res.json().catch(function () {
        return {};
      }).then(function (body) {
        if (!res.ok) {
          var msg =
            (body && body.message) ||
            "GitHub upload failed (" + res.status + ")";
          throw new Error(msg);
        }
        return body;
      });
    });
  }

  function validatePdf(file) {
    if (!file) return "Choose a PDF file to upload.";
    var name = String(file.name || "").toLowerCase();
    var type = String(file.type || "").toLowerCase();
    if (type !== "application/pdf" && !name.endsWith(".pdf")) {
      return "Only PDF files are allowed.";
    }
    // ~45 MB soft cap for Contents API practicality
    if (file.size > 45 * 1024 * 1024) {
      return "PDF is too large (max about 45 MB).";
    }
    return null;
  }

  /**
   * Replace all paths for a location with the same PDF bytes.
   * Never deletes existing files — only overwrites content.
   */
  function replaceFlyer(location, file, token) {
    var err = validatePdf(file);
    if (err) return Promise.reject(new Error(err));
    if (!token) {
      return Promise.reject(
        new Error(
          "Publish token is not set. Ask a manager to complete Admin Setup."
        )
      );
    }

    var message =
      "Update weekly " +
      location.label +
      " flyer PDF.";

    return fileToBase64(file).then(function (base64) {
      var chain = Promise.resolve();
      var results = [];
      location.paths.forEach(function (path) {
        chain = chain.then(function () {
          return getFileMeta(path, token).then(function (meta) {
            return putFile(path, base64, meta.sha, token, message).then(
              function (res) {
                results.push({ path: path, commit: res.commit });
              }
            );
          });
        });
      });
      return chain.then(function () {
        return {
          ok: true,
          results: results,
          publicUrl: cfg.github.siteOrigin + location.publicUrl
        };
      });
    });
  }

  function cacheBustUrl(path) {
    var sep = path.indexOf("?") >= 0 ? "&" : "?";
    return path + sep + "t=" + Date.now();
  }

  window.UnitedAdminFlyer = {
    replaceFlyer: replaceFlyer,
    validatePdf: validatePdf,
    cacheBustUrl: cacheBustUrl
  };
})(window);
