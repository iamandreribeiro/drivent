import { prisma } from "@prisma/client";

async function findHotels() {}

async function findHotelRooms() {}

const hotelRepository = {
    findHotels,
    findHotelRooms
}

export default hotelRepository;