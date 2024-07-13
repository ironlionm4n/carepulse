"use server";
import { ID, Query } from "node-appwrite";
import {
  APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
} from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";

export const createAppointment = async (
  appointmentData: CreateAppointmentParams
) => {
  try {
    const newAppointment = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      appointmentData
    );
    return parseStringify(newAppointment);
  } catch (error: any) {
    console.log("Error in creating appointment", error);
  }
};

export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId
    );
    return parseStringify(appointment);
  } catch (error: any) {
    console.log("Error in getting appointment's details", error);
  }
};

export const getAppointments = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")]
    );
    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = (appointments.documents as Appointment[]).reduce(
      (acc, appointment) => {
        if (appointment.status === "scheduled") {
          acc.scheduledCount++;
        } else if (appointment.status === "pending") {
          acc.pendingCount++;
        } else if (appointment.status === "cancelled") {
          acc.cancelledCount++;
        }
        return acc;
      },
      initialCounts
    );
    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    };
    return parseStringify(data);
  } catch (error: any) {
    console.log("Error in getting appointments", error);
  }
};

export const updateAppointment = async ({
  appointmentId,
  userId,
  appointment,
  type,
}: UpdateAppointmentParams) => {
  try {
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment
    );
    if (!updatedAppointment) {
      throw new Error("Appointment not found");
    }
    // SMS notifiation

    const sms = `Hello from CarePulse! ${
      type === "schedule"
        ? `Your appointment has been scheduled for ${
            formatDateTime(appointment.schedule).dateTime
          }`
        : `The appointment has been cancelled. Reason: ${appointment.cancellationReason}`
    }`;

    revalidatePath("/admin");
    return parseStringify(updatedAppointment);
  } catch (error: any) {
    console.log("Error in updating appointment", error);
  }
};
