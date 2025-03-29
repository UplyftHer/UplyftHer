import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// Remix icon 
import 'remixicon/fonts/remixicon.css'
import Head from 'next/head';
import AosInit from "./AosInit";

export const metadata = {
  title: "UplyftHer",
  description: "UplyftHer Landing Page",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="cache-control" content="max-age=0" />
        <meta httpEquiv="cache-control" content="no-cache" />
        <meta httpEquiv="expires" content="0" />
        <meta httpEquiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />
        <meta httpEquiv="pragma" content="no-cache" />
        
      </Head>
      <body >
        <AosInit /> 
        {children}
      </body>
    </html>
  );
}
