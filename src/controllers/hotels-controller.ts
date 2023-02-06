import { Response } from "express";
import hotelsService from "@/services/hotels-service";
import httpStatus from "http-status";
import { AuthenticatedRequest } from "@/middlewares";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;

    try {
        const hotels = await hotelsService.getHotels(userId);

        return res.status(httpStatus.OK).send(hotels);
    } catch (error) {
        if(error.name === "Payment Required") return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
        return res.sendStatus(httpStatus.NOT_FOUND);
    }
}

export async function getHotelRooms(req: AuthenticatedRequest, res: Response) {
    const { hotelId } = req.params;
    const { userId } = req;

    if (isNaN(Number(hotelId)) || !hotelId) {
        return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    try {
        const hotelRooms = await hotelsService.getHotelRooms(Number(hotelId), userId);

        return res.status(httpStatus.OK).send(hotelRooms);
    } catch (error) {
        if(error.name === "Payment Required") return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
        return res.sendStatus(httpStatus.NOT_FOUND);
    }
}