const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validate-token");
const BookingModel = require("../models/booking-model");
const EventModel = require("../models/event-model");
const sendMail = require("../helper/send-email");
const UserModel = require("../models/user-model");
const stripe = require("stripe")(
  "sk_test_51PtnI8FsZfFCyFzNbAAkd1cCdQ0ssB5kcAe2bGjF1gFg1MwMJjwe0nbUXrcCWkk5ZVC8smFz2ISQDmO4X3G4JGor00s75fN4ex"
);

router.post("/create-booking", validateToken, async (req, resp) => {
  try {
    req.body.user = req.user._id;

    //create booking
    const booking = await BookingModel.create(req.body);

    //update event ticket
    const event = await EventModel.findById(req.body.event);
    const ticketTypes = event.ticketTypes;
    const updatedTicketTypes = ticketTypes.map((ticketType) => {
      if (ticketType.name === req.body.ticketType) {
        ticketType.booked =
          Number(ticketType.booked ?? 0) + Number(req.body.ticketsCount);
        ticketType.available =
          Number(ticketType.available ?? ticketType.limit) -
          Number(req.body.ticketsCount);
      }
      return ticketType;
    });

    await EventModel.findByIdAndUpdate(req.body.event, {
      ticketTypes: updatedTicketTypes,
    });

    //send mail
    const userObj = await UserModel.findById(req.user._id);
    console.log(userObj.email);
    const emailPayload = {
      email: userObj.email,
      subject: "Booking Confirmation - ShivEvents",
      text: `You have Successfully booked ${req.body.ticketsCount} ticket(s) for ${event.name}`,
      html: ``,
    };
    await sendMail(emailPayload);

    return resp
      .status(201)
      .json({ message: "Booking Created Successfully", booking });
  } catch (error) {
    return resp.status(500).json({ message: error.message });
  }
});

router.get("/get-user-booking", validateToken, async (req, resp) => {
  try {
    const bookings = await BookingModel.find({ user: req.user._id })
      .populate("event")
      .sort({ createdAt: -1 });

    return resp.status(200).json({ data: bookings });
  } catch {
    return resp.status(500).json({ message: error.message });
  }
});

router.get("/get-all-bookings", validateToken, async (req, resp) => {
  try {
    const bookings = await BookingModel.find()
      .populate("event")
      .populate("user")
      .sort({ createdAt: -1 });

    return resp.status(200).json({ data: bookings });
  } catch (error) {
    return resp.status(500).json({ message: error.message });
  }
});

router.post("/cancel-booking", validateToken, async (req, resp) => {
  try {
    const { eventId, paymentId, bookingId, ticketsCount, ticketTypeName } =
      req.body;

    const refunds = await stripe.refunds.create({ payment_intent: paymentId });

    if (refunds.status === "succeeded") {
      await BookingModel.findByIdAndUpdate(bookingId, { status: "cancelled" });

      const event = await EventModel.findById(eventId);
      const ticketTypes = event.ticketTypes;
      const updatedTicketTypes = ticketTypes.map((ticketType) => {
        if (ticketType.name === ticketTypeName) {
          ticketType.booked =
            Number(ticketType.booked ?? 0) - Number(ticketsCount);
          ticketType.available =
            Number(ticketType.available ?? ticketType.limit) +
            Number(ticketsCount);
        }
        return ticketType;
      });

      await EventModel.findByIdAndUpdate(eventId, {
        ticketTypes: updatedTicketTypes,
      });

      const userObj = await UserModel.findById(req.user._id);

      const emailPayload = {
        email: userObj.email,
        subject: "Booking Cancellation - ShivEvents",
        text: `You have Successfully cancelled  ticket(s) for ${event.name}`,
        html: ``,
      };
      await sendMail(emailPayload);

      return resp.status(200).json({ message: "Event Cancelled Successfully" });
    } else {
      return resp.status(400).json({ message: "Refund Failed" });
    }
  } catch (error) {
    return resp.status(500).json({ message: error.message });
  }
});

module.exports = router;
