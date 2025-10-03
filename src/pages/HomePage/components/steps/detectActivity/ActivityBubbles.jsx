import { useEffect, useRef, useState, useCallback, useContext } from 'react';
import { gsap } from 'gsap';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { WheatherContext } from '@/shared/context/WhetherProvider';
import { useNavigate } from 'react-router-dom';

const DEFAULT_ITEMS = [
  {
    label: 'home',
    href: '#',
    ariaLabel: 'Home',
    rotation: -8,
    hoverStyles: { bgColor: 'var(--primary)', textColor: 'var(--primary-foreground)' }
  },
  {
    label: 'about',
    href: '#',
    ariaLabel: 'About',
    rotation: 8,
    hoverStyles: { bgColor: 'var(--chart-1)', textColor: 'var(--primary-foreground)' }
  },
  {
    label: 'projects',
    href: '#',
    ariaLabel: 'Documentation',
    rotation: 8,
    hoverStyles: { bgColor: 'var(--chart-3)', textColor: 'var(--primary-foreground)' }
  },
  {
    label: 'blog',
    href: '#',
    ariaLabel: 'Blog',
    rotation: 8,
    hoverStyles: { bgColor: 'var(--destructive)', textColor: 'var(--destructive-foreground)' }
  },
  {
    label: 'contact',
    href: '#',
    ariaLabel: 'Contact',
    rotation: -8,
    hoverStyles: { bgColor: 'var(--chart-4)', textColor: 'var(--primary-foreground)' }
  }
];

export default function BubbleMenu({
  logo,
  onMenuClick,
  className,
  style,
  menuAriaLabel = 'Toggle menu',
  menuBg = 'var(--card)',
  menuContentColor = 'var(--foreground)',
  useFixedPosition = false,
  items,
  animationEase = 'back.out(1.5)',
  animationDuration = 0.5,
  staggerDelay = 0.12,
  openOnLoad = false,
  onActivitySelect,
  selectedActivity,
  isCustomEditing,
  customValue,
  onCustomValueChange,
  onCustomSubmit,
  onCustomCancel
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const { selectedData, setSelectedData, setCurrentStep } = useContext(WheatherContext);
  const [showDialog, setShowDialog] = useState(false);
  const overlayRef = useRef(null);
  const bubblesRef = useRef([]);
  const labelRefs = useRef([]);
  const navigate = useNavigate();
  const [saveValue, setSaveValue] = useState("")
  const handleAnalyze = () => {
    setSelectedData((prev) => ({ ...prev, activity: saveValue }))
    navigate("/dashboard");
  };

  const menuItems = items?.length ? items : DEFAULT_ITEMS;

  const containerClassName = [
    'bubble-menu',
    useFixedPosition ? 'fixed' : 'absolute',
    'left-0 right-0 top-8',
    'flex items-center justify-between',
    'gap-4 px-8',
    'pointer-events-none',
    'z-[1001]',
    className
  ]
    .filter(Boolean)
    .join(' ');

  const handleToggle = useCallback(() => {
    setIsMenuOpen(prev => {
      const nextState = !prev;
      if (nextState) setShowOverlay(true);
      onMenuClick?.(nextState);
      return nextState;
    });

  }, [onMenuClick]);

  // Pulse animation for selection
  const animateSelect = useCallback((el) => {
    if (!el) return;
    gsap.killTweensOf(el);
    const tl = gsap.timeline();
    tl.to(el, { scale: 1.08, duration: 0.16, ease: 'power2.out' })
      .to(el, { scale: 1.0, duration: 0.28, ease: 'elastic.out(1,0.65)' });
  }, []);


  useEffect(() => {
    if (openOnLoad) {
      // call after a tick so any refs are set
      const t = setTimeout(() => handleToggle(), 20);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openOnLoad]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const bubbles = bubblesRef.current.filter(Boolean);
    const labels = labelRefs.current.filter(Boolean);
    if (!overlay || !bubbles.length) return;

    if (isMenuOpen) {
      gsap.set(overlay, { display: 'flex' });
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.set(bubbles, { scale: 0, transformOrigin: '50% 50%' });
      gsap.set(labels, { y: 24, autoAlpha: 0 });

      bubbles.forEach((bubble, i) => {
        const delay = i * staggerDelay + gsap.utils.random(-0.05, 0.05);
        const tl = gsap.timeline({ delay });
        tl.to(bubble, {
          scale: 1,
          duration: animationDuration,
          ease: animationEase
        });
        if (labels[i]) {
          tl.to(
            labels[i],
            {
              y: 0,
              autoAlpha: 1,
              duration: animationDuration,
              ease: 'power3.out'
            },
            '-=' + animationDuration * 0.9
          );
        }

        // Add floating animation after initial scale-in
        tl.to(bubble, {
          y: gsap.utils.random(-8, -4), // Float up slightly
          duration: gsap.utils.random(0.8, 1.2), // Much faster movement
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: gsap.utils.random(0, 0.5) // Quicker stagger
        }, '+=0.1'); // Start sooner
      });
      // If we are already in custom edit mode after menu opens, immediately isolate
      if (isCustomEditing) {
        requestAnimationFrame(() => {
          const customIndex = menuItems.findIndex(it => (it.value === 'custom') || it.label.toLowerCase().includes('custom'));
          if (customIndex > -1 && bubbles[customIndex]) {
            const others = bubbles.filter((_, i) => i !== customIndex);
            gsap.to(others, { autoAlpha: 0, scale: 0.6, duration: 0.25, ease: 'power2.in' });
            const customBubble = bubbles[customIndex];
            gsap.set(customBubble, { position: 'relative', zIndex: 10 });
            // Center via flex already; remove rotation
            gsap.set(customBubble, { rotation: 0 });
            gsap.to(customBubble, { scale: 1.05, duration: 0.3, ease: 'power3.out' });
          }
        });
      }
    } else if (showOverlay) {
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.to(labels, {
        y: 24,
        autoAlpha: 0,
        duration: 0.2,
        ease: 'power3.in'
      });
      gsap.to(bubbles, {
        scale: 0,
        duration: 0.2,
        ease: 'power3.in',
        onComplete: () => {
          gsap.set(overlay, { display: 'none' });
          setShowOverlay(false);
        }
      });
    }
  }, [isMenuOpen, showOverlay, animationEase, animationDuration, staggerDelay, isCustomEditing, menuItems]);

  // When entering or leaving custom editing mode after initial open, animate isolation
  useEffect(() => {
    if (!isMenuOpen || !showOverlay) return;
    const bubbles = bubblesRef.current.filter(Boolean);
    const customIndex = menuItems.findIndex(it => (it.value === 'custom') || it.label.toLowerCase().includes('custom'));
    if (customIndex === -1) return;
    const customBubble = bubbles[customIndex];
    const others = bubbles.filter((_, i) => i !== customIndex);
    if (!customBubble) return;

    if (isCustomEditing) {
      gsap.to(others, { autoAlpha: 0, scale: 0.6, duration: 0.25, ease: 'power2.in' });
      gsap.set(customBubble, { position: 'relative', zIndex: 10, rotation: 0 });
      gsap.to(customBubble, { scale: 1.05, duration: 0.3, ease: 'power3.out' });
    } else {
      // Staggered re-entry when leaving custom
      const baseDelay = 0.07;
      others.forEach((b, i) => {
        gsap.fromTo(b,
          { autoAlpha: 0, scale: 0.7, y: 18 },
          { autoAlpha: 1, scale: 1, y: 0, duration: 0.4, delay: i * baseDelay, ease: 'power3.out' }
        );
      });
      gsap.to(customBubble, { scale: 1, duration: 0.25, ease: 'power2.out' });
    }
  }, [isCustomEditing, isMenuOpen, showOverlay, menuItems]);

  useEffect(() => {
    const handleResize = () => {
      if (isMenuOpen) {
        const bubbles = bubblesRef.current.filter(Boolean);
        const isDesktop = window.innerWidth >= 900;
        bubbles.forEach((bubble, i) => {
          const item = menuItems[i];
          if (bubble && item) {
            const rotation = isDesktop ? (item.rotation ?? 0) : 0;
            gsap.set(bubble, { rotation });
          }
        });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen, menuItems]);

  return (
    <>
      {/* Workaround for silly Tailwind capabilities */}
      <style>{`
        .bubble-menu .menu-line {
          transition: transform 0.3s ease, opacity 0.3s ease;
          transform-origin: center;
        }
        /* Refined pill aesthetic */
        .pill-link {
          position: relative;
          backdrop-filter: blur(10px) saturate(1.15);
          -webkit-backdrop-filter: blur(10px) saturate(1.15);
          background: linear-gradient(145deg, color-mix(in oklch, var(--pill-bg) 94%, black 3%), color-mix(in oklch, var(--pill-bg) 90%, white 4%));
          border: none;
          box-shadow: 0 2px 8px -2px rgba(0,0,0,.2);
          transition: box-shadow .35s cubic-bezier(.4,.2,.2,1), transform .45s cubic-bezier(.33,1.2,.4,1), background .4s ease;
        }
        .pill-link[data-selected='true'] {
          background: linear-gradient(140deg, var(--pill-bg), color-mix(in oklch, var(--pill-bg) 80%, var(--hover-bg)) 85%);
          box-shadow: 0 4px 16px -4px rgba(0,0,0,.3); 
          border: none;
        }
        .pill-link:not([data-selected='true']):hover {
          transform: translateY(-4px) scale(1.025) rotate(var(--item-rot));
          box-shadow: 0 6px 20px -6px rgba(0,0,0,.4);
        }
        .pill-link:focus-visible { outline: none; box-shadow: 0 0 0 3px color-mix(in oklch, var(--hover-bg) 60%, white 10%); }
        .pill-link .pill-label { letter-spacing: .25px; font-weight: 400; }
        .pill-link[data-selected='true'] .pill-label { font-weight: 550; }
        .pill-link[data-editing='true'] { box-shadow: 0 8px 30px -8px rgba(0,0,0,.55); border: 1px solid color-mix(in oklch, var(--pill-bg) 75%, var(--hover-bg)); }
        .pill-link[data-editing='true']::before, .pill-link[data-editing='true']::after { display: none; }
        @media (min-width:900px){ .pill-link { font-size: clamp(1.25rem,3vw,3.25rem);} }
        .bubble-menu-items .pill-list .pill-col:nth-child(4):nth-last-child(2) {
          margin-left: calc(100% / 6);
        }
        .bubble-menu-items .pill-list .pill-col:nth-child(4):last-child {
          margin-left: calc(100% / 3);
        }
        @media (min-width: 900px) {
          .bubble-menu-items .pill-link {
            transform: rotate(var(--item-rot));
          }
          .bubble-menu-items .pill-link:hover {
            transform: rotate(var(--item-rot)) scale(1.06);
            background: var(--hover-bg) !important;
            color: var(--hover-color) !important;
          }
          .bubble-menu-items .pill-link:active {
            transform: rotate(var(--item-rot)) scale(.94);
          }
        }
        @media (max-width: 899px) {
          .bubble-menu-items {
            padding-top: 40px;
            align-items: flex-start;
          }
          .bubble-menu-items .pill-list {
            row-gap: 16px;
          }
          .bubble-menu-items .pill-list .pill-col {
            flex: 0 0 100% !important;
            margin-left: 0 !important;
            overflow: visible;
          }
          .bubble-menu-items .pill-link {
            font-size: clamp(1.2rem, 3vw, 4rem);
            padding: clamp(1rem, 2vw, 2rem) 0;
            min-height: 80px !important;
          }
          .bubble-menu-items .pill-link:hover {
            transform: scale(1.06);
            background: var(--hover-bg);
            color: var(--hover-color);
          }
          .bubble-menu-items .pill-link:active {
            transform: scale(.94);
          }
        }
      `}</style>

      <nav className={containerClassName} style={style} aria-label="Main navigation">
        <div
          className="bubble logo-bubble"
          aria-label="Logo"
          style={{ background: menuBg }}
        >
          <span className="logo-content">
            {typeof logo === 'string' ? (
              <img src={logo} alt="Logo" className="bubble-logo" />
            ) : (
              logo
            )}
          </span>
        </div>
        <button
          type="button"
          className={`bubble toggle-bubble menu-btn ${isMenuOpen ? 'open' : ''}`}
          onClick={handleToggle}
          aria-label={menuAriaLabel}
          aria-pressed={isMenuOpen}
          style={{ background: menuBg }}
        >
          <span className="menu-line" style={{ background: menuContentColor }} />
          <span className="menu-line short" style={{ background: menuContentColor }} />
        </button>
      </nav>

      {showOverlay && (
        <div
          ref={overlayRef}
          className={[
            'bubble-menu-items',
            useFixedPosition ? 'fixed' : 'absolute',
            'inset-0',
            'flex items-center justify-center',
            'pointer-events-none',
            'z-[1000]'
            , 'top-[20px]'
          ].join(' ')}
          aria-hidden={!isMenuOpen}
        >
          <ul
            className={[
              'pill-list',
              'list-none m-0 px-6',
              'w-full max-w-[1600px] mx-auto',
              'flex flex-wrap',
              'gap-x-0 gap-y-1',
              'pointer-events-auto'
            ].join(' ')}
            role="menu"
            aria-label="Menu links"
          >
            {menuItems.map((item, idx) => {
              const isCustom = item.value === 'custom' || item.label.toLowerCase().includes('custom');
              const editingThis = isCustom && isCustomEditing;
              return (
                <li
                  key={idx}
                  role="none"
                  className={`pill-col flex justify-center items-stretch [flex:0_0_calc(100%/3)] box-border ${(editingThis) ?
                    "absolute left-[50%] translate-x-[-50%] w-[500px] mt-4 max-sm:w-[400px] h-[240px]" : ""}`}
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      if (editingThis) return;
                      const val = item.value || item.label;
                      setSaveValue(val);
                      const el = bubblesRef.current[idx];
                      animateSelect(el);
                      onActivitySelect?.(val);
                      if (selectedData.sendData && editingThis === false && !isCustom) {
                        setShowDialog(true)
                      }
                    }}
                    aria-label={item.ariaLabel || item.label}
                    className={[
                      'pill-link',
                      'w-full',
                      'rounded-[999px]',
                      'no-underline',
                      'bg-white',
                      'text-inherit',
                      'shadow-[0_4px_14px_rgba(0,0,0,0.10)]',
                      'flex items-center justify-center',
                      'relative',
                      'transition-[background,color] duration-300 ease-in-out',
                      'box-border',
                      'whitespace-nowrap overflow-hidden',
                      'cursor-pointer border-0'
                    ].join(' ')}
                    style={{
                      ['--item-rot']: `${item.rotation ?? 0}deg`,
                      ['--pill-bg']: selectedActivity === (item.value || item.label)
                        ? (item.hoverStyles?.bgColor || 'var(--primary)')
                        : menuBg,
                      ['--pill-color']: selectedActivity === (item.value || item.label)
                        ? (item.hoverStyles?.textColor || 'var(--primary-foreground)')
                        : menuContentColor,
                      ['--hover-bg']: item.hoverStyles?.bgColor || 'var(--muted)',
                      ['--hover-color']: item.hoverStyles?.textColor || menuContentColor,
                      background: editingThis ? 'var(--card)' : 'var(--pill-bg)',
                      color: 'var(--pill-color)',
                      minHeight: editingThis ? '220px' : 'var(--pill-min-h, 160px)',
                      padding: editingThis ? '1.5rem 2rem' : 'clamp(1.5rem, 3vw, 8rem) 0',
                      fontSize: editingThis ? 'clamp(1rem, 2vw, 2rem)' : 'clamp(1.5rem, 4vw, 4rem)',
                      fontWeight: 400,
                      lineHeight: 0,
                      willChange: 'transform',
                      height: editingThis ? 'auto' : 10,
                      borderRadius: editingThis ? '1.25rem' : '999px',
                      display: 'flex',
                      flexDirection: editingThis ? 'column' : 'row',
                      gap: editingThis ? '1rem' : 0
                    }}
                    data-selected={selectedActivity === (item.value || item.label)}
                    data-editing={editingThis ? 'true' : 'false'}
                    ref={el => {
                      if (el) bubblesRef.current[idx] = el;
                    }}
                  >
                    {!editingThis && (
                      <span
                        className="pill-label inline-block"
                        style={{
                          willChange: 'transform, opacity',
                          height: '1.2em',
                          lineHeight: 1.2
                        }}
                        ref={el => {
                          if (el) labelRefs.current[idx] = el;
                        }}
                      >
                        {item.label}
                      </span>
                    )}
                    {editingThis && (
                      <div className="w-full flex flex-col gap-5 items-stretch text-left" style={{ lineHeight: 1.3 }}>
                        <div className="flex items-center justify-between">
                          <div className="text-xl font-semibold tracking-wide">Custom Activity</div>
                          <button
                            type="button"
                            onClick={onCustomCancel}
                            className="text-sm px-3 py-1 rounded-md bg-muted text-foreground/80 hover:bg-muted/80 transition-colors"
                          >Back</button>
                        </div>
                        <div className="space-y-3">
                          <input
                            type="text"
                            className="w-full px-4 py-3 rounded-md bg-background/60 border border-border focus:outline-none focus:ring-2 focus:ring-primary text-base"
                            placeholder="e.g. Photography, Cycling ..."
                            value={customValue}
                            onChange={(e) => {
                              onCustomValueChange?.(e.target.value);
                              setSaveValue(e.target.value)
                            }}
                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); onCustomSubmit?.(); } }}
                            autoFocus
                          />
                          <div className="flex gap-2 justify-end pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                onCustomSubmit();
                                setShowDialog(true)
                              }}
                              disabled={!customValue.trim()}
                              className="px-6 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed shadow hover:shadow-lg transition-shadow"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </button>
                </li>


              );
            })}
          </ul>
        </div>
      )}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="flex flex-col gap-5 items-center z-[10000]">
          <DialogHeader>
            <DialogTitle className="text-[22px] my-3 text-center">What would you like to do next?</DialogTitle>
            <DialogDescription className="text-[15px] mb-4 max-w-[392px] text-center">
              You can either review the current step before moving forward, or start the analysis right away.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-10">
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => {
                setShowDialog(false);
                handleAnalyze();
              }}
            >
              Start Analysis
            </Button>

            <Button
              variant="default"
              className="cursor-pointer"
              onClick={() => {
                setShowDialog(false);
                setCurrentStep(2);
              }}
            >
              Go to Next Step
            </Button>

          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
