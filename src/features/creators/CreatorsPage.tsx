import { Link } from "@tanstack/react-router";
import { ArrowRight, Palette, Sparkles, Users } from "lucide-react";

const highlights = [
  {
    name: "Arte digital",
    description:
      "Explore obras autorais e descubra diferentes estilos de criação digital.",
    icon: Palette,
  },
  {
    name: "Novos talentos",
    description:
      "Conheça artistas emergentes e acompanhe suas coleções.",
    icon: Sparkles,
  },
  {
    name: "Comunidade criativa",
    description:
      "Descubra projetos que conectam arte, tecnologia e cultura.",
    icon: Users,
  },
];

export function CreatorsPage() {
  return (
    <main className="kurio-info-page">
      <section className="kurio-info-hero">
        <span className="kurio-info-eyebrow">
          COMUNIDADE KURIO
        </span>

        <h1>Conheça o universo dos criadores</h1>

        <p>
          Descubra artistas, estilos e coleções que
          transformam criatividade em experiências digitais.
        </p>

        <Link to="/" className="kurio-button">
          Explorar NFTs <ArrowRight size={18} />
        </Link>
      </section>

      <section className="kurio-info-section">
        <h2>Explore a criatividade</h2>

        <div className="kurio-info-grid">
          {highlights.map(({ name, description, icon: Icon }) => (
            <article className="kurio-info-card" key={name}>
              <Icon size={28} />
              <h3>{name}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}