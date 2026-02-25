import NavbarBase from "@/components/layout/NavbarBase";

type TransparentNavbarProps = {
  position?: "fixed" | "sticky";
  className?: string;
  showScrollProgress?: boolean;
  showScrollBackground?: boolean;
  /** When true, use light text (white) for dark backgrounds; when false, use dark text for light backgrounds */
  useLightText?: boolean;
};

export default function TransparentNavbar({
  position = "fixed",
  className = "",
  showScrollProgress = false,
  showScrollBackground = false,
  useLightText = false,
}: TransparentNavbarProps) {
  return (
    <NavbarBase
      variant="transparent"
      position={position}
      showScrollProgress={showScrollProgress}
      showScrollBackground={showScrollBackground}
      transparentUseLightText={useLightText}
      className={`z-50 ${className}`}
    />
  );
}
