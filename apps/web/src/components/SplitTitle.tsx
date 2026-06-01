'use client';

import { useEffect, useRef, useState, CSSProperties, ReactNode, Children } from 'react';

type SplitTitleProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Bán kính ảnh hưởng tính bằng px. Chuột nằm ngoài bán kính này thì không có hiệu ứng. */
  radius?: number;
  /** Độ dạt tối đa mỗi ký tự (px) khi chuột đứng sát ngay trên ký tự. */
  strength?: number;
  as?: keyof React.JSX.IntrinsicElements;
};

/**
 * Bọc heading và làm các ký tự dạt sang trái/phải khỏi vị trí con chuột.
 * Hỗ trợ children là string hoặc <span>nested</span> để giữ màu/gradient từng từ
 * (ví dụ "About <span class='text-red-500'>Me</span>").
 */
export default function SplitTitle({
  children,
  className,
  style,
  radius = 140,
  strength = 28,
  as: Tag = 'span',
}: SplitTitleProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(false);
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!active) return;
    const onMove = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [active]);

  const renderChars = (text: string, baseKey: string, inheritStyle?: CSSProperties) => {
    const chars = Array.from(text);
    return chars.map((ch, i) => {
      const key = `${baseKey}-${i}`;
      if (ch === ' ') {
        return (
          <span key={key} style={{ display: 'inline-block', whiteSpace: 'pre' }}>
            {' '}
          </span>
        );
      }
      return (
        <CharSpan
          key={key}
          char={ch}
          mouse={active ? mouse : null}
          radius={radius}
          strength={strength}
          inheritStyle={inheritStyle}
        />
      );
    });
  };

  const renderNode = (node: ReactNode, keyPrefix: string): ReactNode => {
    if (typeof node === 'string' || typeof node === 'number') {
      return renderChars(String(node), keyPrefix);
    }
    if (Array.isArray(node)) {
      return node.map((n, i) => renderNode(n, `${keyPrefix}-${i}`));
    }
    // Element (e.g. <span className="text-red-500">Me</span>)
    if (node && typeof node === 'object' && 'props' in (node as any)) {
      const el = node as React.ReactElement<{ children?: ReactNode; className?: string; style?: CSSProperties }>;
      const inner = renderNode(el.props.children, `${keyPrefix}-c`);
      const Element = (el.type as any) ?? 'span';
      return (
        <Element
          key={keyPrefix}
          className={el.props.className}
          style={{ ...el.props.style, display: 'inline-block' }}
        >
          {inner}
        </Element>
      );
    }
    return node;
  };

  const content = Children.toArray(children).map((c, i) => renderNode(c, `c${i}`));

  return (
    <Tag
      ref={ref as any}
      className={className}
      style={style}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => {
        setActive(false);
        setMouse(null);
      }}
    >
      {content}
    </Tag>
  );
}

function CharSpan({
  char,
  mouse,
  radius,
  strength,
  inheritStyle,
}: {
  char: string;
  mouse: { x: number; y: number } | null;
  radius: number;
  strength: number;
  inheritStyle?: CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (!mouse || !ref.current) {
      setOffset(0);
      return;
    }
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = mouse.x - cx;
    const dy = mouse.y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > radius) {
      setOffset(0);
      return;
    }
    // Falloff: càng gần càng dạt mạnh. Đẩy ra xa con chuột (ngược dấu dx).
    const falloff = 1 - dist / radius;
    const push = -Math.sign(dx) * strength * falloff * falloff;
    setOffset(push);
  }, [mouse, radius, strength]);

  return (
    <span
      ref={ref}
      style={{
        ...inheritStyle,
        display: 'inline-block',
        transform: `translateX(${offset}px)`,
        transition: 'transform 180ms cubic-bezier(0.22, 1, 0.36, 1)',
        willChange: 'transform',
      }}
    >
      {char}
    </span>
  );
}
