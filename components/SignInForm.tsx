'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Reveal } from '@/components/Reveal'
import { toast } from './ui/use-toast'
import { useContext } from 'react'
import AuthContext from '@/app/contexts'
import { AuthTypes } from '@/types/types'

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
})

export function SignInForm() {
  const { setEmail, setName, setReferralCode, setWalletId, setWalletAddress,  } = useContext(AuthContext) as any;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.


    // Auth API

    const { username, password } = values

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: username,
        password: password,
      }),
    }

    const url = process.env.NEXT_PUBLIC_API_URL + '/signin';

    const response = await fetch(url, options)
    const data = await response.json()

    console.log(data)
    console.log(data.referral_code)

    if (response.status === 200) {
      console.log("AAAA")
      setEmail(data.email)
      setName(data.name)
      setReferralCode(data.referral_code)
      setWalletId(data.wallet_id)
      setWalletAddress(data.wallet_address)

    } else {
      console.error(data)
    }



    try{
      
      
      toast({
        title: 'You sign in! 🎉',
        description: 'Welcome to the app!',
      })
      console.log(values)

    } catch(err){
      console.error(err)

    }
    
  }

  return (
    <div className='w-full h-[70%]'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='mt-6 h-full space-y-4'
        >
          <Reveal delay={0.4}>
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder='shadcn' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Reveal>
          <Reveal delay={0.6}>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  {/* @ts-ignore */}
                  <FormControl type='password'>
                    <Input placeholder='****' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Reveal>
          <Reveal delay={0.8}>
            <Button className='w-full mt-2' variant='outline' type='submit'>
              Sign in
            </Button>
          </Reveal>
        </form>
      </Form>
    </div>
  )
}
