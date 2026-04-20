import Link from "next/link";
import Image from "next/image";
import logoImage from "@/assets/images/logo.png";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center ${className}`} aria-label="ACEキャリア トップへ">
      <Image
        src={logoImage}
        alt="ACEキャリア"
        priority
        className="h-9 w-auto"
      />
    </Link>
  );
}
