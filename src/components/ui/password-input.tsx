import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

type PasswordInputProps = React.ComponentProps<typeof Input> & {
  toggleAriaLabel?: string;
};

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, toggleAriaLabel = "Mostrar senha", ...props }, ref) => {
    const [visible, setVisible] = React.useState(false);

    return (
      <div className="relative">
        <Input
          {...props}
          ref={ref}
          type={visible ? "text" : "password"}
          className={["pr-10", className].filter(Boolean).join(" ")}
        />

        <div className="absolute inset-y-0 right-2 flex items-center">
          <Button
            variant="ghost"
            size="sm"
            type="button"
            aria-label={toggleAriaLabel}
            onClick={() => setVisible((v) => !v)}
          >
            {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
