import Link from "next/link";

export default function Custom500() {
  return (
    <h1>
      404 - Not Found <br /> <Link href={"/dashboard"}> Go back to Home </Link>
    </h1>
  );
}
