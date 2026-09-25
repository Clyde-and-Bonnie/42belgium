import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | 42 Belgium",
    default: "42 Belgium - Free Tech Training",
  },
  description:
    "Free, peer-to-peer tech education in Belgium. 10 specialisations, 3 languages. No degree required.",
  icons: {
    icon: "/assets/favicon-42belgium.png",
    apple: "/assets/favicon-42belgium.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        {/* Adobe Fonts (Typekit) — futura-pt, loaded non-render-blocking.
            The font itself is unchanged; only its loading no longer blocks paint.
            media="print" makes the browser fetch without blocking render; the
            beforeInteractive script swaps it to media="all" once loaded (SSR-safe,
            handles the already-loaded case via .sheet). noscript = no-JS fallback. */}
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
        <link
          id="typekit-css"
          rel="stylesheet"
          href="https://use.typekit.net/seg0ngf.css"
          media="print"
          suppressHydrationWarning
        />
        <Script id="typekit-swap" strategy="beforeInteractive">
          {`(function(){var l=document.getElementById('typekit-css');if(!l)return;function s(){l.media='all';}if(l.sheet){s();}else{l.addEventListener('load',s);}})();`}
        </Script>
        <noscript>
          <link rel="stylesheet" href="https://use.typekit.net/seg0ngf.css" />
        </noscript>
        {/* Google Tag Manager */}
        <Script id="gtm-base" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-P5G8QV2');`}
        </Script>
        {/* End Google Tag Manager */}
      </head>
      <body className="min-h-full flex flex-col font-sans">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-P5G8QV2"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        {children}
      </body>
    </html>
  );
}
