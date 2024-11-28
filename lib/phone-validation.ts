import { z } from 'zod';
import { COUNTRIES } from '@/constants/countries';

export const phoneSchema = z.object({
  phoneNumber: z.string().refine(
    (value) => {
      // Remove all non-digit characters
      const cleanValue = value.replace(/\D/g, '');

      // Find the country based on dial code
      const matchedCountry = COUNTRIES.find((country) =>
        cleanValue.startsWith(country.dialCode.replace('+', '')),
      );

      if (!matchedCountry) {
        return false; // No matching country found
      }

      // Calculate total expected digits
      const expectedTotalDigits = matchedCountry.groups.reduce(
        (a, b) => a + b,
        0,
      );

      // Check if the clean value has the exact number of digits
      return cleanValue.length === expectedTotalDigits;
    },
    { message: 'Invalid phone number for selected country' },
  ),
});

export const formatPhoneNumber = (
  value: string,
  detectedCountry: string | null,
) => {
  const country = COUNTRIES.find((c) => c.code === detectedCountry);
  if (!country) return value;

  const cleanValue = value.replace(/\D/g, '');
  const expectedTotalDigits = country.groups.reduce((a, b) => a + b, 0);

  // Truncate to expected total digits
  const limitedValue = cleanValue.slice(0, expectedTotalDigits);

  let formatted = '';
  let index = 0;
  country.groups.forEach((groupLength) => {
    const group = limitedValue.slice(index, index + groupLength);
    if (group) {
      formatted += group + ' ';
    }
    index += groupLength;
  });

  return formatted.trim();
};

export const limitPhoneInput = (
  value: string,
  detectedCountry: string | null,
): string => {
  const country = COUNTRIES.find((c) => c.code === detectedCountry);
  if (!country) return value;

  const cleanValue = value.replace(/\D/g, '');
  const expectedTotalDigits = country.groups.reduce((a, b) => a + b, 0);

  // Return only the first n digits where n is the expected total digits
  return cleanValue.slice(0, expectedTotalDigits);
};
