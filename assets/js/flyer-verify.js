/**
 * Verify flyer PDFs are live on the custom domain after GitHub Pages deploy.
 */
(function () {
  var CUSTOM_DOMAIN = "https://unitedsupermarkets.ca";
  var GITHUB_IO_BASE =
    "https://unitedsupermarket0-dev.github.io/unitedsupermarkets";

  function formatBytes(bytes) {
    if (!bytes || bytes < 0) return "unknown";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  function setStatus(el, message, type) {
    if (!el) return;
    el.textContent = message;
    el.className = "verify-status is-visible is-" + type;
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

  function runVerify(options) {
    var pdfPath = options.pdfPath;
    var button = options.button;
    var statusEl = options.statusEl;
    var metaEl = options.metaEl;
    var previewEl = options.previewEl;
    var successMessage = options.successMessage;

    metaEl.textContent = "";
    button.disabled = true;
    setStatus(statusEl, "Checking live PDF URLs…", "info");

    var customUrl = CUSTOM_DOMAIN + pdfPath;
    var githubUrl = GITHUB_IO_BASE + pdfPath;
    var relativeUrl = pdfPath + "?t=" + Date.now();

    Promise.all([
      checkUrl("Custom domain", customUrl),
      checkUrl("GitHub Pages", githubUrl)
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
          setStatus(statusEl, successMessage || ("Success — " + customUrl + " is live (HTTP 200, PDF)."), "success");
          if (previewEl) previewEl.src = relativeUrl;
        } else if (github.ok) {
          setStatus(
            statusEl,
            "PDF is on GitHub Pages but custom domain check failed. DNS or CNAME may still be propagating.",
            "error"
          );
        } else {
          setStatus(statusEl, "PDF not found yet. Wait ~1 minute after publish, then check again.", "error");
        }
      })
      .catch(function (err) {
        setStatus(statusEl, "Could not verify: " + (err.message || "network error"), "error");
      })
      .finally(function () {
        button.disabled = false;
      });
  }

  var londonButton = document.getElementById("verify-button");
  if (londonButton) {
    londonButton.addEventListener("click", function () {
      runVerify({
        pdfPath: "/flyer/london.pdf",
        button: londonButton,
        statusEl: document.getElementById("verify-status"),
        metaEl: document.getElementById("verify-meta"),
        previewEl: document.getElementById("pdf-preview"),
        successMessage:
          "Success — https://unitedsupermarkets.ca/flyer/london.pdf is live (HTTP 200, PDF). Flipp can use this URL."
      });
    });
  }

  var testButton = document.getElementById("verify-test-button");
  if (testButton) {
    testButton.addEventListener("click", function () {
      runVerify({
        pdfPath: "/flyer/test-upload.pdf",
        button: testButton,
        statusEl: document.getElementById("verify-test-status"),
        metaEl: document.getElementById("verify-test-meta"),
        previewEl: document.getElementById("test-pdf-preview"),
        successMessage:
          "Success — https://unitedsupermarkets.ca/flyer/test-upload.pdf is live (HTTP 200, PDF)."
      });
    });
  }
})();
