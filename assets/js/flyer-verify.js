/**
 * Verify flyer/london.pdf is live on the custom domain after GitHub Pages deploy.
 */
(function () {
  var PDF_PATH = "/flyer/london.pdf";
  var CUSTOM_DOMAIN = "https://unitedsupermarkets.ca";
  var GITHUB_IO_URL =
    "https://unitedsupermarket0-dev.github.io/unitedsupermarkets/flyer/london.pdf";

  var verifyButton = document.getElementById("verify-button");
  var statusEl = document.getElementById("verify-status");
  var metaEl = document.getElementById("verify-meta");
  var previewEl = document.getElementById("pdf-preview");

  if (!verifyButton) return;

  function setStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = "verify-status is-visible is-" + type;
  }

  function formatBytes(bytes) {
    if (!bytes || bytes < 0) return "unknown";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  function checkUrl(label, url) {
    return fetch(url, { method: "HEAD", cache: "no-store" }).then(function (res) {
      var size = res.headers.get("content-length");
      var type = res.headers.get("content-type");
      var modified = res.headers.get("last-modified");
      return {
        label: label,
        url: url,
        ok: res.ok,
        status: res.status,
        size: size ? parseInt(size, 10) : null,
        type: type || "",
        modified: modified || ""
      };
    });
  }

  function runVerify() {
    metaEl.textContent = "";
    verifyButton.disabled = true;
    setStatus("Checking live PDF URLs…", "info");

    var customUrl = CUSTOM_DOMAIN + PDF_PATH;
    var relativeUrl = PDF_PATH + "?t=" + Date.now();

    Promise.all([
      checkUrl("Custom domain", customUrl),
      checkUrl("GitHub Pages", GITHUB_IO_URL)
    ])
      .then(function (results) {
        var custom = results[0];
        var github = results[1];
        var lines = [];

        results.forEach(function (r) {
          lines.push(
            r.label + ": HTTP " + r.status +
            (r.type ? " (" + r.type + ")" : "") +
            (r.size != null ? ", " + formatBytes(r.size) : "") +
            (r.modified ? ", modified " + r.modified : "")
          );
        });

        metaEl.textContent = lines.join("\n");

        if (custom.ok && custom.type.indexOf("pdf") !== -1) {
          setStatus(
            "Success — " + customUrl + " is live (HTTP 200, PDF). Flipp can use this URL.",
            "success"
          );
          if (previewEl) {
            previewEl.src = relativeUrl;
          }
        } else if (github.ok) {
          setStatus(
            "PDF is on GitHub Pages but custom domain check failed. DNS or CNAME may still be propagating.",
            "error"
          );
        } else {
          setStatus(
            "PDF not found yet. Wait ~1 minute after publish, then check again.",
            "error"
          );
        }
      })
      .catch(function (err) {
        setStatus("Could not verify: " + (err.message || "network error"), "error");
      })
      .finally(function () {
        verifyButton.disabled = false;
      });
  }

  verifyButton.addEventListener("click", runVerify);
})();
