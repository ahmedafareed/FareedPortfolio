import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Admin | Ahmed Fareed',
    description: 'Admin panel for Ahmed Fareed\'s photography portfolio.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 sm:p-6 lg:p-8">
        {children}
      </div>
    </div>
  )
}
