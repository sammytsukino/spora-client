import { Link, type LinkProps } from "react-router-dom";
import {
  stashFloraPreview,
  type FloraPreview,
} from "@/lib/floraPreviewCache";

type FloraLinkState = {
  flora?: FloraPreview;
};

type FloraLinkProps = Omit<LinkProps, "target" | "rel">;

export default function FloraLink({
  children,
  onClick,
  state,
  ...props
}: FloraLinkProps) {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const preview = (state as FloraLinkState | null)?.flora;
    if (preview?.id) {
      stashFloraPreview(preview);
    }
    onClick?.(event);
  };

  return (
    <Link
      target="_blank"
      rel="noopener noreferrer"
      state={state}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
}
