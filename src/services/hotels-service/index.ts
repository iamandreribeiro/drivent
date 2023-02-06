import { notFoundError, paymentRequiredError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelRepository from "@/repositories/hotel-repository";
import ticketRepository from "@/repositories/ticket-repository";

export async function getHotels(userId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if(!enrollment) {
        return 404;
    }
    
    const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
    if(!ticket) {
        return 404;
    }

    const ticketType = await ticketRepository.findTicketTypeId(ticket.ticketTypeId);
    if(ticket.status === 'RESERVED' || ticketType.isRemote || !ticketType.includesHotel) {
        return 402;
    }

    const hotels = await hotelRepository.findHotels();
    if(!hotels) {
        return 404;
    }

    return hotels;
}

export async function getHotelRooms(hotelId: number, userId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if(!enrollment) {
        return 404;
    }
    
    const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
    if(!ticket) {
        return 404;
    }

    const ticketType = await ticketRepository.findTicketTypeId(ticket.ticketTypeId);
    if(ticket.status === 'RESERVED' || ticketType.isRemote || !ticketType.includesHotel) {
        return 402;
    }

    const hotelRooms = await hotelRepository.findHotelRooms(hotelId);
    if (!hotelRooms) {
        throw notFoundError;
    }

    return hotelRooms;
}

const hotelsService = {
    getHotels,
    getHotelRooms
}

export default hotelsService;