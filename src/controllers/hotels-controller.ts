import { Response } from "express";
import hotelsService from "@/services/hotels-service";
import httpStatus from "http-status";
import { AuthenticatedRequest } from "@/middlewares";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
    try {
        const hotels = await hotelsService.getHotels();

        return res.status(httpStatus.OK).send(hotels);
    } catch (error) {
        return res.sendStatus(httpStatus.NO_CONTENT);
    }
}

export async function getHotelRooms(req: AuthenticatedRequest, res: Response) {
    const { hotelId } = req.params;

    if(isNaN(Number(hotelId))) {
        return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    try {
        const hotelRooms = await hotelsService.getHotelRooms(Number(hotelId));

        return res.status(httpStatus.OK).send(hotelRooms);
    } catch (error) {
        return res.sendStatus(httpStatus.NO_CONTENT);
    }
}