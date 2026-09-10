"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ContactModal } from "@/components/contact/ContactModal";

type ContactContextValue = {
  openContact: () => void;
  closeContact: () => void;
};

const ContactContext = createContext<ContactContextValue | null>(null);

type ContactProviderProps = {
  children: ReactNode;
  recipientEmail: string;
};

export function ContactProvider({
  children,
  recipientEmail,
}: ContactProviderProps) {
  const [open, setOpen] = useState(false);

  const openContact = useCallback(() => setOpen(true), []);
  const closeContact = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ openContact, closeContact }),
    [openContact, closeContact],
  );

  return (
    <ContactContext.Provider value={value}>
      {children}
      {open ? (
        <ContactModal recipientEmail={recipientEmail} onClose={closeContact} />
      ) : null}
    </ContactContext.Provider>
  );
}

export function useContact() {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error("useContact must be used within ContactProvider");
  }
  return context;
}
