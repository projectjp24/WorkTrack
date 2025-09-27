import { EntityManager } from 'typeorm';
import { CreatePurchaseOrderItemDto } from './dto/create-purchase-order-item.dto';
import { CreatePurchaseOrderDto } from './dto/create-purchase_order.dto';
import { PurchaseOrderEntity } from './entities/purchase_order.entity';
import { PurchaseOrderItemEntity } from './entities/purchase_order_item.entity';
import { VendorEntity } from '../vendor-management/entities/vendor.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdatePurchaseOrderDto } from './dto/update-purchase_order.dto';
import { ToWords } from 'to-words';

@Injectable()
export class PurchaseOrderService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async createPurchaseOrder(
    createPurchaseOrder: CreatePurchaseOrderDto,
    company_id: string,
  ) {
    return await this.entityManager.transaction(async (manager) => {
      let vendor: VendorEntity | null = null;

      if (createPurchaseOrder.vendor?.vendor_detail_id) {
        vendor = await manager.findOne(VendorEntity, {
          where: {
            vendor_detail_id: createPurchaseOrder.vendor.vendor_detail_id,
          },
        });
      }

      if (!vendor && createPurchaseOrder.vendor) {
        vendor = manager.create(VendorEntity, {
          ...createPurchaseOrder.vendor,
          company_id,
        });
        vendor = await manager.save(vendor);
      }

      //Calculate amounts before saving
      const {
        total_tax_amount,
        cgst_amount,
        sgst_amount,
        sub_total,
        total_amount,
        total_amount_in_words,
      } = this.calculateAmounts(
        createPurchaseOrder.items,
        
        createPurchaseOrder.cgst,
        createPurchaseOrder.sgst,
      );

      const purchaseOrder = manager.create(PurchaseOrderEntity, {
        company_id,
        vendor_id: vendor?.vendor_id,
        purchase_order_number: createPurchaseOrder.purchase_order_number,
        order_date: createPurchaseOrder.order_date,
        expected_delivery: createPurchaseOrder.expected_delivery,
        shipping_address: createPurchaseOrder.shipping_address,
        billing_address: createPurchaseOrder.billing_address,
        status: createPurchaseOrder.status,
        notes: createPurchaseOrder.notes,
        created_by: createPurchaseOrder.created_by,
        updated_by: createPurchaseOrder.updated_by,
        sub_total,
        cgst: createPurchaseOrder.cgst,
        sgst: createPurchaseOrder.sgst,
        cgst_amount,
        sgst_amount,
        total_tax_amount,
        total_amount,
        total_amount_in_words,
        is_active: true,
      });
      const savedPurchaseOrder = await manager.save(purchaseOrder);

      if (createPurchaseOrder.items?.length) {
        const items = createPurchaseOrder.items.map((itemDto) =>
          manager.create(PurchaseOrderItemEntity, {
            company_id,
            purchase_order_id: savedPurchaseOrder.purchase_order_id,
            item_name: itemDto.item_name,
            description: itemDto.description,
            hsn_sac: itemDto.hsn_sac,
            quantity: itemDto.quantity,
            unit: itemDto.unit,
            unit_price: itemDto.unit_price,
            amount: itemDto.quantity * itemDto.unit_price,
          }),
        );
        await manager.save(items);
        console.log('item created', items);
      }

      return await manager.findOne(PurchaseOrderEntity, {
        where: { purchase_order_id: savedPurchaseOrder.purchase_order_id },
        relations: ['vendor', 'items'],
      })!;
    });
  }

  private calculateAmounts(
    items: (CreatePurchaseOrderItemDto | PurchaseOrderItemEntity)[],
    cgstPercent: number,
    sgstPercent: number,
  ): {
    sub_total: number;
    cgst_amount: number;
    sgst_amount: number;
    total_tax_amount: number;
    total_amount: number;
    total_amount_in_words: string;
  } {
    const toWords = new ToWords({
      localeCode: 'en-IN', // Indian Rupees format
      converterOptions: {
        currency: true,
        ignoreDecimal: false,
        ignoreZeroCurrency: false,
        doNotAddOnly: false,
      },
    });

    // Calculate sub total by summing item amounts
    const sub_total = items.reduce((sum, item) => {
      const amount = item.unit_price * item.quantity;
      return sum + amount;
    }, 0);

    // Calculate tax amounts
    const cgst_amount = (sub_total * cgstPercent) / 100;
    const sgst_amount = (sub_total * sgstPercent) / 100;

    //Total Tax Amount
    const total_tax_amount = cgst_amount + sgst_amount;

    // Total amount is sum of sub total and taxes
    const total_amount = sub_total + total_tax_amount;

    //convert total amount in words
    const total_amount_in_words = toWords.convert(total_amount, {
      currency: true,
    });

    return {
      cgst_amount,
      sgst_amount,
      total_tax_amount,
      sub_total,
      total_amount,
      total_amount_in_words,
    };
  }

  async findAll(company_id: string) {
    return await this.entityManager.find(PurchaseOrderEntity, {
      where: { company_id, is_deleted: false },
      relations: ['vendor', 'items', 'company'],
    });
  }

  async updatePurchaseOrder(
    purchase_order_id: string,
    updatePurchaseOrderDto: Partial<UpdatePurchaseOrderDto>,
    company_id: string,
  ) {
    return await this.entityManager.transaction(async (manager) => {
      // Find existing purchase order
      const purchaseOrder = await manager.findOne(PurchaseOrderEntity, {
        where: { purchase_order_id },
        relations: ['vendor', 'items'],
      });

      if (!purchaseOrder)
        throw new NotFoundException('Purchase Order Not found');

      // ------------------------
      // Handle vendor update
      // ------------------------
      if (updatePurchaseOrderDto.vendor?.vendor_detail_id) {
        const vendor = await manager.findOne(VendorEntity, {
          where: {
            vendor_detail_id: updatePurchaseOrderDto.vendor.vendor_detail_id,
          },
        });
        if (!vendor) throw new NotFoundException('Vendor not found!');

        if (updatePurchaseOrderDto.vendor.name)
          vendor.name = updatePurchaseOrderDto.vendor.name;
        if (updatePurchaseOrderDto.vendor.address)
          vendor.address = updatePurchaseOrderDto.vendor.address;
        if (updatePurchaseOrderDto.vendor.email)
          vendor.email = updatePurchaseOrderDto.vendor.email;

        await manager.save(vendor);
        purchaseOrder.vendor_id = vendor.vendor_id; // link updated vendor
      }

      // ------------------------
      // Handle items update
      // ------------------------
      if (updatePurchaseOrderDto.items) {
        await manager.delete(PurchaseOrderItemEntity, {
          purchase_order_id: purchaseOrder.purchase_order_id,
        });

        const newItems = updatePurchaseOrderDto.items.map((item) =>
          manager.create(PurchaseOrderItemEntity, {
            company_id,
            purchase_order_id: purchaseOrder.purchase_order_id,
            item_name: item.item_name,
            description: item.description,
            hsn_sac: item.hsn_sac,
            quantity: item.quantity,
            unit: item.unit,
            unit_price: item.unit_price,
            amount: item.quantity * item.unit_price,
          }),
        );

        await manager.save(newItems);
        purchaseOrder.items = newItems;
      }

      // ------------------------
      // Apply direct fields from DTO (exclude vendor/items)
      // ------------------------
      if (updatePurchaseOrderDto.purchase_order_number !== undefined)
        purchaseOrder.purchase_order_number =
          updatePurchaseOrderDto.purchase_order_number;

      if (updatePurchaseOrderDto.order_date !== undefined)
        purchaseOrder.order_date = updatePurchaseOrderDto.order_date
          ? new Date(updatePurchaseOrderDto.order_date)
          : purchaseOrder.order_date;

      if (updatePurchaseOrderDto.expected_delivery !== undefined)
        purchaseOrder.expected_delivery =
          updatePurchaseOrderDto.expected_delivery
            ? new Date(updatePurchaseOrderDto.expected_delivery)
            : purchaseOrder.expected_delivery;
      
      if (updatePurchaseOrderDto.shipping_address !== undefined)
        purchaseOrder.shipping_address = updatePurchaseOrderDto.shipping_address;

      if (updatePurchaseOrderDto.billing_address !== undefined)
        purchaseOrder.billing_address = updatePurchaseOrderDto.billing_address;

      if (updatePurchaseOrderDto.status !== undefined)
        purchaseOrder.status = updatePurchaseOrderDto.status;

      if (updatePurchaseOrderDto.notes !== undefined)
        purchaseOrder.notes = updatePurchaseOrderDto.notes;

      if (updatePurchaseOrderDto.updated_by !== undefined)
        purchaseOrder.updated_by = updatePurchaseOrderDto.updated_by;

      // ------------------------
      // Recalculate totals if needed
      // ------------------------
      if (
        updatePurchaseOrderDto.items ||
        updatePurchaseOrderDto.cgst !== undefined ||
        updatePurchaseOrderDto.sgst !== undefined
      ) {
        const items = updatePurchaseOrderDto.items ?? purchaseOrder.items;
        const cgst = updatePurchaseOrderDto.cgst ?? purchaseOrder.cgst;
        const sgst = updatePurchaseOrderDto.sgst ?? purchaseOrder.sgst;

        const {
          sub_total,
          cgst_amount,
          sgst_amount,
          total_tax_amount,
          total_amount,
          total_amount_in_words,
        } = this.calculateAmounts(items, cgst, sgst);

        Object.assign(purchaseOrder, {
          sub_total,
          cgst,
          sgst,
          cgst_amount,
          sgst_amount,
          total_tax_amount,
          total_amount,
          total_amount_in_words,
        });
      }

      // Save purchase order
      await manager.save(purchaseOrder);

      // Return updated purchase order with relations
      return await manager.findOne(PurchaseOrderEntity, {
        where: { purchase_order_id: purchaseOrder.purchase_order_id },
        relations: ['vendor', 'items'],
      });
    });
  }

  async softDelete(purchase_order_id: string, company_id: string) {
    const purchaseOrder = await this.entityManager.findOne(
      PurchaseOrderEntity,
      {
        where: { purchase_order_id, company_id },
      },
    );

    if (!purchaseOrder) throw new NotFoundException('purchase order not found');

    await this.entityManager.update(
      PurchaseOrderEntity,
      { purchase_order_id },
      {
        is_active: false,
        is_deleted: true,
      },
    );

    return { message: 'Purchase order deleted successfully' };
  }

  async findOne(purchase_order_id: string, company_id: string) {
    const purchaseOrder = await this.entityManager.findOne(
      PurchaseOrderEntity,
      {
        where: { purchase_order_id, company_id, is_deleted: false },
        relations: ['company', 'vendor', 'items'],
        select: {
          purchase_order_id: true,
          purchase_order_number: true,
          order_date: true,
          status: true,
          shipping_address: true,
          billing_address: true,
          sub_total: true,
          total_amount: true,
          sgst_amount: true,
          cgst_amount: true,
          sgst: true,
          cgst: true,
          total_amount_in_words: true,
          company: {
            logo_url: true,
            company_name: true,
            company_address: true,
            company_phone: true,
            company_email: true,
            gst_number: true,
            pan_number: true,
          },
          vendor: {
            vendor_detail_id: true,
            name: true,
            address: true,
            email: true,
            state_code: true,
            gstin: true,
          },
          items: {
            item_name: true,
            description: true,
            hsn_sac: true,
            quantity: true,
            unit: true,
            unit_price: true,
            amount: true,
          },
        },
      },
    );

    if (!purchaseOrder) {
      throw new NotFoundException(
        'purchase order not found or might be deleted',
      );
    }

    return purchaseOrder;
  }
}
