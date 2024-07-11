"use server";
import { ID } from "node-appwrite";
import {
  APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
} from "../appwrite.config";
import { parseStringify } from "../utils";

export const createAppointment = async (
  appointmentData: CreateAppointmentParams
) => {
  try {
    console.log("Creating new appointment", appointmentData);
    const newAppointment = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      appointmentData
    );
    console.log("New appointment", newAppointment);
    return parseStringify(newAppointment);
  } catch (error: any) {
    console.log("Error in creating appointment", error);
  }
};
