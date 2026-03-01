import NavbarBase from "@/components/layout/NavbarBase";

type NavTarget = "/garden" | "/greenhouse" | "/laboratory" | "/laboratory/full";

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

