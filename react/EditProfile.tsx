"use client";
import { useForm } from "react-hook-form";
import { Input, Button } from "@/shared/ui";

interface EditProfileSchema {
  firstName: string;
  lastName: string;
  phone: string;
}

export const EditProfileForm = ({ initialData }: { initialData: EditProfileSchema }) => {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: initialData
  });

  const onSubmit = async (data: EditProfileSchema) => {
    // Вызов API: updateProfile(data)
    console.log("Updating profile...", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input {...register("firstName")} label="Имя" />
      <Input {...register("lastName")} label="Фамилия" />
      <Input {...register("phone")} label="Телефон" />
      <Button type="submit" loading={isSubmitting}>
        Сохранить изменения
      </Button>
    </form>
  );
};