import NavbarBase from "@/components/common/NavbarBase";

type NavTarget = "/garden" | "/greenhouse" | "/laboratory";

interface TeamNavbarProps {
  onNavigateRequest?: (path: NavTarget) => void;
}

export default function TeamNavbar({ onNavigateRequest }: TeamNavbarProps) {
  return (
    <NavbarBase
      variant="team"
      onNavigateRequest={onNavigateRequest}
    />
  );
}
