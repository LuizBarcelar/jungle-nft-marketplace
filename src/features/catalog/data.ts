export type Nft = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  network: string;
  edition: string;
  rare?: boolean;
  description: string;
};
export const nfts: Nft[] = [
  {
    id: "emerald",
    name: "Emerald Ape #042",
    price: 1.19,
    image: "/nfts/emerald.jpg",
    category: "Arte digital",
    network: "Ethereum",
    edition: "1/50",
    rare: true,
    description:
      "Um colecionável digital 1/50 finalizado à mão da coleção Kurio Editions, verificado na Ethereum.",
  },
  {
    id: "sage",
    name: "Sage Nomad #009",
    price: 1.69,
    image: "/nfts/sage.jpg",
    category: "Colecionáveis",
    network: "Polygon",
    edition: "1/10",
    description: "Uma obra digital exclusiva da coleção Kurio Apes.",
  },
  {
    id: "neon",
    name: "Neon Vessel #552",
    price: 1.99,
    image: "/nfts/neon.jpg",
    category: "Arte 3D",
    network: "Solana",
    edition: "1/10",
    rare: true,
    description: "Arte digital de edição limitada.",
  },
  {
    id: "cosmic",
    name: "Cosmic Bloom #118",
    price: 1.29,
    image: "/nfts/cosmic.jpg",
    category: "Fotografia",
    network: "Ethereum",
    edition: "1/50",
    description: "Colecionável criado para uma nova geração de artistas.",
  },
  {
    id: "violet",
    name: "Violet Nomad #314",
    price: 1.39,
    image: "/nfts/violet.jpg",
    category: "Arte digital",
    network: "Ethereum",
    edition: "1/1",
    description: "Uma peça singular da coleção Kurio Editions.",
  },
  {
    id: "ivory",
    name: "Ivory Baron #088",
    price: 1.79,
    image: "/nfts/ivory.jpg",
    category: "Colecionáveis",
    network: "Polygon",
    edition: "1/10",
    description: "Colecionável digital com proveniência registrada.",
  },
  {
    id: "golden",
    name: "Golden Beat #207",
    price: 0.99,
    image: "/nfts/golden.jpg",
    category: "Música",
    network: "Solana",
    edition: "1/50",
    description: "Uma obra inspirada em som e cultura digital.",
  },
  {
    id: "frequency",
    name: "Golden Frequency #071",
    price: 0.59,
    image: "/nfts/cosmic.jpg",
    category: "Música",
    network: "Ethereum",
    edition: "1/50",
    description: "Arte e música em uma edição digital.",
  },
  {
    id: "signal",
    name: "Golden Signal #160",
    price: 0.39,
    image: "/nfts/golden.jpg",
    category: "Generativa",
    network: "Polygon",
    edition: "1/50",
    description: "Arte generativa da coleção Kurio.",
  },
];
export const categories = [
  "Arte digital",
  "Fotografia",
  "Música",
  "Arte 3D",
  "Colecionáveis",
  "Generativa",
  "Jogos",
  "Assinaturas",
  "Utilidade",
];
export const formatEth = (price: number) => `${price.toFixed(2)} ETH`;
