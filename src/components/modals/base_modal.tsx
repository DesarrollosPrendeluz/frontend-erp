"use client";
import React, { useRef, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean; // Controla si el modal está abierto o cerrado
  onClose: () => void; // Función para cerrar el modal
  children: React.ReactNode;
  actionName: string; // Contenido del modal
}


/**
 * 
 * @param isOpen -boolean---
 * @param onClose -callback---
 * @param children -React.ReactNode--- iiner content
 * @param actionName -string--- open button name
 * @returns 
 */
const BaseModal: React.FC<ModalProps> = ({ isOpen, onClose, children, actionName }) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
      const dialog = dialogRef.current;
      if (dialog) {
        if (isOpen) {
          dialog.showModal(); // Abre el modal
        } else {
          dialog.close(); // Cierra el modal
        }
  
        const handleCancel = (event: Event) => {
          event.preventDefault(); // Prevenir el cierre automático del modal
          onClose(); // Llama a la función onClose proporcionada
        };
  
        dialog.addEventListener('cancel', handleCancel);
  
        return () => {
          dialog.removeEventListener('cancel', handleCancel);
        };
      }
    }, [isOpen, onClose]);
  
    // Si el modal no está abierto, no renderiza nada
    if (!isOpen) return null;
  
    return (
      <dialog ref={dialogRef} className="modal rounded w-[35%]">
            <div className='flex justify-end'>
                <button type="button" 
                    className="my-2 py-1 mx-2 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-2   me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900modal-close" 
                    onClick={onClose}>
                    &times;
                </button>
            </div>
            <h1 className='mx-3 text-xl font-semibold'>{actionName}</h1>
            {children}
      </dialog>
    );
  };
  

export default BaseModal;