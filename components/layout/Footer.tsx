import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gradient-to-b from-gray-900 to-black text-white mt-20">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold gradient-text">✨ Sparkle Afterglow</h3>
                        <p className="text-gray-400 text-sm">
                            Discover elegance and beauty in every piece. Your destination for premium jewelry and accessories.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="p-2 rounded-full glass hover:bg-white/20 transition-all duration-200">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 rounded-full glass hover:bg-white/20 transition-all duration-200">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 rounded-full glass hover:bg-white/20 transition-all duration-200">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 rounded-full glass hover:bg-white/20 transition-all duration-200">
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/products" className="text-gray-400 hover:text-white transition-colors duration-200">
                                    All Products
                                </Link>
                            </li>
                            <li>
                                <Link href="/categories" className="text-gray-400 hover:text-white transition-colors duration-200">
                                    Categories
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-gray-400 hover:text-white transition-colors duration-200">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors duration-200">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/shipping" className="text-gray-400 hover:text-white transition-colors duration-200">
                                    Shipping Info
                                </Link>
                            </li>
                            <li>
                                <Link href="/returns" className="text-gray-400 hover:text-white transition-colors duration-200">
                                    Returns
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors duration-200">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link href="/support" className="text-gray-400 hover:text-white transition-colors duration-200">
                                    Support
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
                        <p className="text-gray-400 text-sm mb-4">
                            Subscribe to get special offers and updates.
                        </p>
                        <div className="flex">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="flex-1 px-4 py-2 rounded-l-lg glass border border-white/20 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50 transition-all duration-200 text-white placeholder-gray-400"
                            />
                            <button className="px-6 py-2 bg-gradient-primary rounded-r-lg hover:shadow-lg transition-all duration-200">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-sm">
                        &copy; {new Date().getFullYear()} Sparkle Afterglow. All rights reserved.
                    </p>
                    <div className="flex items-center gap-3 bg-white/5 rounded-lg px-3 py-1.5 border border-white/10">
                        <span className="text-xs text-gray-400">Secured payment by</span>
                        <span className="font-bold text-white text-sm tracking-wide">SSLCOMMERZ</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
