import "./globals.scss";

export const metadata = {
  title: "PD",
  description: "Prepack Designer",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
