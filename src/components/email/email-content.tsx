import { Text, Link } from '@react-email/components';
import EmailWrapper from './email-wrapper';
import { PUBLIC_APP } from '@/config';

export enum EmailVarian {
  VERIFICATION = 'verification',
  RESEND_VERIFICATION = 'resend_verification',
  UPDATE_TASK = 'update_task',
  APPOINTED_TASK = 'appointed_task',
  CREATE_TASK = 'create_task',
  REMOVE_ASSINGEE_TASK = 'remove_assignee',
  JOIN_WORKSPACE = 'join_workspace',
  REMOVE_MEMBER = 'remove_member',
}
export function EmailContent({
  name,
  href,
  variant,
  appointingName,
  appointingEmail,
  taskName,
  projectName,
  forU,
  workspaceName,
}: Partial<{
  name: string;
  href: string;
  appointingName: string;
  appointingEmail: string;
  taskName: string;
  projectName: string;
  workspaceName: string;
  forU: boolean;
}> & { variant: EmailVarian }) {
  return (
    <EmailWrapper>
      {variant === EmailVarian.VERIFICATION && (
        <>
          <Text>
            Hello: <span className="font-bold">{name}</span>. Copy this link for
            verification account.
          </Text>
          <Link href={href} className="text-xl font-bold">
            Verification link
          </Link>
          <Text>We are glad that you want to join us!</Text>
        </>
      )}
      {variant === EmailVarian.RESEND_VERIFICATION && (
        <>
          <Text>
            Hello: <span className="font-bold">{name}</span>. Copy this link for
            verification account.
          </Text>
          <Link href={href} className="text-xl font-bold">
            Verification link
          </Link>
          <Text>We are glad that you want to join us!</Text>
          <Text>
            If you have a problem with verification,{' '}
            <Link href={`${PUBLIC_APP}contact-us`}>contact us</Link>
          </Text>
        </>
      )}
      {variant === EmailVarian.JOIN_WORKSPACE && (
        <>
          <Text>
            Hello: <span className="font-bold">{name}</span>.
          </Text>
          {forU ? (
            <Text>
              We are glad that you have joined ours workspace:{' '}
              <span className="font-bold">{workspaceName}</span>{' '}
              <Link href={href} className="text-xl font-bold">
                Link
              </Link>
            </Text>
          ) : (
            <>
              <Text>
                User : <span className="font-bold">{appointingName}</span>,
                email: <span className="font-bold">{appointingEmail}</span>
              </Text>
              <Text>
                Joined to our workspace:
                <span className="font-bold">{workspaceName}</span>,{' '}
                <Link href={href} className="text-base font-bold">
                  Link
                </Link>
              </Text>
            </>
          )}
        </>
      )}
      {variant === EmailVarian.REMOVE_MEMBER && (
        <>
          <Text>
            Hello: <span className="font-bold">{name}</span>.
          </Text>
          {forU ? (
            <Text>
              You left from <span className="font-bold">{workspaceName}</span>
            </Text>
          ) : (
            <>
              <Text>
                User: <span>{appointingName}</span>, email:{' '}
                <span className="font-bold">{appointingEmail}</span>
              </Text>
              <Text>
                Left from our workspace:{' '}
                <span className="font-bold">{workspaceName}</span>{' '}
                <Link href={href} className="text-base font-bold">
                  {' '}
                  Link
                </Link>
              </Text>
            </>
          )}
        </>
      )}
      {variant === EmailVarian.CREATE_TASK && (
        <>
          <Text>
            Hello: <span className="font-bold">{name}</span>.
          </Text>
          <Text>
            User <span className="font-bold">{appointingName}</span>, email:
            <span className="font-bold">{appointingEmail}</span>
          </Text>
          <Text>
            Create task: <span className="font-bold">{taskName}</span> in
            project: <span className="font-bold">{projectName}</span>.
          </Text>
          <Text>
            Check task to get more information :{' '}
            <Link href={href} className="text-base font-bold">
              Link
            </Link>
          </Text>
        </>
      )}
      {variant === EmailVarian.APPOINTED_TASK && (
        <>
          <Text>
            Hello: <span className="font-bold">{name}</span>.
          </Text>
          <Text>
            User: <span className="font-bold">{appointingName}</span> email:{' '}
            <span className="font-bold">{appointingEmail}</span>
          </Text>
          <Text>
            Appointed you as the main person in{' '}
            <span className="font-bold">{projectName}</span> for this task{' '}
            <span className="font-bold">{taskName}</span>{' '}
            <Link href={href} className="font-bold">
              Link
            </Link>
          </Text>
        </>
      )}
      {variant === EmailVarian.REMOVE_ASSINGEE_TASK && (
        <>
          <Text>
            Hello: <span className="font-bold">{name}</span>.
          </Text>
          <Text>
            User: <span className="font-bold">{appointingName}</span> email:{' '}
            <span className="font-bold">{appointingEmail}</span>
          </Text>
          <Text>
            Pushed you away in project:{' '}
            <span className="font-bold">{projectName}</span> task:
            <span className="font-bold">{taskName}</span>{' '}
            <Link href={href} className="font-bold">
              Link
            </Link>
          </Text>
        </>
      )}
      {variant === EmailVarian.UPDATE_TASK && (
        <>
          <Text>
            Hello: <span className="font-bold">{name}</span>.
          </Text>
          <Text>
            User: <span className="font-bold">{appointingName}</span> email:{' '}
            <span className="font-bold">{appointingEmail}</span>
          </Text>
          <Text>
            Has changed your task in project:{' '}
            <span className="font-bold">{projectName}</span> task:
            <span className="font-bold">{taskName}</span>{' '}
            <Link href={href} className="font-bold">
              Link
            </Link>
          </Text>
        </>
      )}
    </EmailWrapper>
  );
}
