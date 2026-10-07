import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import SessionWrapper from "@/components/sessionwrapper";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata = {
  title: "Fund Me - A crowdfunding platform",
  description: "A crowdfunding platform for raising funds for various causes and projects. Users can create campaigns, donate to campaigns, and track the progress of their donations.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-white min-h-screen`}>
        <SessionWrapper>
          <Navbar />
          <div className="min-h-screen container mx-auto">
            {children}
          </div>
          <Footer />
        </SessionWrapper>
      </body>
    </html>
  );
}
