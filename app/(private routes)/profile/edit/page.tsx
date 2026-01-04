"use client";
import { getMe, updateMe } from "@/lib/api/clientApi";
import css from "./Profile.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import { useAuthStore } from "@/lib/store/authStore";

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true); 
  
  const setUserAuthStore = useAuthStore((state) => state.setUser);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    getMe()
      .then((userData) => {
        if (isMounted) {
          setUser(userData);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Edit profile load error:", err);
          setError("Failed to load profile. Please try logging in again.");
          setIsLoading(false);
          
          setTimeout(() => router.push("/sign-in"), 3000);
        }
      });

    return () => { isMounted = false; };
  }, [router]);

  const handleSubmit = async (formData: FormData) => {
    setError("");
    try {
      const formValues = {
        username: formData.get("username") as string,
        email: user?.email as string,
      };
      
      const res = await updateMe(formValues);
      if (res) {
        setUserAuthStore(res);
        router.push("/profile");
      } else {
        setError("Invalid edit profile");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ?? 
        err.message ?? 
        "Oops... some error occurred"
      );
    }
  };

  const handleClose = () => {
    router.back();
  };

  if (isLoading) {
    return <main className={css.mainContent}><p>Loading...</p></main>;
  }

  if (error && !user) {
    return (
      <main className={css.mainContent}>
        <div className={css.profileCard}>
          <p style={{ color: "red" }}>{error}</p>
          <button onClick={() => router.push("/sign-in")} className={css.saveButton}>
            Go to Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={user?.avatar || "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form action={handleSubmit} className={css.profileInfo}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              name="username"
              id="username"
              type="text"
              defaultValue={user?.username ?? ""}
              className={css.input}
              required
            />
          </div>
          {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
          <p>Email: {user?.email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button
              onClick={handleClose}
              type="button"
              className={css.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
