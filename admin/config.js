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
      // SHA-256 of the location password (see admin/SETUP.md)
      passwordHash:
        "5de8e9f5c2ee390df1eac7c89624afb123a6e37dee33a6a2a1e50949042e403f",
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
        "ee7fbd913896432f23899dd6ddd15b5c59c3a7093889151ad53603cd09bb9e46",
      paths: ["flyers/weekly-oakville.pdf"],
      publicUrl: "/flyers/weekly-oakville.pdf",
      pageUrl: "/flyer/oakville.html"
    }
  },
  sessionKey: "united_admin_session_v1",
  tokenKey: "united_admin_publish_token_v1"
};
