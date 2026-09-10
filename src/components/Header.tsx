import Link from "next/link";
import { ButtonLink } from "./ButtonLink";
import { Container } from "./Container";

const navItems = [
  { href: "/check", label: "Check a Car" },
  { href: "/example-report", label: "Example Report" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" }
];

export function Header() {
  return (
    <header className="site-header">
      <Container className="header-inner">
        <Link className="brand" href="/" aria-label="AutoCheck QC home">
          <span className="brand-mark">AQ</span>
          <span>
            <strong>AutoCheck QC</strong>
            <small>Montreal used-car pre-screen</small>
          </span>
        </Link>
        <nav className="nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <span className="language-pill">EN / FR</span>
          <ButtonLink href="/check" variant="primary">
            Check This Car
          </ButtonLink>
        </div>
      </Container>
    </header>
  );
}
