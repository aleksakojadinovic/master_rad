import React from 'react';
import NavigationBar from '@/components/Navigation/NavigationBar';
import RootStyleRegistry from '@/components/RootStyleRegistry';

export const metadata = {
  title: 'STS',
  description: 'STS - Simple Ticket Service',
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <RootStyleRegistry>
        <body>
          <NavigationBar />
          {children}
        </body>
      </RootStyleRegistry>
    </html>
  );
}
