import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getAppointment } from "@/lib/actions/appointment.actions";
import { Doctors } from "@/constants";
import { formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
const Success = async ({
  params: { userId },
  searchParams,
}: SearchParamProps) => {
  const appointmentId = (searchParams?.appointmentId as string) || "";
  const appointment = await getAppointment(appointmentId);
  const doctor = Doctors.find(
    (doc) => doc.name === appointment.primaryPhysician
  );
  return (
    <div className="flex h-screen max-h-sreen px-[5%]">
      <div className="success-img">
        <Link href="/">
          <Image
            src="/assets/icons/logo-full.svg"
            alt="Pulsecare"
            width={1000}
            height={1000}
            className="h-15 w-fit"
          />
        </Link>
        <section className="flex flex-col items-center">
          <Image
            src="/assets/gifs/success.gif"
            height={300}
            width={280}
            alt="logo"
          />
          <h2 className="header mb-6 max-w-[600px] text-center">
            Your <span className="text-green-500">appointment</span> has been
            successfully scheduled
          </h2>
          <p>Please check your email for confirmation</p>
        </section>
        <section className="request-details">
          <p>Requested appointment details</p>
          <div className="flex items-center gap-3">
            <Image src={doctor?.image!} alt="Doctor" width={100} height={100} />
            <p className="whitespace-nowrap">
              Dr. <span>{doctor?.name}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Image
              src="/assets/icons/calendar.svg"
              alt="Calendar"
              width={24}
              height={24}
            />
            <p>{formatDateTime(appointment.schedule).dateTime}</p>
          </div>
        </section>
        <Button variant="outline" className="shad-primary-btn" asChild>
          <Link href={`/patients/${userId}/new-appointment`}>
            Schedule New Appointment
          </Link>
        </Button>
        <p className="justify-items-end text-dark-600 xl:text-left py-12">
          © 2024 CarePulse
        </p>
      </div>
    </div>
  );
};

export default Success;
