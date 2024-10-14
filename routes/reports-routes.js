const express = require("express");
const router = express.Router();
const BookingModel = require("../models/booking-model");
const EventModel = require("../models/event-model");
const validateToken = require("../middleware/validate-token");

router.post("/get-admin-reports", validateToken, async (req, resp) => {
  try {
    const { startDate, endDate, eventId } = req.body;
    let query = {};
    if (eventId) {
      query = { event: eventId };
    }

    if (startDate && endDate) {
      query = {
        ...query,
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate + "T23:59:59:999Z"),
        },
      };
    }

    const bookings = await BookingModel.find(query);

    const totalBookings = bookings.length;
    const cancelledBookings = bookings.filter(
      (booking) => booking.status === "cancelled"
    ).length;
    const totalTickets = bookings.reduce(
      (acc, booking) => acc + booking.ticketsCount,
      0
    );
    const cancelledTickets = bookings
      .filter((booking) => booking.status === "cancelled")
      .reduce((acc, booking) => acc + booking.ticketsCount, 0);

    const totalRevenueCollected = bookings
      .filter((booking) => booking.status === "cancelled")
      .reduce((acc, booking) => acc + booking.totalAmount, 0);

    const totalRevenueRefunded = bookings
      .filter((booking) => booking.status === "cancelled")
      .reduce((acc, booking) => acc + booking.totalAmount, 0);

    const responseObject = {
      totalBookings,
      cancelledBookings,
      totalTickets,
      cancelledTickets,
      totalRevenueCollected,
      totalRevenueRefunded,
    };

    if (!eventId) {
      return resp.status(200).json({ data: responseObject });
    }

    const event = await EventModel.findById(eventId);
    const ticketTypesInEvents = event.ticketTypes;

    const ticketTypesAndTheirSales = [];

    ticketTypesInEvents.forEach((ticketType) => {
      const bookingsWithTicketType = bookings.filter(
        (booking) => booking.ticketType === ticketType.name
      );
      ticketTypesAndTheirSales.push({
        name: ticketType.name,
        ticketsSold:
          bookingsWithTicketType.reduce(
            (acc, booking) => acc + booking.ticketsCount,
            0
          ) || 0,

        revenue:
          bookingsWithTicketType.reduce(
            (acc, booking) => acc + booking.totalAmount,
            0
          ) || 0,
      });
    });

    responseObject.ticketTypesAndTheirSales = ticketTypesAndTheirSales;
    resp.status(200).json({ data: responseObject });
  } catch (error) {
    return resp.status(500).json({ message: error.message });
  }
});

router.get("/get-user-reports", validateToken, async (req, resp) => {
  try {
    const userId = req.user._id;
    const bookings = await BookingModel.find({ user: userId });
    const totalBookings = bookings.length;
    const cancelledBookings = bookings.filter(
      (booking) => booking.status === "cancelled"
    ).length;

    const totalTickets = bookings.reduce(
      (acc, booking) => acc + booking.ticketsCount,
      0
    );

    const cancelledTickets = bookings
      .filter((booking) => booking.status === "cancelled")
      .reduce((acc, booking) => acc + booking.ticketsCount, 0);

    const totalAmountSpend = bookings.reduce(
      (acc, booking) => acc + booking.totalAmount,
      0
    );

    const totalAmountRecrivedAsRefunded = bookings
      .filter((booking) => booking.status === "cancelled")
      .reduce((acc, booking) => acc + booking.totalAmount, 0);

    const responseObject = {
      totalBookings,
      cancelledBookings,
      totalTickets,
      cancelledTickets,
      totalAmountSpend,
      totalAmountRecrivedAsRefunded,
    };

    return resp.status(200).json({ data: responseObject });
  } catch (error) {
    return resp.status(500).json({ message: error.message });
  }
});
module.exports = router;
