import { MeshGradient } from '@paper-design/shaders-react';

function App() {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <MeshGradient speed={1} scale={1} distortion={0.8} swirl={0.1} colors={['#CAFF50', '#FF64FF', '#F4EF40', '#52FF5A', '#00DCFF', '#DD4AFF', '#EDEDED']} style={{ height: '100%', width: '100%' }}
      />
    </div>
  );
}
export default App;


