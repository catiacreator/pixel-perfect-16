import {
  Link as TLink,
  useNavigate as useTNavigate,
  useParams as useTParams,
  Navigate as TNavigate,
  useSearch,
  useLocation,
  useRouter,
} from "@tanstack/react-router";
import type { ComponentProps, ReactElement } from "react";

type AnyLinkProps = Omit<ComponentProps<typeof TLink>, "to" | "params" | "search"> & {
  to: string;
  replace?: boolean;
};

export function Link(props: AnyLinkProps): ReactElement {
  const { to, ...rest } = props;
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

// Minimal useSearchParams compatible with react-router-dom v6 signature.
// Returns [URLSearchParams, setSearchParams] where setSearchParams accepts
// either an object or a URLSearchParams.
export function useSearchParams(): [
  URLSearchParams,
  (next: Record<string, string> | URLSearchParams) => void,
] {
  const search = useSearch({ strict: false }) as Record<string, unknown>;
  const router = useRouter();
  const location = useLocation();

  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(search || {})) {
    if (v !== undefined && v !== null) params.set(k, String(v));
  }

  const setSearchParams = (next: Record<string, string> | URLSearchParams) => {
    const obj: Record<string, string> = {};
    if (next instanceof URLSearchParams) {
      next.forEach((v, k) => { obj[k] = v; });
    } else {
      Object.assign(obj, next);
    }
    router.navigate({ to: location.pathname as never, search: obj as never, replace: false });
  };

  return [params, setSearchParams];
}
