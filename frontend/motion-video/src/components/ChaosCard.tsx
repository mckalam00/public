import { COLORS, RADIUS, SHADOW } from "../config/theme";
import { lerp, type ChaosItem } from "../lib/anim";
import { ChatIcon, PhoneIcon, SheetIcon } from "./Icons";

export type ChaosKind = "phone" | "chat" | "sheet";

type Props = Readonly<{
  item: ChaosItem;
  kind: ChaosKind;
  label: string;
  /** 0~1 등장 정도 */
  appear: number;
  /** 0~1 로고 중심으로 빨려 들어가는 정도 */
  converge: number;
  /** 흔들림 각도(deg) */
  wiggle: number;
  centerX: number;
  centerY: number;
  dark?: boolean;
}>;

const ICON_COLOR: Record<ChaosKind, string> = {
  phone: COLORS.blue,
  chat: COLORS.navy,
  sheet: COLORS.subText,
};

const renderIcon = (kind: ChaosKind, color: string) => {
  if (kind === "phone") return <PhoneIcon size={34} color={color} />;
  if (kind === "chat") return <ChatIcon size={34} color={color} />;
  return <SheetIcon size={34} color={color} />;
};

/** 전화·카톡·엑셀 업무를 상징하는 흩어진 카드 */
export const ChaosCard = ({ item, kind, label, appear, converge, wiggle, centerX, centerY, dark = false }: Props) => {
  const x = lerp(item.x, centerX, converge);
  const y = lerp(item.y, centerY, converge);
  const scale = appear * lerp(1, 0.15, converge);
  const iconColor = dark ? COLORS.surface : ICON_COLOR[kind];

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${item.rotate + wiggle}deg) scale(${scale})`,
        opacity: appear * (1 - converge * 0.6),
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "16px 26px",
        borderRadius: RADIUS.pill,
        background: dark ? COLORS.navySoft : COLORS.surface,
        boxShadow: SHADOW.card,
        color: dark ? COLORS.surface : COLORS.text,
        fontSize: 28,
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {renderIcon(kind, iconColor)}
      {label}
    </div>
  );
};
