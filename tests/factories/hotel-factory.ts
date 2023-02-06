import { prisma } from "@/config";

export async function createHotel() {
    return prisma.hotel.createMany({
        data: [
            {
                name: "hotel habbo 1",
                image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/13/f6/18/92/belmond-copacabana-palace.jpg?w=700&h=-1&s=1"
            },
            {
                name: "hotel habbo 2",
                image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/13/f6/18/92/belmond-copacabana-palace.jpg?w=700&h=-1&s=1"
            },
            {
                name: "hotel habbo 3",
                image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/13/f6/18/92/belmond-copacabana-palace.jpg?w=700&h=-1&s=1"
            }
        ]
    });
}

export async function createOneHotel() {
    return prisma.hotel.create({
        data: {
            name: "hotel habbo 1",
            image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/13/f6/18/92/belmond-copacabana-palace.jpg?w=700&h=-1&s=1"
        }
    })
}

export async function createHotelRooms(hotelId: number) {
    return prisma.room.create({
        data: {
            name: "room",
            capacity: 4,
            hotelId: hotelId
        }
    })
}