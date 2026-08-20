type FooterProps = {
  availability: string;
};

export function Footer({ availability }: FooterProps) {
  return (
    <footer className="border-t border-[color:var(--border)] bg-[color:var(--panel)] py-5 text-center">
      <p className="text-sm text-accent-soft">{availability}</p>
    </footer>
  );
}
