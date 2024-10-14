const mogoose = require("mongoose");
const bookingSchema = new mogoose.Schema(
  {
    event: {
      type: mogoose.Schema.Types.ObjectId,
      ref: "events",
      required: true,
    },
    user: {
      type: mogoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    ticketType: {
      type: String,
      required: true,
    },
    ticketsCount: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "Booked",
    },
  },

  { timestamps: true }
);

const BookingModel = mogoose.model("bookings", bookingSchema);
module.exports= BookingModel;
