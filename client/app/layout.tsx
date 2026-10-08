import '@fortawesome/fontawesome-free/css/all.min.css';
import "./globals.css";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
    >
      <body className="min-h-full">
        {children}
      </body>
    </html>
  );
}
