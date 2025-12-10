
import { Controller, Get, Post, Body, Param, Patch, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { InventoryItem } from './inventory.entity';

@Controller('inventory')
@UseGuards(AuthGuard('jwt'))
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  getAll() {
    return this.inventoryService.findAll();
  }

  @Post()
  create(@Body() item: Partial<InventoryItem>) {
    return this.inventoryService.create(item);
  }

  @Patch(':id')
  updateStock(@Param('id') id: string, @Body('quantity') quantity: number) {
    return this.inventoryService.updateStock(id, quantity);
  }

  @Post('scan')
  @UseInterceptors(FileInterceptor('image'))
  async scanInventory(@UploadedFile() file: any, @Body('knownItems') knownItems: string) {
    const itemsList = knownItems ? knownItems.split(',') : [];
    return this.inventoryService.processImageCount(file.buffer, itemsList);
  }
}
