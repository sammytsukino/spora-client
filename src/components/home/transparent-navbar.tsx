import NavbarBase from "@/components/common/navbar-base";

type TransparentNavbarProps = {
  position?: "fixed" | "sticky";
  className?: string;
  showScrollProgress?: boolean;
  showScrollBackground?: boolean;
};

export default function TransparentNavbar({
  position = "fixed",
  className = "",
  showScrollProgress = false,
  showScrollBackground = false,
}: TransparentNavbarProps) {
  return (
    <NavbarBase
      variant="transparent"
      position={position}
      showScrollProgress={showScrollProgress}
      showScrollBackground={showScrollBackground}
      className={`z-50 ${className}`}
    />
  );
}
