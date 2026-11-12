import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'RedOps Command & Spa Wift Killchains',
  description: 'Dedicated script Red Ops framework for cybersecurity assessments, automated Spa Wift killchains, threat intelligence visualization, and runehall.com continuous auditing.',
  openGraph: {
    title: 'RedOps Command & Spa Wift Killchains',
    description: 'Dedicated script Red Ops framework for cybersecurity assessments, automated Spa Wift killchains, threat intelligence visualization, and runehall.com continuous auditing.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RedOps Command & Spa Wift Killchains',
    description: 'Dedicated script Red Ops framework for cybersecurity assessments, automated Spa Wift killchains, threat intelligence visualization, and runehall.com continuous auditing.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-red-500/30 selection:text-red-200" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
