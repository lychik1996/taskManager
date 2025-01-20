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
  Row,
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
        <Body className="bg-gray-200 font-sans py-3">
          <Container
            align="center"
            className="m-8 mx-auto bg-white rounded overflow-hidden max-w-[500px] h-full"
            style={{ border: `1px solid #dddddd` }}
          >
            <Section className="px-10 py-8">
              <Row>
                <Column>
                  <Img
                    src="https://task-manager-lake-eight.vercel.app/logo.png"
                    className="w-16 h-12"
                  />
                </Column>
                <Column>
                  <Text className=" font-bold text-blue-400 text-lg">
                    Task Manager
                  </Text>
                </Column>
              </Row>
              <Hr className="border-gray-300 my-5" />
              {children}
              <Hr className="border-gray-300 my-5" />
              <Text className="leading-6 text-gray-700 ">
                Thank you,for using our product
              </Text>
              <Text className=" leading-6 text-gray-700 ">
                The Task Manager team!
              </Text>
              <Link
                href="https://task-manager-lake-eight.vercel.app/"
                className=" font-bold text-blue-400 text-lg"
              >
                {' '}
                Task Manager
              </Link>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}
