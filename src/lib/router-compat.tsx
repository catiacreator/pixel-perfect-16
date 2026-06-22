import {
  Link as TLink,
  useNavigate as useTNavigate,
  useParams as useTParams,
  Navigate as TNavigate,
} from "@tanstack/react-router";
import type { ComponentProps, ReactElement } from "react";

type AnyLinkProps = Omit<ComponentProps<typeof TLink>, "to" | "params" | "search"> & {
  to: string;
  replace?: boolean;
};

export function Link(props: AnyLinkProps): ReactElement {
  const { to, ...rest } = props;
  // Cast to bypass TanStack's typed routes — paths are validated at runtime.
  const Anon = TLink as unknown as (p: { to: string } & typeof rest) => ReactElement;
  return <Anon to={to} {...rest} />;
}

export function useNavigate() {
  const nav = useTNavigate();
  return (to: string, opts?: { replace?: boolean }) =>
    nav({ to: to as never, replace: opts?.replace });
}

export function useParams<T extends Record<string, string> = Record<string, string>>(): Partial<T> {
  return useTParams({ strict: false }) as Partial<T>;
}

export function Navigate({ to, replace }: { to: string; replace?: boolean }): ReactElement {
  const Anon = TNavigate as unknown as (p: { to: string; replace?: boolean }) => ReactElement;
  return <Anon to={to} replace={replace} />;
}
