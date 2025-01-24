import ContactUsForm from "@/features/auth/components/contact-us-form";
import { getCurrent } from "@/features/auth/queries"

export default async function ContactUs(){
    const user = await getCurrent();
    return(
         <div className="w-full lg:max-w-xl">
                    <ContactUsForm user={user}/>
                </div>
    )
}