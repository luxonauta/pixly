interface CardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const Card = ({ title, description, children }: CardProps) => (
  <div className="flex w-full flex-col gap-2 rounded-lg border border-black/5 bg-[#DFDFDA] px-3.5 pb-4 pt-5">
    <div className="flex w-full flex-col">
      <h2 className="font-bold uppercase">{title}</h2>
      {description && <p className="mt-[.125rem] text-xs">{description}</p>}
    </div>
    {children}
  </div>
);
