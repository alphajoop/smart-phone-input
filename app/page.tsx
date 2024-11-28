'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import ParticleBackground from '@/components/ui/ParticleBackground';
import { COUNTRIES, DEFAULT_FLAG } from '@/constants/countries';
import {
  formatPhoneNumber,
  phoneSchema,
  limitPhoneInput,
} from '@/lib/phone-validation';
import { toast } from '@/hooks/use-toast';

export default function PhoneInput() {
  const [detectedCountry, setDetectedCountry] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phoneNumber: '' },
  });

  const phoneNumber = form.watch('phoneNumber').replace(/\s/g, '');

  useEffect(() => {
    const detectedCountry = COUNTRIES.find((country) =>
      phoneNumber.startsWith(country.dialCode.replace('+', '')),
    );

    if (detectedCountry) {
      setDetectedCountry(detectedCountry.code);
    } else {
      setDetectedCountry(null);
    }
  }, [phoneNumber]);

  const onSubmit = (data: z.infer<typeof phoneSchema>) => {
    const selectedCountry = COUNTRIES.find((c) => c.code === detectedCountry);

    toast({
      title: 'Phone Number Validated ✅',
      description: (
        <div className="mt-2 w-full">
          <p>
            <strong>Number:</strong>{' '}
            {formatPhoneNumber(data.phoneNumber, detectedCountry)}
          </p>
          {selectedCountry && (
            <p>
              <strong>Country:</strong> {selectedCountry.name} (
              {selectedCountry.dialCode})
            </p>
          )}
        </div>
      ),
      variant: 'default',
    });
  };

  const selectedCountry = detectedCountry
    ? COUNTRIES.find((c) => c.code === detectedCountry)
    : null;

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-950 via-neutral-900 to-black font-geistsans">
      <ParticleBackground />

      <div className="relative z-10 w-full max-w-md">
        <div className="space-y-6 bg-transparent p-8 md:rounded-2xl md:border md:border-neutral-800/50 md:bg-neutral-900/60 md:shadow-2xl md:backdrop-blur-2xl">
          <div className="flex items-center justify-center space-x-3">
            <Globe className="h-8 w-8 text-neutral-400" strokeWidth={1.5} />
            <h2 className="text-3xl font-light tracking-tight text-white">
              Phone Validator
            </h2>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Phone number</FormLabel>
                    <div className="flex items-center space-x-3">
                      <Image
                        src={selectedCountry?.flagPath || DEFAULT_FLAG}
                        alt={
                          selectedCountry
                            ? `Flag of ${selectedCountry.name}`
                            : 'Unknown flag'
                        }
                        width={40}
                        height={30}
                        className="rounded-sm"
                      />
                      <FormControl className="flex-grow">
                        <Input
                          placeholder="Enter international phone number"
                          {...field}
                          value={formatPhoneNumber(
                            field.value,
                            detectedCountry,
                          )}
                          onChange={(e) => {
                            const value = limitPhoneInput(
                              e.target.value,
                              detectedCountry,
                            );
                            field.onChange({ target: { value } });
                          }}
                        />
                      </FormControl>
                    </div>
                    <FormDescription className="text-neutral-400">
                      {selectedCountry
                        ? `Country: ${selectedCountry.name} (${selectedCountry.dialCode})`
                        : 'Start by entering the country code'}
                    </FormDescription>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full transform bg-gradient-to-r from-cyan-600 to-blue-600 text-white transition-all duration-300 ease-in-out hover:scale-[1.02] hover:from-cyan-700 hover:to-blue-700"
              >
                Validate Number
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
