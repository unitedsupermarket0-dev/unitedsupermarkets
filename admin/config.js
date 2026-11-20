/**
 * Public admin config for United Supermarkets flyer admin.
 * Password hashes only — never put plaintext passwords or GitHub tokens here.
 */
window.UNITED_ADMIN_CONFIG = {
  github: {
    owner: "unitedsupermarket0-dev",
    repo: "unitedsupermarkets",
    branch: "main",
    siteOrigin: "https://unitedsupermarkets.ca"
  },
  locations: {
    london: {
      id: "london",
      label: "London",
      username: "london",
      // SHA-256 of the location password (not stored in the repo)
      passwordHash:
        "f4a9328c5ac5edd298a339c96a1ecde82091ccf045080fcca3fdb032355fcda0",
      // Files replaced on publish (never deleted)
      paths: ["flyer/london.pdf", "flyers/weekly-london.pdf"],
      publicUrl: "/flyer/london.pdf",
      pageUrl: "/flyer/london.html"
    },
    oakville: {
      id: "oakville",
      label: "Oakville",
      username: "oakville",
      passwordHash:
        "4d88ee961eebe488ce2fc9bbcb9ae435fcfa8b26e175b6c9b7962efdbdc6b2d6",
      paths: ["flyers/weekly-oakville.pdf"],
      publicUrl: "/flyers/weekly-oakville.pdf",
      pageUrl: "/flyer/oakville.html"
    }
  },
  sessionKey: "united_admin_session_v1",
  tokenKey: "united_admin_publish_token_v1"
};
