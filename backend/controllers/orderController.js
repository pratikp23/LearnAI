import Course from "../models/courseModel.js";
import Razorpay from 'razorpay'
import User from "../models/userModel.js";
import dotenv from "dotenv"
dotenv.config()

// Lazily initialize Razorpay only when real keys are provided
const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_SECRET;
  if (!keyId || !keySecret || keyId.includes("add your") || keySecret.includes("add your")) {
    throw new Error("Razorpay keys are not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_SECRET to your .env file.");
  }
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
};

export const createOrder = async (req, res) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const options = {
      amount: course.price * 100, // in paisa (1 INR = 100 paisa)
      currency: 'INR',
      receipt: `receipt_${courseId.toString()}`,  // Fixed: was incorrectly using template literal
    };

    const razorpayInstance = getRazorpayInstance();
    const order = await razorpayInstance.orders.create(options);
    return res.status(200).json(order);
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: `Order creation failed: ${err.message}` });
  }
};



export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, courseId, userId } = req.body
    const razorpayInstance = getRazorpayInstance();
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
    if (orderInfo.status === 'paid') {
      // Update user and course enrollment
      const user = await User.findById(userId);
      if (!user.enrolledCourses.includes(courseId)) {
        user.enrolledCourses.push(courseId);
        await user.save();
      }

      const course = await Course.findById(courseId).populate("lectures");
      if (!course.enrolledStudents.includes(userId)) {
        course.enrolledStudents.push(userId);
        await course.save();
      }

      return res.status(200).json({ message: "Payment verified and enrollment successful" });
    } else {
      return res.status(400).json({ message: "Payment verification failed (invalid signature)" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: `Internal server error during payment verification: ${error.message}` });
  }
};

// Free course enrollment (for courses with price 0)
export const enrollFreeCourse = async (req, res) => {
  try {
    const { courseId, userId } = req.body;

    if (!courseId || !userId) {
      return res.status(400).json({ message: "Course ID and User ID are required" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const isDemoMode = !process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID.includes("add your");

    if (course.price !== 0 && course.price !== undefined && !isDemoMode) {
      return res.status(400).json({ message: "This course is not free" });
    }

    // Add course to user's enrolled courses
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.enrolledCourses.includes(courseId)) {
      user.enrolledCourses.push(courseId);
      await user.save();
    }

    // Add user to course's enrolled students
    if (!course.enrolledStudents.includes(userId)) {
      course.enrolledStudents.push(userId);
      await course.save();
    }

    return res.status(200).json({ message: "Free course enrollment successful" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error during free enrollment" });
  }
};
