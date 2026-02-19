import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BeautySaaS - Plataforma de Gestión 360°',
  description:
    'Plataforma integral SaaS para profesionalizar la operación de estéticas, barberías, spas y estudios de uñas.',
  keywords: [
    'SaaS',
    'Gestión',
    'Salones',
    'Estética',
    'Barbería',
    'Spa',
    'Uñas',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gray-50">
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
