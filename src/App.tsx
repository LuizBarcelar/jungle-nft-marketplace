
import { Button } from "@/components/ui/button"

function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-950">
      <h1 className="text-4xl font-bold text-white">
        Jungle NFT Marketplace
      </h1>

      <p className="text-slate-400">
        React + TypeScript + Tailwind CSS + shadcn/ui
      </p>

      <Button onClick={() => alert("shadcn/ui funcionando!")}>
        Testar componente
      </Button>
    </main>
  )
}

export default App
