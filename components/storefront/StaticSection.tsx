type Props = {
  heading: string;
  children: React.ReactNode;
};

export function StaticSection({ heading, children }: Props) {
  return (
    <section>
      <h2 className="font-heading text-lg font-semibold text-neutral-dark">
        {heading}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-neutral-muted">
        {children}
      </p>
    </section>
  );
}
