import {
  FaAtom,
  FaBookOpen,
  FaChartLine,
  FaCogs,
  FaDraftingCompass,
  FaFlask,
  FaGavel,
  FaLanguage,
  FaLaptopCode,
  FaSeedling,
  FaStethoscope,
  FaUniversity,
  FaUserGraduate,
} from "react-icons/fa";

type FacultyIconProps = {
  iconUrl?: string | null;
  facultyName?: string;
  alt: string;
  className?: string;
  fallbackSize?: number;
};

function renderDefaultFacultyIcon(
  facultyName: string,
  size: number,
  label: string,
) {
  const name = facultyName.trim().toLowerCase();

  const props = { "aria-label": label, size };

  if (name.includes("زبان") || name.includes("ادبیات")) return <FaLanguage {...props} />;
  if (name.includes("روان") || name.includes("تربیتی")) return <FaUserGraduate {...props} />;
  if (name.includes("کامپیوتر") || name.includes("رایانه")) return <FaLaptopCode {...props} />;
  if (name.includes("شیمی")) return <FaFlask {...props} />;
  if (name.includes("پزشک") || name.includes("سلامت")) return <FaStethoscope {...props} />;
  if (name.includes("حقوق")) return <FaGavel {...props} />;
  if (name.includes("هنر") || name.includes("معماری")) return <FaDraftingCompass {...props} />;
  if (name.includes("کشاور") || name.includes("منابع طبیعی")) return <FaSeedling {...props} />;
  if (name.includes("مدیریت") || name.includes("اقتصاد")) return <FaChartLine {...props} />;
  if (name.includes("مهندسی")) return <FaCogs {...props} />;
  if (name.includes("علوم پایه") || name.includes("فیزیک")) return <FaAtom {...props} />;
  if (name.includes("علوم انسانی") || name.includes("الهیات")) return <FaBookOpen {...props} />;

  return <FaUniversity {...props} />;
}

export function getFacultyIconSrc(iconUrl?: string | null): string | null {
  if (!iconUrl) return null;

  if (/^(https?:|data:)/i.test(iconUrl)) {
    return iconUrl;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

  if (!apiUrl) return iconUrl;

  const apiOrigin = apiUrl.replace(/\/api$/, "");
  return `${apiOrigin}${iconUrl.startsWith("/") ? "" : "/"}${iconUrl}`;
}

export default function FacultyIcon({
  iconUrl,
  facultyName = "",
  alt,
  className = "h-7 w-7",
  fallbackSize = 24,
}: FacultyIconProps) {
  const source = getFacultyIconSrc(iconUrl);

  if (!source) {
    return renderDefaultFacultyIcon(facultyName, fallbackSize, alt);
  }

  return (
    // SVG files are served by our API and displayed as isolated image resources.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={source} alt={alt} className={`object-contain ${className}`} />
  );
}
