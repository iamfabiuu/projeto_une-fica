/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        une: "#1e6ff5",
        fica: "#3da5f5",
        sun: "#f5921e",
        night: "#14425c",
        heart: "#ee3124",
      },
      fontFamily: {
        display: ['"Bowlby One"', "system-ui", "sans-serif"],
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgba(20,66,92,0.12)",
        glow: "0 0 40px -8px rgba(245,146,30,0.55)",
      },
      keyframes: {
        kenburns: {
          from: { transform: "scale(1.05) translate(0,0)" },
          to: { transform: "scale(1.15) translate(-1.5%,-1.5%)" },
        },
        rise: {
          from: { opacity: "0", transform: "translateY(16px) scale(0.98)" },
          to: { opacity: "1", transform: "none" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        kenburns: "kenburns 20s ease-in-out infinite alternate",
        rise: "rise .35s cubic-bezier(.16,1,.3,1) both",
        marquee: "marquee 28s linear infinite",
      },
      spin: {
        from: { transform: "rotate(0deg)" },
        to: { transform: "rotate(360deg)" },
      },
    },
  },
  plugins: [],
};
