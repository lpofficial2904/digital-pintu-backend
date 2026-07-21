import User from "../models/User.js";

export const findUserByEmail = async (email) => {
  try {
    return await User.findOne({ email });
  } catch (error) {
    console.error("User lookup failed:", error.message);
    return null;
  }
};

export const createUser = async (payload) => {
  try {
    return await User.create(payload);
  } catch (error) {
    console.error("User create failed:", error.message);
    return null;
  }
};
