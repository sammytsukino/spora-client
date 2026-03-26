import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AlertModal from "./AlertModal";

describe("AlertModal", () => {
  it("renders nothing when closed", () => {
    const { container } = render(
      <AlertModal open={false} title="T" description="D" onClose={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("calls onClose when OK clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <AlertModal
        open
        title="Done"
        description="Saved."
        okLabel="GOT IT"
        onClose={onClose}
      />
    );
    await user.click(screen.getByRole("button", { name: /^got it$/i }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("calls onClose when backdrop clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { container } = render(
      <AlertModal open title="T" description="D" onClose={onClose} />
    );
    const backdrop = container.firstElementChild as HTMLElement;
    await user.click(backdrop);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("Escape invokes onClose", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<AlertModal open title="T" description="D" onClose={onClose} />);
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });

  it("uses alertdialog role", () => {
    render(<AlertModal open title="T" description="D" onClose={vi.fn()} />);
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
  });
});
