import { Tailwind } from '@react-email/components';

export default function EmailTest({
  name,
  subject,
}: {
  name: string;
  subject: string;
}) {
  return (
    <Tailwind>
      <div className="w-full p-2 border rounded-lg border-black">
        <div className="w-3/4 border-[2px] rounded-lg border-black bg-red-500" >
          <div className="  text-green-400">From : {name}</div>
          <div className=" text-blue-400">
            Subject: {subject}
          </div>
        </div>
      </div>
    </Tailwind>
  );
}
