"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useLogin } from "@/features/auth/auth.hook"
import { AuthKeys, Namespaces } from "@/i18n/keys"
import { Link } from "@/i18n/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { z } from "zod"

export default function LoginPage() {
  const t = useTranslations(Namespaces.Auth)
  const useLoginHook = useLogin()

  const loginSchema = z.object({
    email: z.email({ message: t(AuthKeys.emailInvalid) }),
    password: z.string().min(6, { message: t(AuthKeys.passwordMinLength) })
  })

  type TLoginType = z.infer<typeof loginSchema>

  const form = useForm<TLoginType>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  })


  const onSubmit = (data: TLoginType) => {
    useLoginHook.mutate(data)
  }

  return (
    <div className="bg-white p-10 rounded-3xl">
      <h1 className="text-2xl font-bold text-center p-4">{t(AuthKeys.login)}</h1>
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
          ></FormField>
          <Button type="submit">{t(AuthKeys.submitLogin)}</Button>
        </form>
      </Form>
      <div className="mt-6 text-center text-sm text-gray-500">
        {t(AuthKeys.noAccount)}{" "}
        <Link href="/register" className="text-black font-semibold cursor-pointer hover:underline">
          {t(AuthKeys.registerNow)}
        </Link>
      </div>
    </div>
  )
}
