import React from "react";
import "./globals.css";

import { ChakraProvider } from "@chakra-ui/react";
import localFont from "next/font/local";
const myFont = localFont({ src: "../fonts/GeistMono-Medium.otf" });

export const metadata = {
  title: "Assitant Comunity",
  description: "Assitant Comunity",
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ChakraProvider>
          <div
            className={`${myFont.className} ${"container"}`}
            style={{ margin: "auto", fontWeight: "400" }}
          >
            {children}
          </div>
        </ChakraProvider>
      </body>
    </html>
  );
}
