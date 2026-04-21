import {
  useCallback,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  ArrowDown,
  ArrowUp,
  Download,
  LogOut,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useShopData } from "../../context/useShopData";
import { VK_URL } from "../../config/site";
import { CATALOG_CATEGORIES } from "../../data/catalog-products";
import { tryAdminLogin, getConfiguredAdminPassword } from "../../shop/adminAuth";
import {
  clearAdminAuthed,
  isAdminAuthed,
  setAdminAuthed,
} from "../../shop/adminSession";
import type { ShopBouquet, ShopProduct, ShopPromo } from "../../shop/types";
import { formatPriceRub } from "../../shop/display";

const IMAGE_MAX_BYTES = 550_000;

function newId(): string {
  return crypto.randomUUID();
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.size > IMAGE_MAX_BYTES) {
      reject(new Error(`Файл больше ${Math.round(IMAGE_MAX_BYTES / 1000)} КБ`));
      return;
    }
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error("Не удалось прочитать файл"));
    r.readAsDataURL(file);
  });
}

function emptyProduct(): ShopProduct {
  return {
    id: newId(),
    name: "",
    categoryId: "cut",
    subtitle: "",
    unitLabel: "от 1 шт",
    badge: "",
    priceRub: null,
    imageUrl: "",
    orderUrl: VK_URL,
    orderLabel: "Заказать во ВК",
  };
}

function emptyPromo(nextOrder: number): ShopPromo {
  return {
    id: newId(),
    title: "Новая акция",
    subtitle: "Краткий текст предложения",
    discountLabel: "",
    backgroundStyle:
      "linear-gradient(128deg, hsl(280 35% 22%) 0%, hsl(300 30% 14%) 100%)",
    linkUrl: VK_URL,
    linkLabel: "Подробнее",
    sortOrder: nextOrder,
  };
}

function parseTagsCsv(input: string): string[] {
  return input
    .split(/[,;\n\r]+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

function emptyBouquet(nextOrder: number): ShopBouquet {
  return {
    id: newId(),
    title: "Новая идея букета",
    description: "",
    tags: [],
    orderUrl: VK_URL,
    orderLabel: "Уточнить во ВКонтакте",
    sortOrder: nextOrder,
  };
}

function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const configured = getConfiguredAdminPassword();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!configured) {
      setError(
        "В .env не задан VITE_ADMIN_PASSWORD — добавьте пароль и перезапустите dev-сервер.",
      );
      return;
    }
    if (!tryAdminLogin(password)) {
      setError("Неверный пароль.");
      return;
    }
    setAdminAuthed();
    window.location.reload();
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/5 p-8">
      <h1 className="font-heading text-2xl font-semibold not-italic text-white">
        Вход в админку
      </h1>
      <p className="mt-2 font-body text-sm text-white/60">
        Данные каталога, акций и букетов хранятся в браузере (localStorage). Сделайте
        резервную копию через «Экспорт JSON» после входа.
      </p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block font-body text-sm text-white/80">
          Пароль
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 font-body text-white outline-none focus:border-white/40"
            autoComplete="current-password"
          />
        </label>
        {error ? (
          <p className="font-body text-sm text-rose-300" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          className="w-full rounded-xl bg-white py-3 font-body text-sm font-semibold text-slate-900 transition hover:bg-white/90"
        >
          Войти
        </button>
      </form>
    </div>
  );
}

function ProductEditor({
  draft,
  setDraft,
  onSave,
  onCancel,
}: {
  draft: ShopProduct;
  setDraft: (p: ShopProduct) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [fileError, setFileError] = useState<string | null>(null);

  const onPickImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    try {
      const url = await readFileAsDataUrl(f);
      setDraft({ ...draft, imageUrl: url });
      setFileError(null);
    } catch (err) {
      setFileError(err instanceof Error ? err.message : "Ошибка файла");
    }
  };

  const priceStr =
    draft.priceRub === null ? "" : String(Math.round(draft.priceRub));

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <h3 className="font-body text-lg font-semibold text-white">
        {draft.name.trim() ? draft.name : "Новый товар"}
      </h3>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="block font-body text-sm text-white/75 md:col-span-2">
          Название
          <input
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
          />
        </label>
        <label className="block font-body text-sm text-white/75">
          Категория
          <select
            value={draft.categoryId}
            onChange={(e) =>
              setDraft({
                ...draft,
                categoryId: e.target.value as ShopProduct["categoryId"],
              })
            }
            className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
          >
            {CATALOG_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id} className="bg-slate-900">
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block font-body text-sm text-white/75">
          Цена (₽), пусто = «по запросу»
          <input
            value={priceStr}
            onChange={(e) => {
              const t = e.target.value.trim();
              if (!t) setDraft({ ...draft, priceRub: null });
              else {
                const n = Number(t.replace(/\s/g, "").replace(",", "."));
                setDraft({
                  ...draft,
                  priceRub: Number.isFinite(n) ? n : null,
                });
              }
            }}
            inputMode="decimal"
            className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
          />
        </label>
        <label className="block font-body text-sm text-white/75 md:col-span-2">
          Описание (подзаголовок)
          <textarea
            value={draft.subtitle}
            onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })}
            rows={3}
            className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
          />
        </label>
        <label className="block font-body text-sm text-white/75">
          Фасовка
          <input
            value={draft.unitLabel}
            onChange={(e) => setDraft({ ...draft, unitLabel: e.target.value })}
            className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
          />
        </label>
        <label className="block font-body text-sm text-white/75">
          Бейдж (необязательно)
          <input
            value={draft.badge ?? ""}
            onChange={(e) =>
              setDraft({ ...draft, badge: e.target.value || undefined })
            }
            className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
          />
        </label>
        <label className="block font-body text-sm text-white/75 md:col-span-2">
          Картинка — URL
          <input
            value={draft.imageUrl.startsWith("data:") ? "" : draft.imageUrl}
            onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value })}
            placeholder="https://…"
            className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
          />
        </label>
        <div className="md:col-span-2">
          <p className="font-body text-sm text-white/75">
            Или загрузите файл (до {Math.round(IMAGE_MAX_BYTES / 1000)} КБ)
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={onPickImage}
            className="mt-2 font-body text-xs text-white/60 file:mr-3 file:rounded-lg file:border-0 file:bg-white/15 file:px-3 file:py-2 file:text-white"
          />
          {draft.imageUrl ? (
            <div className="mt-3 flex items-start gap-3">
              <img
                src={draft.imageUrl}
                alt=""
                className="h-20 w-20 rounded-lg object-cover ring-1 ring-white/20"
              />
              <button
                type="button"
                onClick={() => setDraft({ ...draft, imageUrl: "" })}
                className="font-body text-xs text-rose-300 underline"
              >
                Убрать изображение
              </button>
            </div>
          ) : null}
          {fileError ? (
            <p className="mt-2 font-body text-xs text-rose-300">{fileError}</p>
          ) : null}
        </div>
        <label className="block font-body text-sm text-white/75 md:col-span-2">
          Ссылка заказа (ВК, WhatsApp, форма)
          <input
            value={draft.orderUrl}
            onChange={(e) => setDraft({ ...draft, orderUrl: e.target.value })}
            className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
          />
        </label>
        <label className="block font-body text-sm text-white/75 md:col-span-2">
          Текст кнопки
          <input
            value={draft.orderLabel}
            onChange={(e) => setDraft({ ...draft, orderLabel: e.target.value })}
            className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
          />
        </label>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onSave}
          className="rounded-xl bg-emerald-500/90 px-5 py-2.5 font-body text-sm font-semibold text-white hover:bg-emerald-500"
        >
          Сохранить товар
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-white/20 px-5 py-2.5 font-body text-sm text-white/80 hover:bg-white/5"
        >
          Отмена
        </button>
      </div>
    </div>
  );
}

function PromoEditor({
  draft,
  setDraft,
  onSave,
  onCancel,
}: {
  draft: ShopPromo;
  setDraft: (p: ShopPromo) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <h3 className="font-body text-lg font-semibold text-white">Акция / баннер</h3>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="block font-body text-sm text-white/75 md:col-span-2">
          Заголовок
          <input
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
          />
        </label>
        <label className="block font-body text-sm text-white/75 md:col-span-2">
          Подзаголовок
          <textarea
            value={draft.subtitle}
            onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })}
            rows={2}
            className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
          />
        </label>
        <label className="block font-body text-sm text-white/75">
          Плашка скидки (напр. -15%)
          <input
            value={draft.discountLabel ?? ""}
            onChange={(e) =>
              setDraft({ ...draft, discountLabel: e.target.value || undefined })
            }
            className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
          />
        </label>
        <label className="block font-body text-sm text-white/75">
          Порядок (число)
          <input
            type="number"
            value={draft.sortOrder}
            onChange={(e) =>
              setDraft({
                ...draft,
                sortOrder: Number(e.target.value) || 0,
              })
            }
            className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
          />
        </label>
        <label className="block font-body text-sm text-white/75 md:col-span-2">
          Фон (CSS: linear-gradient(…) или #hex)
          <input
            value={draft.backgroundStyle}
            onChange={(e) =>
              setDraft({ ...draft, backgroundStyle: e.target.value })
            }
            className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 font-mono text-xs text-white"
          />
        </label>
        <label className="block font-body text-sm text-white/75 md:col-span-2">
          Ссылка
          <input
            value={draft.linkUrl}
            onChange={(e) => setDraft({ ...draft, linkUrl: e.target.value })}
            className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
          />
        </label>
        <label className="block font-body text-sm text-white/75 md:col-span-2">
          Текст ссылки
          <input
            value={draft.linkLabel}
            onChange={(e) => setDraft({ ...draft, linkLabel: e.target.value })}
            className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
          />
        </label>
      </div>
      <div
        className="mt-4 h-24 rounded-xl border border-white/10"
        style={{ background: draft.backgroundStyle }}
      />
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onSave}
          className="rounded-xl bg-emerald-500/90 px-5 py-2.5 font-body text-sm font-semibold text-white hover:bg-emerald-500"
        >
          Сохранить баннер
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-white/20 px-5 py-2.5 font-body text-sm text-white/80 hover:bg-white/5"
        >
          Отмена
        </button>
      </div>
    </div>
  );
}

function BouquetEditor({
  draft,
  setDraft,
  onSave,
  onCancel,
}: {
  draft: ShopBouquet;
  setDraft: (b: ShopBouquet) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const tagsField = draft.tags.join(", ");

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <h3 className="font-body text-lg font-semibold text-white">
        Карточка «Букеты»
      </h3>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="block font-body text-sm text-white/75 md:col-span-2">
          Заголовок
          <input
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
          />
        </label>
        <label className="block font-body text-sm text-white/75 md:col-span-2">
          Описание
          <textarea
            value={draft.description}
            onChange={(e) =>
              setDraft({ ...draft, description: e.target.value })
            }
            rows={4}
            className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
          />
        </label>
        <label className="block font-body text-sm text-white/75 md:col-span-2">
          Теги (через запятую или с новой строки)
          <input
            value={tagsField}
            onChange={(e) =>
              setDraft({ ...draft, tags: parseTagsCsv(e.target.value) })
            }
            placeholder="минимализм, подарок, фото"
            className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
          />
        </label>
        <label className="block font-body text-sm text-white/75">
          Порядок на странице
          <input
            type="number"
            value={draft.sortOrder}
            onChange={(e) =>
              setDraft({
                ...draft,
                sortOrder: Number(e.target.value) || 0,
              })
            }
            className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
          />
        </label>
        <label className="block font-body text-sm text-white/75 md:col-span-2">
          Ссылка кнопки (ВК, мессенджер)
          <input
            value={draft.orderUrl}
            onChange={(e) => setDraft({ ...draft, orderUrl: e.target.value })}
            className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
          />
        </label>
        <label className="block font-body text-sm text-white/75 md:col-span-2">
          Текст кнопки
          <input
            value={draft.orderLabel}
            onChange={(e) => setDraft({ ...draft, orderLabel: e.target.value })}
            className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
          />
        </label>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onSave}
          className="rounded-xl bg-emerald-500/90 px-5 py-2.5 font-body text-sm font-semibold text-white hover:bg-emerald-500"
        >
          Сохранить букет
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-white/20 px-5 py-2.5 font-body text-sm text-white/80 hover:bg-white/5"
        >
          Отмена
        </button>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const shop = useShopData();
  const [tab, setTab] = useState<
    "products" | "promos" | "bouquets" | "backup"
  >("products");
  const [productDraft, setProductDraft] = useState<ShopProduct | null>(null);
  const [promoDraft, setPromoDraft] = useState<ShopPromo | null>(null);
  const [bouquetDraft, setBouquetDraft] = useState<ShopBouquet | null>(null);
  const [importText, setImportText] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 4000);
  }, []);

  const maxPromoOrder = useMemo(
    () => shop.promos.reduce((m, p) => Math.max(m, p.sortOrder), -1),
    [shop.promos],
  );

  const maxBouquetOrder = useMemo(
    () => shop.bouquets.reduce((m, b) => Math.max(m, b.sortOrder), -1),
    [shop.bouquets],
  );

  const logout = () => {
    clearAdminAuthed();
    window.location.href = "/admin";
  };

  const downloadBackup = () => {
    const blob = new Blob([shop.exportJson()], {
      type: "application/json;charset=utf-8",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `cveti-shop-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    showToast("Файл скачан.");
  };

  const applyImport = () => {
    const r = shop.importJson(importText);
    if (!r.ok) {
      showToast(r.error ?? "Ошибка импорта");
      return;
    }
    setImportText("");
    showToast("Импорт выполнен.");
  };

  const saveProduct = () => {
    if (!productDraft) return;
    if (!productDraft.name.trim()) {
      showToast("Укажите название товара.");
      return;
    }
    shop.upsertProduct({
      ...productDraft,
      badge: productDraft.badge?.trim() || undefined,
    });
    setProductDraft(null);
    showToast("Товар сохранён.");
  };

  const savePromo = () => {
    if (!promoDraft) return;
    if (!promoDraft.title.trim()) {
      showToast("Укажите заголовок акции.");
      return;
    }
    shop.upsertPromo(promoDraft);
    setPromoDraft(null);
    showToast("Баннер сохранён.");
  };

  const saveBouquet = () => {
    if (!bouquetDraft) return;
    if (!bouquetDraft.title.trim()) {
      showToast("Укажите заголовок карточки.");
      return;
    }
    shop.upsertBouquet({
      ...bouquetDraft,
      tags: [...bouquetDraft.tags],
    });
    setBouquetDraft(null);
    showToast("Букет сохранён.");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-black/20 px-6 py-4">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-body text-xs uppercase tracking-wider text-white/40">
              ЦВЕТИ
            </p>
            <h1 className="font-heading text-2xl font-semibold not-italic text-white">
              Админ-панель
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/catalog"
              className="rounded-lg border border-white/15 px-4 py-2 font-body text-sm text-white/90 hover:bg-white/5"
            >
              Каталог
            </Link>
            <Link
              to="/bouquets"
              className="rounded-lg border border-white/15 px-4 py-2 font-body text-sm text-white/90 hover:bg-white/5"
            >
              Букеты
            </Link>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 font-body text-sm hover:bg-white/15"
            >
              <LogOut className="h-4 w-4" aria-hidden />
              Выйти
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        {toast ? (
          <p
            className="mb-6 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 font-body text-sm text-emerald-100"
            role="status"
          >
            {toast}
          </p>
        ) : null}

        <nav className="mb-8 flex flex-wrap gap-2">
          {(
            [
              ["products", "Товары"],
              ["promos", "Акции в каталоге"],
              ["bouquets", "Букеты"],
              ["backup", "Резервная копия"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`rounded-full px-4 py-2 font-body text-sm font-medium transition ${
                tab === id
                  ? "bg-white text-slate-900"
                  : "bg-white/10 text-white/85 hover:bg-white/15"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        {tab === "products" ? (
          <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="font-body text-sm text-white/60">
                Товаров:{" "}
                <strong className="text-white">{shop.products.length}</strong>
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setProductDraft(emptyProduct())}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 font-body text-sm font-semibold text-slate-900"
                >
                  <Plus className="h-4 w-4" aria-hidden />
                  Добавить товар
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Сбросить каталог, акции и букеты к значениям по умолчанию?",
                      )
                    ) {
                      shop.resetToDefaults();
                      showToast("Сброшено к умолчанию.");
                    }
                  }}
                  className="rounded-xl border border-rose-400/40 px-4 py-2.5 font-body text-sm text-rose-200 hover:bg-rose-500/10"
                >
                  Сброс по умолчанию
                </button>
              </div>
            </div>

            {productDraft ? (
              <ProductEditor
                draft={productDraft}
                setDraft={setProductDraft}
                onSave={saveProduct}
                onCancel={() => setProductDraft(null)}
              />
            ) : null}

            <ul className="space-y-2">
              {shop.products.map((p) => (
                <li
                  key={p.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-body font-semibold text-white">
                      {p.name}
                    </p>
                    <p className="font-body text-xs text-white/45">
                      {p.categoryId} · {formatPriceRub(p.priceRub)}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => setProductDraft({ ...p })}
                      className="rounded-lg border border-white/15 px-3 py-1.5 font-body text-xs hover:bg-white/5"
                    >
                      Изменить
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Удалить «${p.name}»?`)) {
                          shop.deleteProduct(p.id);
                          showToast("Удалено.");
                        }
                      }}
                      className="rounded-lg p-2 text-rose-300 hover:bg-rose-500/10"
                      aria-label={`Удалить ${p.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {tab === "promos" ? (
          <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="font-body text-sm text-white/60">
                Баннеров в карусели каталога:{" "}
                <strong className="text-white">{shop.promos.length}</strong>
              </p>
              <button
                type="button"
                onClick={() =>
                  setPromoDraft(emptyPromo(maxPromoOrder + 1))
                }
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 font-body text-sm font-semibold text-slate-900"
              >
                <Plus className="h-4 w-4" aria-hidden />
                Добавить баннер
              </button>
            </div>

            {promoDraft ? (
              <PromoEditor
                draft={promoDraft}
                setDraft={setPromoDraft}
                onSave={savePromo}
                onCancel={() => setPromoDraft(null)}
              />
            ) : null}

            <ul className="space-y-3">
              {[...shop.promos]
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((p) => (
                  <li
                    key={p.id}
                    className="flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3"
                  >
                    <div
                      className="h-14 w-24 shrink-0 rounded-lg border border-white/10"
                      style={{ background: p.backgroundStyle }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-body font-semibold text-white">{p.title}</p>
                      <p className="truncate font-body text-xs text-white/50">
                        {p.subtitle}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => shop.movePromo(p.id, "up")}
                        className="rounded-lg p-2 hover:bg-white/10"
                        aria-label="Выше"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => shop.movePromo(p.id, "down")}
                        className="rounded-lg p-2 hover:bg-white/10"
                        aria-label="Ниже"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPromoDraft({ ...p })}
                        className="ml-1 rounded-lg border border-white/15 px-3 py-1.5 font-body text-xs hover:bg-white/5"
                      >
                        Изменить
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Удалить акцию «${p.title}»?`)) {
                            shop.deletePromo(p.id);
                            showToast("Удалено.");
                          }
                        }}
                        className="rounded-lg p-2 text-rose-300 hover:bg-rose-500/10"
                        aria-label="Удалить акцию"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        ) : null}

        {tab === "bouquets" ? (
          <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="font-body text-sm text-white/60">
                Карточек на странице «Букеты»:{" "}
                <strong className="text-white">{shop.bouquets.length}</strong>
              </p>
              <button
                type="button"
                onClick={() =>
                  setBouquetDraft(emptyBouquet(maxBouquetOrder + 1))
                }
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 font-body text-sm font-semibold text-slate-900"
              >
                <Plus className="h-4 w-4" aria-hidden />
                Добавить карточку
              </button>
            </div>

            {bouquetDraft ? (
              <BouquetEditor
                draft={bouquetDraft}
                setDraft={setBouquetDraft}
                onSave={saveBouquet}
                onCancel={() => setBouquetDraft(null)}
              />
            ) : null}

            <ul className="space-y-3">
              {[...shop.bouquets]
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((b) => (
                  <li
                    key={b.id}
                    className="flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-body font-semibold text-white">{b.title}</p>
                      <p className="line-clamp-2 font-body text-xs text-white/50">
                        {b.description}
                      </p>
                      {b.tags.length > 0 ? (
                        <p className="mt-1 font-body text-[11px] text-white/40">
                          {b.tags.join(" · ")}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => shop.moveBouquet(b.id, "up")}
                        className="rounded-lg p-2 hover:bg-white/10"
                        aria-label="Выше"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => shop.moveBouquet(b.id, "down")}
                        className="rounded-lg p-2 hover:bg-white/10"
                        aria-label="Ниже"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setBouquetDraft({ ...b, tags: [...b.tags] })}
                        className="ml-1 rounded-lg border border-white/15 px-3 py-1.5 font-body text-xs hover:bg-white/5"
                      >
                        Изменить
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Удалить «${b.title}»?`)) {
                            shop.deleteBouquet(b.id);
                            showToast("Удалено.");
                          }
                        }}
                        className="rounded-lg p-2 text-rose-300 hover:bg-rose-500/10"
                        aria-label="Удалить карточку"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        ) : null}

        {tab === "backup" ? (
          <div className="max-w-2xl space-y-6">
            <p className="font-body text-sm text-white/65">
              Экспортируйте JSON перед сменой браузера или очисткой данных. Импорт
              полностью заменяет товары, акции и букеты.
            </p>
            <button
              type="button"
              onClick={downloadBackup}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-body text-sm font-semibold text-slate-900"
            >
              <Download className="h-4 w-4" aria-hidden />
              Скачать JSON
            </button>
            <div>
              <label className="block font-body text-sm text-white/75">
                Вставьте JSON для импорта
                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  rows={10}
                  className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 p-4 font-mono text-xs text-white"
                />
              </label>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={applyImport}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 font-body text-sm font-semibold text-white hover:bg-emerald-500"
                >
                  <Upload className="h-4 w-4" aria-hidden />
                  Импортировать
                </button>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 font-body text-sm hover:bg-white/5">
                  <input
                    type="file"
                    accept="application/json,.json"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      e.target.value = "";
                      if (!f) return;
                      const r = new FileReader();
                      r.onload = () => setImportText(String(r.result ?? ""));
                      r.readAsText(f);
                    }}
                  />
                  Загрузить файл…
                </label>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function AdminPage() {
  if (!isAdminAuthed()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-16">
        <AdminLogin />
      </div>
    );
  }

  return <AdminDashboard />;
}
