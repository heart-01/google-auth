"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <p>สวัสดี, {session.user?.name}</p>
        <p>ไอดีโทเค็นของคุณ: {session.id_token}</p>
        <button onClick={() => signOut()}>ออกจากระบบ</button>
      </>
    );
  } else {
    return (
      <>
        <p>คุณยังไม่ได้เข้าสู่ระบบ</p>
        <button onClick={() => signIn("google")}>เข้าสู่ระบบด้วย Google</button>
      </>
    );
  }
}