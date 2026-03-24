import React from "react";

const inputBaseClass =
  "w-full bg-transparent border-none py-[6px] min-h-[28px] text-sm text-[#262626] outline-none placeholder:text-[#262626]/50 font-supply-mono";

const underlineClass = "mt-1 h-[1px] w-full shrink-0 bg-[#262626]/40";

interface UnderlineFieldProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement> | React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    "className"
  > {
  label: string;
  type?: string;
  as?: "textarea";
  hint?: string;
  hintVisibleOnFocus?: boolean;
  
  minRows?: number;
  
  fillParent?: boolean;
}

export default function UnderlineField({
  label,
  type = "text",
  as,
  hint,
  hintVisibleOnFocus,
  id,
  minRows,
  fillParent,
  ...props
}: UnderlineFieldProps) {
  const inputId = id ?? `${label.toLowerCase().replace(/\s/g, "-")}-field`;
  const textareaMinH = minRows ? minRows * 52 : 80;

  return (
    <div
      className={
        "flex flex-col" + (fillParent ? " min-h-0 flex-1" : "")
      }
    >
      <label
        htmlFor={inputId}
        className="mb-2 block text-[13px] font-supply-mono font-semibold text-[#262626]"
      >
        {label}
      </label>
      {as === "textarea" ? (
        <textarea
          id={inputId}
          className={
            inputBaseClass +
            (fillParent
              ? " flex-1 min-h-0 resize-none overflow-y-auto"
              : " resize-y overflow-y-auto " + (hintVisibleOnFocus && hint ? " peer" : ""))
          }
          style={fillParent ? undefined : { minHeight: textareaMinH }}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={inputId}
          type={type}
          className={inputBaseClass + (hintVisibleOnFocus && hint ? " peer" : "")}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      <div className={underlineClass} />
      <div
        className={
          "mt-2 min-h-[2rem] text-xs text-[#262626] font-supply-mono leading-relaxed " +
          (hint
            ? hintVisibleOnFocus
              ? "opacity-0 transition-opacity peer-focus:opacity-100"
              : "opacity-70"
            : "invisible")
        }
      >
        {hint ?? "\u00A0"}
      </div>
    </div>
  );
}
