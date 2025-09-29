import { Request, Response } from "express";
import { fetchUserData, updateUserData } from "../repositories/user.repository";

export const getUserData = async (req: any, res: any) => {
    const userId = req.params.id;

    try {
        const user = await fetchUserData(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateUser = async (req: any, res: any) => {
    const userId = req.params.id;
    const data = req.body;

    console.log("Received Update Request:", { userId, data });

    if (!userId || !data) {
        return res.status(400).json({ message: "User ID and data are required" });
    }

    try {
        await updateUserData(userId, data);
        res.json({ message: "User updated successfully" });
    } catch (error: any) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.toString() });
    }
};