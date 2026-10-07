"use server"
import ConnectDB from "@/db/connectDB"
import User from "@/models/User"
import Payment from "@/models/Payment"
export const getUser = async (email) => {
    await ConnectDB()
    const user = await User.findOne({ email })
    if (user) {
        const userObj = user.toObject()
        userObj._id = userObj._id.toString()
        return userObj
    }
    return null
}

// Save or update user data
export const saveUser = async (userData) => {
    await ConnectDB()
    const { email } = userData
    let user = await User.findOne({ email })
    if (user) {
        // Update existing user
        user = await User.findOneAndUpdate({ email }, userData, { new: true })
    } else {
        // Create new user
        user = new User(userData)
        await user.save()
    }
    const userObj = user.toObject()
    userObj._id = userObj._id.toString()
    return userObj
}

// create a function in your useractions.js to fetch user by username
export const getUserByUsername = async (username) => {
    await ConnectDB()
    const user = await User.findOne({ username })
    if (user) {
        const userObj = user.toObject()
        userObj._id = userObj._id.toString()
        return userObj
    }
    return null
}

// Save payment data
export const savePayment = async (paymentData) => {
    await ConnectDB()
    const payment = new Payment(paymentData)
    await payment.save()

    // Only return plain serializable data to Client Components
    const paymentObj = payment.toObject()
    const result = {
        _id: paymentObj._id.toString(),
        fromPerson: paymentObj.fromPerson,
        toPerson: paymentObj.toPerson,
        amount: paymentObj.amount,
        message: paymentObj.message,
        createdAt: paymentObj.createdAt ? paymentObj.createdAt.toISOString() : null,
        updatedAt: paymentObj.updatedAt ? paymentObj.updatedAt.toISOString() : null,
    }

    return result
}

// Fetch payments received for a specific user
export const getPaymentsReceived = async (username) => {
    await ConnectDB()
    const payments = await Payment.find({ toPerson: username })
    return payments.map((payment) => {
        const paymentObj = payment.toObject()
        return {
            _id: paymentObj._id.toString(),
            fromPerson: paymentObj.fromPerson,
            toPerson: paymentObj.toPerson,
            amount: paymentObj.amount,
            message: paymentObj.message,
            createdAt: paymentObj.createdAt ? paymentObj.createdAt.toISOString() : null,
        }
    })
}
// get username by user folder in database
export const getUsernameByEmail = async (email) => {
    await ConnectDB()
    const user = await User.findOne({ email })
    if (user) {
        return user.username
    }
    return null
}

// get all users from database
export const getAllUsers = async () => {
    await ConnectDB()
    const users = await User.find({})
    return users.map((user) => {
        const userObj = user.toObject()
        userObj._id = userObj._id.toString()
        return userObj
    })
}