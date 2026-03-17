/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        grok: { bg: "#0a0a0f", surface: "#13131a", border: "#1e1e2e",
                accent: "#7c3aed", accent2: "#06b6d4", text: "#e2e8f0", muted: "#64748b" }
      }
    }
  },
  plugins: []
}
