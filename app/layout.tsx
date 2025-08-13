

export const metadata = {
  title: "Timely - Workforce Management for Care Providers",
  description:
    "Manage time efficiently with our comprehensive workforce management platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
