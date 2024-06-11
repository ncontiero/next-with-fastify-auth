export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex mt-16 flex-col items-center justify-center px-4">
      <div className="border p-6 rounded-md w-96">{children}</div>
    </div>
  );
}
