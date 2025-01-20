import {Text,Link } from '@react-email/components';
import EmailWrapper from './email-wrapper';

export default function EmailVerification({
  name,
  href
}: {
  name: string;
  href: string;
}) {
  return (
    <EmailWrapper>
      <Text>Hello: <span className='font-bold'>{name}</span>. Copy this link for verification account.</Text>
      <Link href={href}  className='text-xl font-bold'>Verification link</Link>
      <Text>We are glad that you want to join us!</Text>
    </EmailWrapper>
  );
}
