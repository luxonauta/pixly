interface CardProps {
  children: React.ReactNode;
  description?: string;
  title: string;
}

export const Card = ({ children, description, title }: CardProps) => (
  <div className="flex w-full flex-col gap-2 rounded-lg border border-black/5 bg-[#DFDFDA] px-3.5 pb-4 pt-5">
    <div className="flex w-full flex-col">
      <h2 className="font-bold uppercase">{title}</h2>
      {description && <p className="mt-[.125rem]">{description}</p>}
    </div>
    {children}
  </div>
);
