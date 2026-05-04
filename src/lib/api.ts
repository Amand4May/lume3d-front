/**
 * api.ts — camada centralizada de comunicação com o backend Django.
 *
 * Deploy separado (Vercel + Render):
 *   Defina VITE_API_URL nas variáveis de ambiente do Vercel.
 *   Exemplo: VITE_API_URL=https://lume3d-api.onrender.com
 *
 * Desenvolvimento local:
 *   Crie .env.local com: VITE_API_URL=http://localhost:8000
 */

const BASE_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

if (!BASE_URL && import.meta.env.PROD) {
  console.error(
    "[api.ts] VITE_API_URL não definida. " +
    "Configure esta variável nas Settings do projeto no Vercel."
  );
}

function getCsrfToken(): string {
  const match = document.cookie.match(/csrftoken=([^;]+)/);
  return match ? match[1] : "";
}

let csrfInitialized = false;

async function ensureCsrf(): Promise<void> {
  if (csrfInitialized) return;
  await fetch(`${BASE_URL}/api/csrf/`, { credentials: "include" });
  csrfInitialized = true;
}

async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  await ensureCsrf();

  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCsrfToken(),
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!res.ok) {
    let msg = `Erro ${res.status}`;
    try {
      const body = await res.json();
      msg = body.error ?? body.detail ?? msg;
    } catch {
      // sem body JSON
    }
    throw new Error(msg);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  username: string;
}

export async function apiMe(): Promise<ApiUser | null> {
  const data = await apiFetch<{ user: ApiUser | null }>("/api/me/");
  return data.user;
}

export async function apiLogin(username: string, password: string): Promise<ApiUser> {
  const data = await apiFetch<{ user: ApiUser }>("/api/login/", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  return data.user;
}

export async function apiSignup(name: string, email: string, password: string): Promise<ApiUser> {
  const data = await apiFetch<{ user: ApiUser }>("/api/signup/", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
  return data.user;
}

export async function apiLogout(): Promise<void> {
  await apiFetch("/api/logout/", { method: "POST" });
}

export async function apiChangePassword(currentPassword: string, newPassword: string): Promise<void> {
  await apiFetch("/api/change-password/", {
    method: "POST",
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
    }),
  });
}

export interface ApiProduct {
  id: string;
  db_id: number;
  name: string;
  price: number;
  pixPrice: number;
  category: string;
  tag?: string | null;
  description: string;
  specs: Record<string, string>;
  estoque: number;
}

export async function apiCatalogo(): Promise<ApiProduct[]> {
  return apiFetch<ApiProduct[]>("/api/catalogo/");
}

export interface ApiCartItem {
  id: string;
  db_id: number;
  name: string;
  price: number;
  category: string;
  tag?: string | null;
  quantity: number;
  subtotal: number;
}

export interface ApiCart {
  itens: ApiCartItem[];
  total: number;
}

export async function apiGetCart(): Promise<ApiCart> {
  return apiFetch<ApiCart>("/api/carrinho/");
}

export async function apiAddToCart(db_id: number, quantidade = 1): Promise<void> {
  await apiFetch("/api/carrinho/adicionar/", {
    method: "POST",
    body: JSON.stringify({ db_id, quantidade }),
  });
}

export async function apiUpdateCart(db_id: number, quantidade: number): Promise<void> {
  await apiFetch("/api/carrinho/atualizar/", {
    method: "POST",
    body: JSON.stringify({ db_id, quantidade }),
  });
}

export async function apiRemoveFromCart(db_id: number): Promise<void> {
  await apiFetch("/api/carrinho/remover/", {
    method: "POST",
    body: JSON.stringify({ db_id }),
  });
}

export async function apiClearCart(): Promise<void> {
  await apiFetch("/api/carrinho/limpar/", { method: "POST" });
}

export interface ApiOrderItem {
  nome: string;
  preco_unitario: number;
  quantidade: number;
  subtotal: number;
}

export interface ApiOrder {
  id: number;
  status: string;
  valor_total: number;
  criado_em: string;
  itens: ApiOrderItem[];
}

export async function apiPedidos(): Promise<ApiOrder[]> {
  return apiFetch<ApiOrder[]>("/api/pedidos/");
}

export interface ApiCheckoutResponse {
  checkout_url: string;
  pedido_id: number;
  pagamento_id: number;
}

export async function apiCheckout(): Promise<ApiCheckoutResponse> {
  return apiFetch<ApiCheckoutResponse>("/api/checkout/", { method: "POST" });
}

export interface ApiCheckoutStatus {
  status: "pendente" | "aprovado" | "recusado";
  pedido_id: number;
  valor_total: number;
  criado_em: string;
  itens: ApiOrderItem[];
}

export async function apiCheckoutStatus(sessionId: string): Promise<ApiCheckoutStatus> {
  return apiFetch<ApiCheckoutStatus>(
    `/api/checkout/status/?session_id=${encodeURIComponent(sessionId)}`
  );
}