import './globals.css';
import Navbar from '../components/layout/Navbar';

export const metadata = {
  title: 'Personal Finance Visualizer',
  description: 'A simple web application for tracking personal finances',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </body>
    </html>
  );
}
