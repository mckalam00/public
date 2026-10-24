type IconProps = Readonly<{ size: number; color: string }>;

const base = (size: number) =>
  ({
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  }) as const;

export const PhoneIcon = ({ size, color }: IconProps) => (
  <svg {...base(size)} stroke={color}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
  </svg>
);

export const ChatIcon = ({ size, color }: IconProps) => (
  <svg {...base(size)} stroke={color}>
    <path d="M4 5h16v11H9l-5 4z" />
    <path d="M8 10h8M8 13h5" />
  </svg>
);

export const SheetIcon = ({ size, color }: IconProps) => (
  <svg {...base(size)} stroke={color}>
    <rect x={4} y={3} width={16} height={18} rx={2} />
    <path d="M4 9h16M4 15h16M10 3v18" />
  </svg>
);

export const DatabaseIcon = ({ size, color }: IconProps) => (
  <svg {...base(size)} stroke={color}>
    <ellipse cx={12} cy={5.5} rx={7} ry={2.5} />
    <path d="M5 5.5v13c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-13" />
    <path d="M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5" />
  </svg>
);

export const PinIcon = ({ size, color }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" fill={color} />
    <circle cx={12} cy={10} r={2.6} fill="#FFFFFF" />
  </svg>
);

export const CheckIcon = ({ size, color }: IconProps) => (
  <svg {...base(size)} stroke={color}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);
