import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  ShieldCheck,
  Wallet,
} from "lucide-react";

const topics = [
  {
    title: "O que são NFTs?",
    description:
      "NFTs são tokens digitais únicos registrados em uma blockchain. Eles podem representar itens digitais, mas possuir um NFT não significa necessariamente possuir os direitos autorais da obra.",
    icon: BookOpen,
  },
  {
    title: "Como funcionam as carteiras?",
    description:
      "Carteiras digitais permitem gerenciar ativos e interagir com aplicações blockchain. Nunca compartilhe suas chaves privadas ou frases de recuperação.",
    icon: Wallet,
  },
  {
    title: "Como explorar com segurança?",
    description:
      "Pesquise os projetos, confira as informações disponíveis e desconfie de promessas de valorização garantida.",
    icon: ShieldCheck,
  },
];

export function LearnPage() {
  return (
    <main className="kurio-info-page">
      <section className="kurio-info-hero">
        <span className="kurio-info-eyebrow">
          GUIA KURIO
        </span>

        <h1>Aprenda sobre o universo NFT</h1>

        <p>
          Entenda os principais conceitos de arte digital,
          blockchain e colecionáveis digitais.
        </p>
      </section>

      <section className="kurio-info-section">
        <h2>Comece pelos fundamentos</h2>

        <div className="kurio-info-grid">
          {topics.map(({ title, description, icon: Icon }) => (
            <article className="kurio-info-card" key={title}>
              <Icon size={28} />
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="kurio-info-notice">
        <h2>Explore a Kurio na prática</h2>

        <p>
          Este marketplace é um projeto demonstrativo.
          As compras, carteiras e atualizações de preços
          são simuladas e não envolvem transações reais.
        </p>

        <Link to="/" className="kurio-button">
          Conhecer o marketplace <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  );
}