"use client";

import type { FormEvent, ReactNode } from "react";
import { useEffect, useRef } from "react";

export function AutoFilterForm({ children, className }: { children: ReactNode; className?: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function submitAfter(delay: number) {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => formRef.current?.requestSubmit(), delay);
  }

  function handleInput(event: FormEvent<HTMLFormElement>) {
    const target = event.target as HTMLInputElement;
    if (target.name === "q") submitAfter(400);
  }

  function handleChange(event: FormEvent<HTMLFormElement>) {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    if (target.name !== "q") submitAfter(0);
  }

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return <form ref={formRef} method="get" className={className} onInput={handleInput} onChange={handleChange}>
    {children}
  </form>;
}
