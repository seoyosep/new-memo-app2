"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

type SubmitButtonProps = {
  text: string;
  pendingText?: string;
  className?: string;
};

export function SubmitButton({ text, pendingText = "처리 중...", className }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className={className}>
      {pending ? pendingText : text}
    </Button>
  );
}
