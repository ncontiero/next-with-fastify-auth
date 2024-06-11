export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex mt-16 flex-col items-center justify-center px-4">
      {children}
    </div>
  );
}
