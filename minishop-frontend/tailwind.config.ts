import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        forest: "#1F3D3B",
        paper: "#FBF9F4",
        amber: "#E8A33D",
        ink: "#242220",
        stone: "#6B6558",
        line: "#E5E1D8",
      },
      //       extend: {
      //   colors: {
      //     forest: "#243B3B",
      //     paper: "#F8F5F0",
      //     ink: "#2C2C2C",
      //     stone: "#8A857D",
      //     amber: "#C39A54",
      //     line: "#DDD6C9",
      //   },
      // },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ['"Work Sans"', "sans-serif"],
      },
    },
  },
};
