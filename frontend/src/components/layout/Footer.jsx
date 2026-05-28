import { Link } from 'react-router-dom';
import { MailCheck, MapPinned, PhoneCall, ShieldCheck } from 'lucide-react';

const FacebookIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
);

const InstagramIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.97.24 2.43.403a4.088 4.088 0 011.47.957c.453.453.768.927.957 1.47.163.46.349 1.26.403 2.43.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.24 1.97-.403 2.43a4.088 4.088 0 01-.957 1.47 4.088 4.088 0 01-1.47.957c-.46.163-1.26.349-2.43.403-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.97-.24-2.43-.403a4.088 4.088 0 01-1.47-.957 4.088 4.088 0 01-.957-1.47c-.163-.46-.349-1.26-.403-2.43C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.054-1.17.24-1.97.403-2.43a4.088 4.088 0 01.957-1.47A4.088 4.088 0 015.063 2.293c.46-.163 1.26-.349 2.43-.403C8.759 1.832 9.139 1.82 12 1.82V2.163zM12 0C8.741 0 8.333.014 7.053.072 5.775.131 4.902.333 4.14.63a5.882 5.882 0 00-2.126 1.384A5.882 5.882 0 00.63 4.14C.333 4.902.131 5.775.072 7.053.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.059 1.278.261 2.15.558 2.913a5.882 5.882 0 001.384 2.126 5.882 5.882 0 002.126 1.384c.763.297 1.635.499 2.913.558C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.072c1.278-.059 2.15-.261 2.913-.558a5.882 5.882 0 002.126-1.384 5.882 5.882 0 001.384-2.126c.297-.763.499-1.635.558-2.913C23.986 15.667 24 15.259 24 12s-.014-3.667-.072-4.947c-.059-1.278-.261-2.15-.558-2.913a5.882 5.882 0 00-1.384-2.126A5.882 5.882 0 0019.86.63C19.097.333 18.225.131 16.947.072 15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" />
    </svg>
);

const Footer = () => {
    const quickLinks = [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/about' },
        { name: 'Shop', path: '/shop' },
        { name: 'Contact', path: '/contact' },
        { name: 'Cart', path: '/cart' },
        { name: 'Login', path: '/login' },
    ];

    const contactInfo = [
        { icon: PhoneCall, text: '+94 77 123 4567', href: 'tel:+94771234567' },
        { icon: MailCheck, text: 'support@petnest.lk', href: 'mailto:support@petnest.lk' },
        { icon: MapPinned, text: 'Colombo, Sri Lanka' },
    ];

    const supportPoints = ['Customer care: Mon-Sat, 9:00 AM - 6:00 PM', 'Order, delivery, and product support'];

    const socialLinks = [
        { icon: FacebookIcon, href: '#', label: 'Facebook' },
        { icon: InstagramIcon, href: '#', label: 'Instagram' },
    ];

    return (
        <footer className="bg-blue-950 text-blue-50 border-t border-blue-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.25fr_0.8fr_1fr_0.8fr] gap-10">
                    <div>
                        <Link to="/" className="inline-block text-2xl font-bold tracking-tight mb-4">
                            PetNest
                        </Link>
                        <p className="text-blue-200 text-sm leading-relaxed max-w-sm">
                            Sri Lanka&apos;s friendly online pet store for food, treats, toys,
                            grooming essentials, accessories, and everyday pet care.
                        </p>
                        <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-900/70 border border-blue-800 px-4 py-3 text-sm text-blue-100">
                            <ShieldCheck className="w-4 h-4 text-blue-300 shrink-0" />
                            Trusted supplies for happier pets
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="text-blue-200 hover:text-white text-sm transition-colors duration-300"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact</h3>
                        <ul className="space-y-3">
                            {contactInfo.map((item) => (
                                <li key={item.text} className="flex items-start gap-3">
                                    <item.icon className="w-5 h-5 text-blue-300 mt-0.5 shrink-0" />
                                    {item.href ? (
                                        <a
                                            href={item.href}
                                            className="text-blue-200 hover:text-white text-sm transition-colors duration-300"
                                        >
                                            {item.text}
                                        </a>
                                    ) : (
                                        <span className="text-blue-200 text-sm">{item.text}</span>
                                    )}
                                </li>
                            ))}
                        </ul>

                        <ul className="mt-5 space-y-2">
                            {supportPoints.map((point) => (
                                <li key={point} className="text-blue-300 text-xs leading-relaxed">
                                    {point}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="w-10 h-10 rounded-xl bg-blue-900 flex items-center justify-center text-blue-200 hover:text-white hover:bg-blue-700 hover:scale-105 transition-all duration-300"
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                        <p className="mt-5 text-blue-300 text-xs leading-relaxed">
                            Follow PetNest for product updates, care tips, and pet-parent offers.
                        </p>
                    </div>
                </div>
            </div>

            <div className="border-t border-blue-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                    <p className="text-center text-blue-300 text-sm">
                        &copy; {new Date().getFullYear()} PetNest. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
