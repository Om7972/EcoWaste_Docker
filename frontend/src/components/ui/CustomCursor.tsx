import React, { useEffect, useRef, useCallback } from 'react';

const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Keep tracking positions and states in refs to avoid React re-renders
  const mouse = useRef({ x: -100, y: -100 });
  const dotPos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  
  const hoverRef = useRef(false);
  const clickRef = useRef(false);
  const visibleRef = useRef(false);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    // Don't run on touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (!visibleRef.current) {
        visibleRef.current = true;
        dotPos.current = { ...mouse.current };
        ringPos.current = { ...mouse.current };
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      hoverRef.current = !!(
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'LABEL' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.classList.contains('cursor-pointer') ||
        (target.onclick !== null)
      );
    };

    const handleMouseDown = () => { clickRef.current = true; };
    const handleMouseUp = () => { clickRef.current = false; };
    const handleMouseLeave = () => { visibleRef.current = false; };
    const handleMouseEnter = () => { visibleRef.current = true; };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    const animate = () => {
      // Dot follows cursor quickly
      dotPos.current.x += (mouse.current.x - dotPos.current.x) * 0.3;
      dotPos.current.y += (mouse.current.y - dotPos.current.y) * 0.3;

      // Ring follows cursor with smooth lag
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.15;

      const visible = visibleRef.current;
      const hovering = hoverRef.current;
      const clicking = clickRef.current;

      // Update dot style
      if (dotRef.current) {
        const dotScale = hovering ? 0.4 : clicking ? 0.6 : 1;
        dotRef.current.style.transform =
          `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0) translate(-50%, -50%) scale(${dotScale})`;
        dotRef.current.style.opacity = visible ? '1' : '0';
      }

      // Update ring style
      if (ringRef.current) {
        const ringScale = hovering ? 1.6 : clicking ? 0.8 : 1;
        ringRef.current.style.transform =
          `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%) scale(${ringScale})`;
        ringRef.current.style.opacity = visible ? '1' : '0';
        ringRef.current.className = `cursor-ring ${hovering ? 'cursor-ring--hover' : ''} ${clicking ? 'cursor-ring--click' : ''}`;
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div className="cursor-wrapper" aria-hidden="true">
      {/* Outer ring */}
      <div ref={ringRef} className="cursor-ring" />
      {/* Inner dot */}
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
};

export default CustomCursor;
