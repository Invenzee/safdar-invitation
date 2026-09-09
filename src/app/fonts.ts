import { Montserrat } from "next/font/google";
import localFont from "next/font/local";

export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

export const sunyshine = localFont({
  src: "../../public/fonts/Sunyshine DEMO.ttf",
  variable: "--font-sunyshine",
  display: "swap",
});
