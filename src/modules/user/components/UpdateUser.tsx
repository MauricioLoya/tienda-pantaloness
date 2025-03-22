"use client";
import React, { useState, useRef } from "react";
import ModalGeneric from "@/lib/components/ModalGeneric";
import UserForm, { FormUserValues, UserFormHandle } from "./UserForm";
import { useRouter } from "next/navigation";
import { FaEdit } from "react-icons/fa";
import { useToast } from "@/lib/components/ToastContext";
import { UserItem } from "../definitions";
import { updateUserAction } from "../actions/updateUserAction";

interface UpdateUserProps {
  user: UserItem;
}

const UpdateUser: React.FC<UpdateUserProps> = ({ user }) => {
  const router = useRouter();
  const { showToast } = useToast();
  const formRef = useRef<UserFormHandle>(null);

  const initialValues: FormUserValues = {
    email: user.email,
    name: user.name,
    password: "",
    superAdmin: user.superAdmin,
  };

  const [formState, setFormState] = useState<FormUserValues>(initialValues);

  const handleValuesChange = (values: FormUserValues) => {
    setFormState(values);
  };

  const handleSubmit = async (close: () => void) => {
    if (formRef.current) {
      try {
        const validValues = await formRef.current.submit();
        await updateUserAction(user.id, validValues);
        router.refresh();
        showToast("Usuario actualizado correctamente", "success");
        close();
      } catch (errors) {
        showToast("Por favor, corrige los errores en el formulario.", "error");
      }
    }
  };

  return (
    <ModalGeneric
      title="Actualizar Usuario"
      triggerBtnTitle="Actualizar"
      triggerBtnContent={<FaEdit />}
      actionBtnText="Actualizar Cambios"
      cancelBtnText="Cancelar"
      actionBtnFunction={handleSubmit}
      cancelBtnFunction={() => console.log("Cancelar")}
    >
      <UserForm
        ref={formRef}
        initialValues={formState}
        onValuesChange={handleValuesChange}
      />
    </ModalGeneric>
  );
};

export default UpdateUser;
