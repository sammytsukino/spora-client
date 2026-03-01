import { BubbleBackground } from "@/components/backgrounds/BubbleBackground";

const bubbleColors = {
  first: '18,113,255',
  second: '221,74,255',
  third: '0,220,255',
  fourth: '82,255,90',
  fifth: '244,239,64',
  sixth: '255,100,255',
};

function App() {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <BubbleBackground className="absolute inset-0 w-full h-full" colors={bubbleColors} interactive />
      {/* <video
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
      </video> */}
    </div>
  );
}
export default App;


