import Header from "@/components/organisms/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/minimalDrawIcon.svg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#fbbf24" />
        <link rel="apple-touch-icon" href="/minimalDrawIcon.svg" />
      </head>
      <body>
          {/* ヘッダーの高さ分全体をさげる */}
          <Header />
          <div className="pt-14">{children}</div>
          <footer className="text-center p-4 text-gray-500 text-sm">
            &copy; 2026, Takeru
          </footer>
      </body>
    </html>
  );
}