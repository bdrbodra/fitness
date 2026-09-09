type Category = "barbell" | "dumbbell" | "cable" | "bodyweight" | "cardio" | "default";

const KEYWORDS: [Category, string[]][] = [
  ["barbell", ["bilanciere", "barbell"]],
  ["dumbbell", ["manubri", "manubrio", "dumbbell"]],
  ["cable", ["cavi", "cavo", "cable", "pulley", "macchina", "machine", "lat machine", "leg press", "pressa"]],
  [
    "bodyweight",
    [
      "corpo libero",
      "trazioni",
      "pull-up",
      "pull up",
      "pullup",
      "dip",
      "push-up",
      "push up",
      "pushup",
      "flessioni",
      "plank",
      "addominali",
      "crunch",
    ],
  ],
  ["cardio", ["corsa", "running", "run", "bike", "cyclette", "rowing", "vogatore", "salto", "jump"]],
];

export function categorize(name: string): Category {
  const n = name.toLowerCase();
  for (const [category, keywords] of KEYWORDS) {
    if (keywords.some((k) => n.includes(k))) return category;
  }
  return "default";
}

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function BarbellIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps} {...props}>
      <line x1="3" y1="12" x2="21" y2="12" />
      <rect x="5.5" y="8" width="2.5" height="8" />
      <rect x="16" y="8" width="2.5" height="8" />
      <rect x="2" y="9.5" width="1.5" height="5" />
      <rect x="20.5" y="9.5" width="1.5" height="5" />
    </svg>
  );
}

function DumbbellIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps} {...props}>
      <line x1="9" y1="12" x2="15" y2="12" />
      <rect x="5" y="9" width="3" height="6" />
      <rect x="16" y="9" width="3" height="6" />
    </svg>
  );
}

function CableIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps} {...props}>
      <circle cx="12" cy="5.5" r="2.5" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="12" y1="16" x2="8" y2="20" />
      <line x1="12" y1="16" x2="16" y2="20" />
    </svg>
  );
}

function BodyweightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps} {...props}>
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="6" y1="6" x2="6" y2="10" />
      <line x1="18" y1="6" x2="18" y2="10" />
      <circle cx="12" cy="12" r="1.6" />
      <line x1="12" y1="13.6" x2="12" y2="18" />
      <line x1="12" y1="15" x2="9" y2="17.5" />
      <line x1="12" y1="15" x2="15" y2="17.5" />
    </svg>
  );
}

function CardioIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps} {...props}>
      <circle cx="6" cy="17" r="3" />
      <circle cx="18" cy="17" r="3" />
      <line x1="9" y1="17" x2="13" y2="10" />
      <line x1="13" y1="10" x2="18" y2="17" />
      <line x1="13" y1="10" x2="10" y2="6" />
      <circle cx="10" cy="4.5" r="1.4" />
    </svg>
  );
}

function DefaultIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps} {...props}>
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="2.2" />
    </svg>
  );
}

const ICONS: Record<Category, (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element> = {
  barbell: BarbellIcon,
  dumbbell: DumbbellIcon,
  cable: CableIcon,
  bodyweight: BodyweightIcon,
  cardio: CardioIcon,
  default: DefaultIcon,
};

export function ExerciseIcon({
  name,
  className = "",
  size = 20,
}: {
  name: string;
  className?: string;
  size?: number;
}) {
  const Icon = ICONS[categorize(name)];
  return <Icon width={size} height={size} className={className} />;
}
