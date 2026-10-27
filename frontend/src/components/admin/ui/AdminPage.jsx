function PageHeader({ eyebrow, title, description, actions })
{
  return (
    <header className="flex items-end justify-between gap-4 flex-wrap">
      <div>{eyebrow && <div className="text-phoenix text-xs tracking-[0.4em] uppercase mb-2">{eyebrow}</div>}<h1 className="font-display text-3xl md:text-4xl tracking-wider uppercase text-parchment">{title}</h1>{description && <p className="text-ash/60 mt-2 text-sm max-w-3xl">{description}</p>}</div>
      {actions}
    </header>
  );
}

/** A CMS section: its header (eyebrow, title, description, optional `actions`) followed by its content. */
export function AdminPage({ children, ...header })
{
  return <div className="flex flex-col gap-8"><PageHeader {...header} />{children}</div>;
}
