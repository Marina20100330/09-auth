import Link from "next/link";
import Image from "next/image";
import css from "./ProfilePage.module.css";
import { getMe } from "@/lib/api/serverApi"; 
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Profile Page | NoteHub",
  description: "View and manage your profile information.",
  openGraph: {
    title: "Profile Page | NoteHub",
    description: "View and manage your profile information.",
    url: "https://09-auth-five-fawn.vercel.app/profile", 
    siteName: "NoteHub",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "Profile page preview",
      },
    ],
  },
};

export default async function Profile() {
  let user = null; 
  let error = null;

  try {
    user = await getMe(); 
  } catch (err) {
    console.error("Failed to fetch user profile:", err);
    error = "Failed to load user profile. Please try again or log in.";
  }

  if (error || !user) {
    return (
      <main className={css.mainContent}>
        <div className={css.profileCard}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <p className={css.error}>{error || "User not found. Please log in."}</p>
          <Link href="/sign-in" className={css.editProfileButton}>
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar && user.avatar.startsWith('http') ? user.avatar : "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
            priority
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: {user.username || user.email.split("@")[0]}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
