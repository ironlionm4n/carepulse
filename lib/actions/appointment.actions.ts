"use server";
import { ID, Query } from "node-appwrite";
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

export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId
    );
    console.log("Appointment details", appointment);
    return parseStringify(appointment);
  } catch (error: any) {
    console.log("Error in getting appointment's details", error);
  }
};
