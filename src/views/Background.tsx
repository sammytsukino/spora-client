

function App() {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="https://res.cloudinary.com/dsy30p7gf/video/upload/v1770320881/BACKGROUND-GRADIENT_bejhdr.mp4"
          type="video/mp4"
        />
      </video>
    </div>
  );
}
export default App;


