import NavbarBase from "@/components/layout/NavbarBase";

type NavTarget = "/garden" | "/greenhouse" | "/laboratory";

interface LaboratoryNavbarProps {
  onNavigateRequest?: (path: NavTarget) => void;
}

export default function LaboratoryNavbar({ onNavigateRequest }: LaboratoryNavbarProps) {
  return (
    <NavbarBase
      variant="laboratory"
      onNavigateRequest={onNavigateRequest}
    />
  );
}

