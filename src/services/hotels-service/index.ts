import { notFoundError } from "@/errors";
import hotelRepository from "@/repositories/hotel-repository";

export async function getHotels() {
    const hotels = await hotelRepository.findHotels();

    if(!hotels) {
        throw notFoundError;
    }

    return hotels;
}

export async function getHotelRooms(hotelId: number) {
    const hotelRooms = await hotelRepository.findHotelRooms(hotelId);

    if(!hotelRooms) {
        throw notFoundError;
    }

    return hotelRooms;
}

const hotelsService = {
    getHotels,
    getHotelRooms
}

export default hotelsService;