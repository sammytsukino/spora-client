import { HeroMeshGradientBackground } from "@/components/backgrounds/Gradient";

function App() {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <HeroMeshGradientBackground className="absolute inset-0" />
    </div>
  );
}
export default App;


