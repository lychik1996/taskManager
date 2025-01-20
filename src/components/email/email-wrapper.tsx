import {
  Tailwind,
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Column,
} from '@react-email/components';
interface EmailWrapperProps {
  children: React.ReactNode;
}
export default function EmailWrapper({ children }: EmailWrapperProps) {
  return (
    <Tailwind>
      <Html>
        <Head />
        <Preview>Task manager</Preview>
        <Body className="bg-gray-200 font-sans">
          <Container align='center' className="m-8 mx-auto bg-white rounded overflow-hidden max-w-[600px] h-full" style={{border:`1px solid #dddddd` }}>
            <Section>
              <Column>
                <Img src="https://task-manager-lake-eight.vercel.app/logo.png" />
              </Column>
              <Column>
                <Text className=" font-bold text-blue-400 text-lg">
                  Task Manager
                </Text>
              </Column>
            </Section>
            <Section className="px-10">
              <Hr className="border-gray-300 my-5" />
              {children}
              <Hr className="border-gray-300 my-5" />
            </Section>
            <Section className="pb-8">
              <Section className="px-10">
                <Text className="leading-6 text-gray-700 ">
                  Thank you,
                </Text>
                <Text className=" leading-6 text-gray-700 ">
                  The Task Manager team
                </Text>
                <Link href="https://task-manager-lake-eight.vercel.app/" className=" font-bold text-blue-400 text-lg"> Task Manager</Link>
              </Section>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}
