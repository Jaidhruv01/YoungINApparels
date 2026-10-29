import Lenis from 'lenis';

class SmoothScrollEngine {
  private lenis: Lenis | null = null;
  private rafId: number | null = null;
  private lockCount = 0;
  private isMobile = false;

  public init() {
    if (typeof window === 'undefined') return;

    this.checkViewport();
    window.addEventListener('resize', this.handleResize);

    if (!this.isMobile) {
      this.startLenis();
    }
  }

  private checkViewport() {
    this.isMobile = window.innerWidth < 768;
  }

  private handleResize = () => {
    const wasMobile = this.isMobile;
    this.checkViewport();

    // Enable native inertial touch scrolling below 768px by destroying Lenis
    if (this.isMobile && !wasMobile) {
      this.destroyLenis();
    } else if (!this.isMobile && wasMobile) {
      this.startLenis();
    }
  };

  private startLenis() {
    if (this.lenis) return;

    try {
      this.lenis = new Lenis({
        lerp: 0.08,
        duration: 1.2,
        // Smooth easing curve cubic-bezier(0.25, 1, 0.5, 1) approximation
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
        smoothWheel: true,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.5,
      });

      const onRaf = (time: number) => {
        if (this.lenis) {
          this.lenis.raf(time);
          this.rafId = requestAnimationFrame(onRaf);
        }
      };

      this.rafId = requestAnimationFrame(onRaf);
    } catch (err) {
      console.warn('Lenis smooth scroll failed to initialize:', err);
    }
  }

  private destroyLenis() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.lenis) {
      this.lenis.destroy();
      this.lenis = null;
    }
  }

  public scrollTo(target: string | number | HTMLElement, offset = 0) {
    if (this.lenis) {
      this.lenis.scrollTo(target, { offset, duration: 1.2 });
    } else {
      if (typeof target === 'number') {
        window.scrollTo({ top: target + offset, behavior: 'smooth' });
      } else if (typeof target === 'string') {
        const el = document.querySelector(target);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  /**
   * Scrollbar Width Compensation & Scroll Locking
   * When opening drawers or modals, prevent page layout jump by setting overflow: hidden on body
   * while dynamically calculating scrollbar width and applying equal padding-right to fixed elements.
   */
  public lockScroll() {
    if (typeof window === 'undefined') return;

    this.lockCount++;
    if (this.lockCount === 1) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty('--scrollbar-compensation', `${scrollbarWidth}px`);
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      if (this.lenis) {
        this.lenis.stop();
      }
    }
  }

  public unlockScroll() {
    if (typeof window === 'undefined') return;

    this.lockCount = Math.max(0, this.lockCount - 1);
    if (this.lockCount === 0) {
      document.documentElement.style.setProperty('--scrollbar-compensation', '0px');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      if (this.lenis) {
        this.lenis.start();
      }
    }
  }

  public destroy() {
    window.removeEventListener('resize', this.handleResize);
    this.destroyLenis();
  }
}

export const smoothScrollEngine = new SmoothScrollEngine();
