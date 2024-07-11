"use client";
import React, { useEffect } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { decryptKey, encryptKey } from "@/lib/utils";
import { set } from "zod";

const PasskeyModal = () => {
  const router = useRouter();
  const path = usePathname();
  const [isOpen, setIsOpen] = React.useState(true);
  const [otp, setOtp] = React.useState("");
  const [error, setError] = React.useState("");

  const encryptedKey =
    typeof window !== "undefined"
      ? window.localStorage.getItem("accessKey")
      : null;

  useEffect(() => {
    if (path) {
      if (encryptedKey) {
        const decryptedKey = decryptKey(encryptedKey);
        if (decryptedKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
          setIsOpen(false);
          router.push("/admin");
        }
      } else {
        setIsOpen(true);
      }
    }
  }, [encryptedKey, path, router]);

  const validatePasskey = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (otp === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
      const encryptedKey = encryptKey(otp);
      localStorage.setItem("accessKey", encryptedKey);
      setIsOpen(false);
    } else {
      setError("Invalid passkey, please try again.");
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    router.push("/");
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-start justify-between">
            Enter Admin Access Pin
            <Image
              src="/assets/icons/close.svg"
              width={20}
              height={20}
              alt="Close"
              onClick={closeModal}
              className="cursor-pointer"
            />
          </AlertDialogTitle>
          <AlertDialogDescription>
            You must enter the admin access pin to continue.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div>
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
          >
            <InputOTPGroup className="shad-otp">
              <InputOTPSlot className="shad-otp-slot" index={0} />
              <InputOTPSlot className="shad-otp-slot" index={1} />
              <InputOTPSlot className="shad-otp-slot" index={2} />
              <InputOTPSlot className="shad-otp-slot" index={3} />
              <InputOTPSlot className="shad-otp-slot" index={4} />
              <InputOTPSlot className="shad-otp-slot" index={5} />
            </InputOTPGroup>
          </InputOTP>
          {error && (
            <p className="shad-error text-16-regular mt-4 flex justify-center">
              {error}
            </p>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={(e) => validatePasskey(e)}
            className="shad-primary-btn w-full"
          >
            Submit Admin Passkey
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PasskeyModal;
