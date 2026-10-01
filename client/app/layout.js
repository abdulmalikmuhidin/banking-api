import "./globals.css";

export const metadata = {
  title: "almal Bank",
  description: "Personal banking, made clear.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
