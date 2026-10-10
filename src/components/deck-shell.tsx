"use client";

import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import type { RevealApi } from "reveal.js";

export type DeckSlide = {
  id: string;
  title: string;
  chapter: string;
};

type DeckShellProps = {
  children: ReactNode;
  slides: readonly DeckSlide[];
};

function updateHash(id: string) {
  const hash = `#/${encodeURIComponent(id)}`;
  if (window.location.hash !== hash) {
    window.history.replaceState(window.history.state, "", hash);
  }
}

function Arrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={
          direction === "left"
            ? "M19 12H5m7-7-7 7 7 7"
            : "M5 12h14m-7-7 7 7-7 7"
        }
      />
    </svg>
  );
}

export default function DeckShell({ children, slides }: DeckShellProps) {
  const appRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLElement>(null);
  const deckRef = useRef<RevealApi | null>(null);
  const lifecycleRef = useRef<Promise<void>>(Promise.resolve());
  const indexButtonRef = useRef<HTMLButtonElement>(null);
  const indexContainerRef = useRef<HTMLDivElement>(null);
  const indexOpenRef = useRef(false);
  const indexPanelId = useId();
  const [view, setView] = useState<"slides" | "reading" | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [indexOpen, setIndexOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [fullscreenSupported, setFullscreenSupported] = useState(false);
  const [fullscreenError, setFullscreenError] = useState("");

  useEffect(() => {
    const viewport = window.matchMedia("(max-width: 767px)");
    const updateView = () => {
      setStatus("loading");
      setView(viewport.matches ? "reading" : "slides");
    };
    updateView();
    viewport.addEventListener("change", updateView);
    return () => viewport.removeEventListener("change", updateView);
  }, []);

  useEffect(() => {
    if (!view) return;

    let cancelled = false;
    let deck: RevealApi | undefined;
    let readingFrame = 0;
    let cleanupReading: (() => void) | undefined;
    const canvas = canvasRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateCurrentSlide = () => {
      if (cancelled || !deck) return;
      const activeId = deck.getCurrentSlide()?.id;
      const index = slides.findIndex((slide) => slide.id === activeId);
      if (index !== -1) setCurrentIndex(index);
    };

    const updateMotion = () => {
      deck?.configure({ transition: reducedMotion.matches ? "none" : "fade" });
    };

    // A fresh effect waits for the previous instance to finish and clean up.
    const initialization = lifecycleRef.current
      .then(async () => {
        if (cancelled || !canvas) return;

        if (view === "reading") {
          const sections = Array.from(
            canvas.querySelectorAll<HTMLElement>(".slides > section"),
          );
          const updateReadingPosition = () => {
            if (cancelled || !sections.length) return;
            const top = canvas.getBoundingClientRect().top;
            const threshold = top + Math.min(canvas.clientHeight * 0.2, 100);
            let active = sections[0];
            for (const section of sections) {
              if (section.getBoundingClientRect().top <= threshold)
                active = section;
              else break;
            }
            if (
              canvas.scrollHeight - canvas.scrollTop - canvas.clientHeight <=
              2
            ) {
              active = sections[sections.length - 1];
            }
            const index = slides.findIndex((slide) => slide.id === active.id);
            if (index !== -1) {
              setCurrentIndex(index);
              updateHash(active.id);
            }
          };
          const schedulePositionUpdate = () => {
            if (readingFrame) return;
            readingFrame = window.requestAnimationFrame(() => {
              readingFrame = 0;
              updateReadingPosition();
            });
          };
          const readHash = () => {
            let id = "";
            try {
              id = decodeURIComponent(
                window.location.hash.replace(/^#\/?/, ""),
              );
            } catch {
              // Invalid external hashes fall back to the current reading position.
            }
            const target = sections.find((section) => section.id === id);
            target?.scrollIntoView({ behavior: "instant", block: "start" });
            schedulePositionUpdate();
          };

          canvas.addEventListener("scroll", schedulePositionUpdate, {
            passive: true,
          });
          window.addEventListener("hashchange", readHash);
          window.addEventListener("resize", schedulePositionUpdate);
          cleanupReading = () => {
            canvas.removeEventListener("scroll", schedulePositionUpdate);
            window.removeEventListener("hashchange", readHash);
            window.removeEventListener("resize", schedulePositionUpdate);
            window.cancelAnimationFrame(readingFrame);
          };
          readHash();
          setFullscreenSupported(Boolean(document.fullscreenEnabled));
          setStatus("ready");
          return;
        }

        const { default: Reveal } = await import("reveal.js");
        if (cancelled || !canvas) return;

        canvas.scrollTop = 0;
        deck = new Reveal(canvas, {
          embedded: true,
          width: 1440,
          height: 900,
          margin: 0.025,
          minScale: 0.15,
          maxScale: 1.8,
          center: false,
          controls: false,
          progress: false,
          slideNumber: false,
          hash: true,
          hashOneBasedIndex: true,
          fragmentInURL: false,
          keyboardCondition: (event) =>
            !indexOpenRef.current &&
            !(
              event.target instanceof Element &&
              event.target.closest(
                'button, a, input, textarea, select, summary, [contenteditable="true"]',
              )
            ),
          transition: reducedMotion.matches ? "none" : "fade",
          transitionSpeed: "fast",
          scrollActivationWidth: 0,
        });
        deck.on("slidechanged", updateCurrentSlide);
        await deck.initialize();
        if (cancelled) return;

        deckRef.current = deck;
        updateCurrentSlide();
        reducedMotion.addEventListener("change", updateMotion);
        setFullscreenSupported(Boolean(document.fullscreenEnabled));
        setStatus("ready");
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          console.error("No se pudo iniciar la presentación.", error);
          setStatus("error");
        }
      });

    lifecycleRef.current = initialization;

    return () => {
      cancelled = true;
      cleanupReading?.();
      if (deckRef.current === deck) deckRef.current = null;
      reducedMotion.removeEventListener("change", updateMotion);
      lifecycleRef.current = initialization.then(() => {
        deck?.off("slidechanged", updateCurrentSlide);
        deck?.destroy();
      });
    };
  }, [slides, view]);

  useEffect(() => {
    const updateFullscreen = () => {
      setFullscreen(document.fullscreenElement === appRef.current);
      deckRef.current?.layout();
    };
    document.addEventListener("fullscreenchange", updateFullscreen);
    return () =>
      document.removeEventListener("fullscreenchange", updateFullscreen);
  }, []);

  useEffect(() => {
    if (!indexOpen) return;

    indexContainerRef.current
      ?.querySelector<HTMLButtonElement>('[aria-current="step"]')
      ?.focus();

    const closeIndex = (returnFocus: boolean) => {
      indexOpenRef.current = false;
      setIndexOpen(false);
      if (returnFocus) indexButtonRef.current?.focus();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        closeIndex(true);
      }
    };
    const closeWhenOutside = (event: PointerEvent | FocusEvent) => {
      if (
        event.target instanceof Node &&
        !indexContainerRef.current?.contains(event.target)
      ) {
        closeIndex(false);
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("pointerdown", closeWhenOutside);
    document.addEventListener("focusin", closeWhenOutside);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.removeEventListener("pointerdown", closeWhenOutside);
      document.removeEventListener("focusin", closeWhenOutside);
    };
  }, [indexOpen]);

  const currentSlide = slides[currentIndex];
  const ready = status === "ready";
  const progress = slides.length
    ? ((currentIndex + 1) / slides.length) * 100
    : 0;

  const goToSlide = (id: string) => {
    if (view === "reading") {
      const target = Array.from(
        canvasRef.current?.querySelectorAll<HTMLElement>(".slides > section") ??
          [],
      ).find((section) => section.id === id);
      if (!target) return;
      target.scrollIntoView({ behavior: "instant", block: "start" });
      updateHash(id);
      setCurrentIndex(slides.findIndex((slide) => slide.id === id));
    } else {
      const deck = deckRef.current;
      const target = deck?.getSlides().find((slide) => slide.id === id);
      if (!deck || !target) return;
      const { h, v } = deck.getIndices(target);
      deck.slide(h, v);
    }
    indexOpenRef.current = false;
    setIndexOpen(false);
    canvasRef.current?.focus({ preventScroll: true });
  };

  const toggleFullscreen = async () => {
    setFullscreenError("");
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await appRef.current?.requestFullscreen();
    } catch {
      setFullscreenError("No fue posible cambiar a pantalla completa.");
    }
  };

  return (
    <div
      ref={appRef}
      className="deck-app"
      data-status={status}
      data-view={view ?? "loading"}
    >
      <header className="deck-header">
        <a
          className="deck-brand"
          href={`#/${slides[0]?.id ?? ""}`}
          aria-label="RFM: volver al inicio de la presentación"
        >
          <span className="deck-brand-mark" aria-hidden="true">
            RFM
          </span>
          <span className="deck-brand-title">Segmentación de clientes</span>
        </a>

        <div className="deck-header-actions">
          <a
            className="deck-button"
            href="/notebooks/actividad2_segmentacion_clientes.ipynb"
            download="actividad2_segmentacion_clientes.ipynb"
            aria-label="Descargar notebook de la actividad 2 (.ipynb)"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5" />
            </svg>
            <span>
              <span className="deck-button-label">Descargar </span>
              notebook
            </span>
          </a>
          {fullscreenSupported ? (
            <button
              type="button"
              className="deck-button deck-fullscreen"
              aria-pressed={fullscreen}
              aria-label={
                fullscreen
                  ? "Salir de pantalla completa"
                  : "Ver en pantalla completa"
              }
              onClick={toggleFullscreen}
              disabled={!ready}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M8 3H3v5m13-5h5v5M3 16v5h5m8 0h5v-5" />
              </svg>
              <span className="deck-button-label">
                {fullscreen ? "Salir" : "Pantalla completa"}
              </span>
            </button>
          ) : null}

          <div ref={indexContainerRef} className="deck-index">
            <button
              ref={indexButtonRef}
              type="button"
              className="deck-button deck-index-toggle"
              aria-expanded={indexOpen}
              aria-controls={indexPanelId}
              disabled={!ready}
              onClick={() => {
                const nextOpen = !indexOpenRef.current;
                indexOpenRef.current = nextOpen;
                setIndexOpen(nextOpen);
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span>Índice</span>
            </button>

            <nav
              id={indexPanelId}
              className="deck-index-panel"
              aria-label="Índice de la presentación"
              hidden={!indexOpen}
            >
              <p className="deck-index-heading">Recorrido de la actividad</p>
              <ol className="deck-index-list">
                {slides.map((slide, index) => (
                  <li key={slide.id}>
                    <button
                      type="button"
                      className="deck-index-link"
                      aria-current={index === currentIndex ? "step" : undefined}
                      onClick={() => goToSlide(slide.id)}
                    >
                      <span className="deck-index-number" aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="deck-index-copy">
                        <span className="deck-index-chapter">
                          {slide.chapter}
                        </span>
                        <span className="deck-index-title">{slide.title}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>
      </header>

      {/* Reveal 6 keeps a scroll-reset timer after destroy; reading uses a fresh node. */}
      <main
        key={view === "reading" ? "reading" : "slides"}
        ref={canvasRef}
        className="reveal deck-canvas"
        aria-label="Presentación de segmentación de clientes"
        aria-busy={status === "loading"}
        tabIndex={-1}
      >
        <div className="slides">{children}</div>
        {status === "loading" ? (
          <div className="deck-status" role="status">
            Preparando la presentación…
          </div>
        ) : null}
        {status === "error" ? (
          <div className="deck-status deck-status-error" role="alert">
            <p>No se pudo abrir la presentación.</p>
            <button
              type="button"
              className="deck-button"
              onClick={() => window.location.reload()}
            >
              Volver a intentar
            </button>
          </div>
        ) : null}
      </main>

      <footer className="deck-toolbar">
        <div className="deck-progress" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
        <button
          type="button"
          className="deck-button deck-previous"
          aria-label="Diapositiva anterior"
          disabled={!ready || currentIndex === 0}
          onClick={() => {
            const previous = slides[currentIndex - 1];
            if (previous) goToSlide(previous.id);
          }}
        >
          <Arrow direction="left" />
          <span className="deck-button-label">Anterior</span>
        </button>
        <div
          className="deck-current"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="deck-counter">
            {String(currentIndex + 1).padStart(2, "0")}
            <span aria-hidden="true"> / </span>
            <span className="sr-only"> de </span>
            {String(slides.length).padStart(2, "0")}
          </span>
          <span className="deck-current-title">{currentSlide?.title}</span>
        </div>
        <button
          type="button"
          className="deck-button deck-next"
          aria-label="Diapositiva siguiente"
          disabled={!ready || currentIndex >= slides.length - 1}
          onClick={() => {
            const next = slides[currentIndex + 1];
            if (next) goToSlide(next.id);
          }}
        >
          <span className="deck-button-label">Siguiente</span>
          <Arrow direction="right" />
        </button>
      </footer>
      {fullscreenError ? (
        <p className="deck-notice" role="status">
          {fullscreenError}
        </p>
      ) : null}
    </div>
  );
}
