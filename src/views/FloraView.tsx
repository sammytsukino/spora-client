import useScreenSize from "@/hooks/use-screen-size";
import FloraDetail from "./FloraDetail";
import FloraReader from "./FloraReader";

export default function FloraView() {
  const { lessThan } = useScreenSize();
  const isMobile = lessThan("md");

  return isMobile ? <FloraDetail /> : <FloraReader />;
}
