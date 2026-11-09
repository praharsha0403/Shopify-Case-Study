import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cx } from "@/utils/cx";
import { track } from "@/analytics/tracker";

/** Rise-in on first view (Flowpath's entrance). */
export function Rv({ children, className, delay = 0, id, style }: { children: ReactNode; className?: string; delay?: number; id?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          window.setTimeout(() => el.classList.add("in"), delay);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);
  return (
    <div ref={ref} id={id} className={cx("rv", className)} style={style}>
      {children}
    </div>
  );
}

export function Tag({ children, n }: { children: ReactNode; n?: string }) {
  return (
    <span className="tag">
      {n ? <span className="new">{n}</span> : null}
      {children}
    </span>
  );
}

export function SecHead({
  tag,
  n,
  title,
  sub,
  link,
  center,
}: {
  tag: string;
  n?: string;
  title: ReactNode;
  sub?: ReactNode;
  link?: { href: string; label: string };
  center?: boolean;
}) {
  return (
    <Rv className="sec-h">
      <div>
        <Tag n={n}>{tag}</Tag>
        <h2 className="d2">{title}</h2>
      </div>
      {sub || link ? (
        <div className="sec-h__r">
          {sub ? <p className="sub">{sub}</p> : null}
          {link ? (
            <a className="lnk" href={link.href}>
              {link.label} →
            </a>
          ) : null}
        </div>
      ) : null}
    </Rv>
  );
}

/** A thesis read sentence by sentence: each line lights up as it reaches the middle of the screen. */
export function ScrollText({ text, className, accent = [] }: { text: string; className?: string; accent?: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      setP(Math.max(0, Math.min(1, (vh * 0.78 - r.top) / (r.height * 0.9))));
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);
  const parts = text.match(/[^.]+\./g) ?? [text];
  const lit = Math.ceil(p * parts.length);
  const mark = (t: string) => {
    let out: (string | React.ReactElement)[] = [t];
    for (const a of accent) {
      out = out.flatMap((x) => (typeof x === "string" ? x.split(a).flatMap((seg, k, arr) => (k < arr.length - 1 ? [seg, <em key={a + k}>{a}</em>] : [seg])) : [x]));
    }
    return out;
  };
  return (
    <div ref={ref} className={cx("thesis", className)}>
      {parts.map((t, i) => (
        <p key={i} data-on={i < lit || undefined}>
          {mark(t.trim())}
        </p>
      ))}
    </div>
  );
}

/** Progressive disclosure: secondary evidence stays one click away (and opens for print). */
export function More({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <details className="more">
      <summary>
        <span className="more-ic" aria-hidden>
          +
        </span>
        <span className="more-l">
          <b>{label}</b>
          {hint ? <span>{hint}</span> : null}
        </span>
      </summary>
      <div className="more-b">{children}</div>
    </details>
  );
}

export function Note({ title, tone, children, icon }: { title?: ReactNode; tone?: "warn" | "ok"; children: ReactNode; icon?: ReactNode }) {
  return (
    <div className={cx("note", tone)}>
      {title ? (
        <div className="nt">
          {icon}
          {title}
        </div>
      ) : null}
      <div className="prose">{children}</div>
    </div>
  );
}

export function Pull({ children }: { children: ReactNode }) {
  return <p className="pull">{children}</p>;
}

/** A Shopify Help Center (or Newsroom) passage, quoted verbatim with its source. */
export function HC({
  label,
  tone,
  src,
  href,
  title,
  meta,
  children,
  foot,
  className,
}: {
  label: string;
  tone?: "r" | "g" | "b" | "a";
  src: string;
  href: string;
  title?: string;
  meta?: string;
  children: ReactNode;
  foot?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("card hc", className)}>
      <div className="hc-top">
        <span className={cx("chip", tone)}>{label}</span>
        <span className="hc-src">{src}</span>
        <a className="src" href={href} target="_blank" rel="noreferrer">
          Source ↗
        </a>
      </div>
      {title ? (
        <div>
          <div className="hc-t">{title}</div>
          {meta ? <div className="kicker" style={{ marginTop: 2 }}>{meta}</div> : null}
        </div>
      ) : null}
      <blockquote>{children}</blockquote>
      {foot ? <div className="hc-foot">{foot}</div> : null}
    </div>
  );
}

export const Ext = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noreferrer">
    {children}
  </a>
);

/** A real screenshot of a Shopify page, framed in browser chrome, with a highlight marker on the line that matters. */
export function Shot({
  src,
  url,
  href,
  alt,
  mark,
  note,
  dark,
  className,
  caption,
}: {
  src: string;
  url: string;
  href: string;
  alt: string;
  mark?: { x: number; y: number; w: number; h: number };
  note?: ReactNode;
  dark?: boolean;
  className?: string;
  caption?: ReactNode;
}) {
  return (
    <figure className={cx("shot", dark && "shot--dark", className)}>
      <div className="shot-bar">
        <span className="shot-dots" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className="shot-url">{url}</span>
        <a href={href} target="_blank" rel="noreferrer" className="shot-src">
          Open ↗
        </a>
      </div>
      <div className="shot-img">
        <img src={src} alt={alt} loading="lazy" />
        {mark ? (
          <span className="shot-mark" style={{ left: `${mark.x}%`, top: `${mark.y}%`, width: `${mark.w}%`, height: `${mark.h}%` }}>
            {note ? <span className="shot-note">{note}</span> : null}
          </span>
        ) : null}
      </div>
      {caption ? <figcaption className="shot-cap">{caption}</figcaption> : null}
    </figure>
  );
}

/** Flowpath-style "Bands" background: light drifting behind fluted glass strips. Pure CSS, decorative. */
export function Bands({ n = 14, className }: { n?: number; className?: string }) {
  return (
    <div className={cx("bands", className)} aria-hidden>
      <div className="bands-light">
        <i />
        <i />
        <i />
        <i />
        <b className="bands-sweep" />
        <b className="bands-sweep bands-sweep--2" />
      </div>
      <div className="bands-glass">
        {Array.from({ length: n }, (_, i) => (
          <span key={i} />
        ))}
      </div>
    </div>
  );
}

/** Thumbnail that opens a YouTube video in a modal on the same page. */
export function VideoThumb({ id, title, thumb }: { id: string; title: string; thumb: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const openedAt = Date.now();
    track("video_open", { id });
    (window as unknown as { __pnVideo?: (o: boolean) => void }).__pnVideo?.(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      track("video_close", { id, s: Math.round((Date.now() - openedAt) / 1000) });
      (window as unknown as { __pnVideo?: (o: boolean) => void }).__pnVideo?.(false);
    };
  }, [open, id]);
  return (
    <>
      <button type="button" className="vt" onClick={() => setOpen(true)} aria-label={`Play: ${title}`}>
        <img src={thumb} alt={`Thumbnail: ${title}`} loading="lazy" />
        <span className="vt-play" aria-hidden>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M8.5 5.2c0-.8.9-1.3 1.6-.9l9.3 5.9c.6.4.6 1.3 0 1.7l-9.3 5.9c-.7.4-1.6-.1-1.6-.9z" /></svg>
        </span>
        <span className="vt-tag">Play here</span>
      </button>
      {open
        ? createPortal(
        <div className="vm" role="dialog" aria-modal="true" aria-label={title} onClick={() => setOpen(false)}>
          <div className="vm-box" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="vm-x" onClick={() => setOpen(false)} aria-label="Close video">
              ✕
            </button>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
              title={title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          </div>
        </div>,
            document.body,
          )
        : null}
    </>
  );
}
