"use client";

import Link from "next/link";
import css from "./Header.module.css";
import AuthNavigation from "@/components/AuthNavigation/AuthNavigation";

export default function Header() {
  return (
    <header className={css.header}>
      {}
      <Link href="/" className={css.logo} aria-label="Home">
        NoteHub
      </Link>

      <nav aria-label="Main Navigation">
        <ul className={css.navigation}>
          <li>
            <Link href="/" className={css.navigationLink}>Home</Link>
          </li>

          {}
          <li>
            <Link href="/notes/filter/All" className={css.navigationLink}>Notes</Link>
          </li>

          {}
          <AuthNavigation />
        </ul>
      </nav>
    </header>
  );
}
