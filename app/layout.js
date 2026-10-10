import './globals.css';
import Footer from '@/components/Footer';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';

export const metadata = {
  title: 'Emaar Crescent Bay Karachi | Sadaf Estate',
  description: 'Luxury seafront apartments for sale, rent, and booking in Emaar Karachi.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-slate-900 antialiased relative">
        <div className="flex-1 w-full">
          {children}
        </div>
        <Footer />
        
        {/* Floating WhatsApp Quick Advisory */}
        <WhatsAppFloatingButton />
      </body>
    </html>
  );
}