
import { Injectable, Logger } from '@nestjs/common';
import ical, { ICalCalendarMethod } from 'ical-generator';
import * as nodeIcal from 'node-ical';
import { OperationsService } from '../operations/operations.service';

@Injectable()
export class IcalService {
  private readonly logger = new Logger(IcalService.name);

  constructor(private readonly opsService: OperationsService) {}

  async generateFeed(entityId: string): Promise<string> {
    const bookings = await this.opsService.getBookings();
    // Filter bookings for this entity
    const relevantBookings = bookings.filter(b => b.apartmentId === entityId || b.restaurantId === entityId);

    const calendar = ical({
      name: `We Do Calendar - ${entityId}`,
      method: ICalCalendarMethod.PUBLISH
    });

    relevantBookings.forEach(booking => {
      calendar.createEvent({
        start: booking.checkIn,
        end: booking.checkOut,
        summary: booking.status === 'Blocked' ? 'Blocked' : 'Reserved',
        description: `Booking ID: ${booking.id}`,
        location: booking.apartmentId || booking.restaurantId
      });
    });

    return calendar.toString();
  }

  async parseExternalFeed(url: string) {
    try {
        const events = await nodeIcal.async.fromURL(url);
        // Transform logic would go here to save 'External' bookings
        this.logger.log(`Parsed ${Object.keys(events).length} events from ${url}`);
        return { success: true, count: Object.keys(events).length };
    } catch (error) {
        this.logger.error(`Failed to parse iCal feed: ${url}`, error);
        throw error;
    }
  }
}
