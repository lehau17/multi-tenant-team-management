"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Link } from "@/i18n/navigation"
import { AuthKeys, Namespaces } from "@/i18n/keys"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { z } from "zod"

export default function RegisterPage() {
  const t = useTranslations(Namespaces.Auth)

  const registerSchema = z.object({
    email: z.email({ message: t(AuthKeys.emailInvalid) }),
    fullname: z.string().min(1, { message: t(AuthKeys.fullnamePlaceHolder) }),
    password: z.string().min(6, { message: t(AuthKeys.passwordMinLength) }),
    confirmPassword: z.string().min(6, { message: t(AuthKeys.passwordMinLength) })
  }).refine((data) => data.password === data.confirmPassword, {
    message: t(AuthKeys.passwordMismatch),
    path: ["confirmPassword"]
  })

  type TRegister = z.infer<typeof registerSchema>

  const form = useForm<TRegister>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", fullname: "", password: "", confirmPassword: "" }
  })

  const onSubmit = (data: TRegister) => {
    console.log(data)
  }

  return (
    <div className="bg-white p-10 rounded-3xl">
      <h1 className="text-2xl font-bold text-center p-4">{t(AuthKeys.register)}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>{t(AuthKeys.email)}</FormLabel>
                  <FormControl>
                    <Input placeholder={t(AuthKeys.emailPlaceholder)} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
          <FormField
            control={form.control}
            name="fullname"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>{t(AuthKeys.fullname)}</FormLabel>
                  <FormControl>
                    <Input placeholder={t(AuthKeys.fullnamePlaceHolder)} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>{t(AuthKeys.password)}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder={t(AuthKeys.passwordPlaceholder)} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>{t(AuthKeys.confirmPassword)}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder={t(AuthKeys.confirmPasswordPlaceholder)} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
          <Button type="submit">{t(AuthKeys.submitRegister)}</Button>
        </form>
      </Form>
      <div className="mt-6 text-center text-sm text-gray-500">
        {t(AuthKeys.haveAccount)}{" "}
        <Link href="/login" className="text-black font-semibold cursor-pointer hover:underline">
          {t(AuthKeys.loginNow)}
        </Link>
      </div>
    </div>
  )
}
