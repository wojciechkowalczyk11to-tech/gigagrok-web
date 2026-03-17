import type { Metadata } from "next"
import "./globals.css"
export const metadata: Metadata = { title: "GigaGrok", description: "AI powered by Grok 4.20" }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>
}
