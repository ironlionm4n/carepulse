"use server";
import { ID, Query } from "node-appwrite";
import { users } from "../appwrite.config";
import { parseStringify } from "../utils";

export const createUser = async (user: CreateUserParams) => {
  try {
    console.log("Creating new user", user);
    // userId, email (optional), phone (optional), password (optional), name (optional)
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );
    console.log("New User", newUser);
    return newUser;
  } catch (error: any) {
    if (error && error?.code === 409) {
      const documents = await users.list([Query.equal("email", [user.email])]);

      return documents?.users[0];
    }
  }
};
export const getUser = async (userId: string) => {
  try {
    //console.log("Getting user", userId);
    const user = await users.get(userId);
    //console.log("User", user);
    return parseStringify(user);
  } catch (error: any) {
    console.log("Error in getting user", error);
  }
};
