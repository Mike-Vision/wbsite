import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import './global.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Mike Vision — Software Engineer',
  description:
    'Personal portfolio of Mike Vision, software engineer specializing in Python, JavaScript, C++, C#, Java, Lua, and Luau.',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://ka-p.fontawesome.com/releases/v6.3.0/css/pro.min.css?token=2c15cc0cc7"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Space Grotesk', system-ui, -apple-system, sans-serif" }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
