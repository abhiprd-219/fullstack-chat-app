import User from "../models/user.model.js";

export const addContact = async (req, res) => {
  try {
    const { userId } = req.params; // The ID of the user to be added as a contact
    const currentUser = req.user; // The authenticated user (from protectRoute)

    // Check if currentUser.contacts is defined and is an array
    if (!Array.isArray(currentUser.contacts)) {
      currentUser.contacts = [];
    }

    // Check if the user exists
    const userToAdd = await User.findById(userId);
    if (!userToAdd) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is already a contact
    if (currentUser.contacts.includes(userId)) {
      return res.status(400).json({ message: "User is already in your contacts" });
    }

    // Add the user to the contact list
    currentUser.contacts.push(userId);
    await currentUser.save();

    res.status(200).json({ message: "Contact added successfully" });
  } catch (error) {
    console.error("Error in addContact:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
