export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="w-full">
      <div className="flex justify-start flex-col gap-6">
        <h3 className="text-28-700-s-black">Gestion des utilisateurs</h3>
        <div className="w-full">{children}</div>
      </div>
    </section>
  );
}