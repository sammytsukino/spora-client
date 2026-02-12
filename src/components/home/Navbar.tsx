import NavbarBase from "@/components/common/NavbarBase";

type NavbarProps = {
  position?: "fixed" | "sticky";
  className?: string;
  showScrollProgress?: boolean;
};

export default function Navbar({
  position = "fixed",
  className = "",
  showScrollProgress = false,
}: NavbarProps) {
  return (
    <NavbarBase
      variant="default"
      position={position}
      showScrollProgress={showScrollProgress}
      className={`z-50 ${className}`}
    />
  );
}
