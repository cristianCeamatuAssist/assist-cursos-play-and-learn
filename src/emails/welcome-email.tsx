import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from '@react-email/components';

interface WelcomeEmailProps {
  name?: string;
  verificationLink?: string;
}

export const WelcomeEmail = ({
  name = 'Student',
  verificationLink = 'https://example.com/verify',
}: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Cursos Play and Learn!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome, {name}!</Heading>
          <Text style={text}>
            Thank you for signing up for Cursos Play and Learn, your gateway to
            interactive learning experiences.
          </Text>
          <Text style={text}>
            Please verify your email address by clicking the link below:
          </Text>
          <Link href={verificationLink} style={button}>
            Verify Email Address
          </Link>
          <Text style={text}>
            If you didn&apos;t create an account, you can safely ignore this email.
          </Text>
          <Text style={footer}>
            &copy; {new Date().getFullYear()} Cursos Play and Learn. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  padding: '20px 0',
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #eee',
  borderRadius: '5px',
  boxShadow: '0 5px 10px rgba(20, 50, 70, 0.2)',
  margin: '0 auto',
  maxWidth: '600px',
  padding: '20px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  marginTop: '30px',
  padding: '0',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  marginTop: '16px',
};

const button = {
  backgroundColor: '#4f46e5',
  borderRadius: '5px',
  color: '#fff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: 'bold',
  marginTop: '26px',
  padding: '12px 24px',
  textDecoration: 'none',
};

const footer = {
  color: '#898989',
  fontSize: '14px',
  marginTop: '50px',
  textAlign: 'center' as const,
}; 