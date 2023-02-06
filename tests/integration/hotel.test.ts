import app, { init } from "@/app";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import { createEnrollmentWithAddress, createHotel, createHotelRooms, createOneHotel, createTicket, createTicketType, createTicketTypeError, createTicketTypeSucess, createUser } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";
import { TicketStatus } from "@prisma/client";

beforeAll(async () => {
    await init();
    await cleanDb();
});

const server = supertest(app);

describe('GET /hotels', () => {
    it('Should respond with 401 with no token is given', async () => {
        const response = await server.get("/hotels");

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('Should respond with 401 if the token is invalid', async () => {
        const response = await server.get("/hotels").set("Authorization", "Bearer XXX");

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('Should respond with 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('When token is valid', () => {
        it('Should respond with 404 if there isnt enrollment for given token', async () => {
            const token = await generateValidToken();

            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.NOT_FOUND);
        });

        it('Should respond with 404 if there isnt ticket for given enrollment', async () => {
            const user = await createUser();
            const enrollment = await createEnrollmentWithAddress(user);
            const token = await generateValidToken(user);

            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.NOT_FOUND);
        });

        it('Should respond with 402 if the ticket is unpaid', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
        });

        it('Should respond with 402 if the ticket is remote only or not includes hotel', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeError();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
        });

        it('Should respond with 200 and an array with all hotels', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeSucess();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel();

            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.OK);
            expect(response.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        id: expect.any(Number),
                        name: expect.any(String),
                        image: expect.any(String)
                    })
                ])
            );
        });
    });
});

describe('GET hotels/:id', () => {
    it('Should respond with 401 with no token is given', async () => {
        const response = await server.get("/hotels/:id");

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('Should respond with 401 if the token is invalid', async () => {
        const response = await server.get("/hotels/:id").set("Authorization", "Bearer XXX");

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('Should respond with 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get("/hotels/:id").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('When token is valid', () => {
        it('Should respond with 400 with no hotel id is given', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeSucess();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createOneHotel();

            const response = await server.get(`/hotels/:id`).set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });

        it('Should respond with 404 if there isnt enrollment for given token', async () => {
            const token = await generateValidToken();
            const hotel = await createOneHotel();

            const response = await server.get(`/hotels/${hotel.id}`).set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.NOT_FOUND);
        });

        it('Should respond with 404 if there isnt ticket for given enrollment', async () => {
            const user = await createUser();
            const enrollment = await createEnrollmentWithAddress(user);
            const token = await generateValidToken(user);
            const hotel = await createOneHotel();

            const response = await server.get(`/hotels/${hotel.id}`).set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.NOT_FOUND);
        });

        it('Should respond with 402 if the ticket is unpaid', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
            const hotel = await createOneHotel();

            const response = await server.get(`/hotels/${hotel.id}`).set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(402);
        });

        it('Should respond with 402 if the ticket is remote only or not includes hotel', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeError();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createOneHotel();

            const response = await server.get(`/hotels/${hotel.id}`).set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(402);
        });

        it('Should respond with 200 and an array with the hotels information and rooms', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeSucess();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createOneHotel();
            const hotelRooms = await createHotelRooms(hotel.id);

            const response = await server.get(`/hotels/${hotel.id}`).set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(httpStatus.OK);
            expect(response.body).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    image: expect.any(String),
                    Rooms: expect.arrayContaining([
                        expect.objectContaining({
                            id: expect.any(Number),
                            name: expect.any(String),
                            capacity: expect.any(Number),
                            hotelId: expect.any(Number)
                        })
                    ])
                })
            );
        })
    })
});