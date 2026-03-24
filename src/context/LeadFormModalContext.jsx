import { createContext, useContext, useState } from "react";

const LeadFormModalContext = createContext();

export function LeadFormModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formType, setFormType] = useState("contract");

  const openModal = (type = "contract") => {
    setFormType(type);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  return (
    <LeadFormModalContext.Provider value={{ isOpen, formType, openModal, closeModal }}>
      {children}
    </LeadFormModalContext.Provider>
  );
}

export function useLeadFormModal() {
  const ctx = useContext(LeadFormModalContext);
  return ctx || { openModal: () => {}, closeModal: () => {}, isOpen: false, formType: "contract" };
}
