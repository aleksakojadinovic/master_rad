export const metadata = {
  title: "STS",
  description: "STS - Simple Ticket Service",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
