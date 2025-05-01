interface LinkProps {
  name: string;
  href: string;
}

export default function MyLink({ name, href }: LinkProps) {
  return <a href={href}>{name}</a>;
}
