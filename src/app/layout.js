import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Req Writer',
  description: 'Trusty AI Assistant',
};

import { UserProvider } from '@auth0/nextjs-auth0/client';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <UserProvider>
        <body className="bg-black">{children}</body>
      </UserProvider>
    </html>
  );
}
