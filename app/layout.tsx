'use client';

import { ClerkProvider } from '@clerk/nextjs'

import { usePathname } from 'next/navigation';
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MegaMenu from "@/components/navigation/MegaMenu";
import { CartProvider } from "@/context/CartContext";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();
    const isHomePage = pathname === '/';

    return (
        <ClerkProvider>
            <html lang="en">
                <body className="font-sans antialiased">
                    <CartProvider>
                        <div className="flex flex-col min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
                            {/* Sticky Header + MegaMenu Container */}
                            <div className="sticky top-0 z-50 bg-black">
                                <Header />
                                {isHomePage && <MegaMenu />}
                            </div>
                            <main className="flex-1">
                                {children}
                            </main>
                            <Footer />
                        </div>
                    </CartProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
