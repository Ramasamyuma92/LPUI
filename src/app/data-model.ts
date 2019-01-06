
export class Address {
  itemCode = '';
  itemId = 0;
  name = '';
  description = '';
  itemImage = '';
  weight = 0;
  price = 0;
}

export class Orders {
  orderId = 0;
  clientId = 0;
  clientName = '';
  deliveryType = '';
  deliveryTypeId = 0;
  orderPrice = 0;
  shipmentCost = 0;
  shipmentDate = '';
  deliveryDate = '';
  trackingNumber = 0;
  orderStatus = '';
  orderStatusId = 0;
  adminDiscount=0;
  Shipping: ShippingCost[];
  Items: OrderList[];
}

export class ShippingCost {
  orderItemId=0;
  firstName = '';
  lastName = '';
  address1 = '';
  address2 = '';
  deliveryDate = '';

}

export class OrderList {
  orderItemId = 0;
  orderId = 0;
  itemId = 0;
  itemName = '';
  itemImage = '';
  quantity = 0;
  message = '';
  itemPrice = 0;
  orderItemPrice=0;
  orderItemStatus = 0;
  requestedDeliveryDate = '';
  orderDiscountedItemPrice=0;
  discount=0;
  senderName = '';
  orderRecipients: orderItemRecipients[];

}

export class OrderRecipients {
  recipientId = 0;
  clientId = 0;
  firstName = '';
  lastName = '';
  address1 = '';
  address2 = '';
  city = '';
  state = '';
  zip = 0;
  country = '';
  email = '';
  phone1 = '';
  phone2 = '';
  dateOfBirth = 0;
  dateOfJoining = 0;
  status = 0;
  deliveryDate = "";
}

export class orderItemRecipients{
  orderItemId=0;
  quantity=0;
  recipientId = 0;
  orderRecipientId=0;
  clientId = 0;
  firstName = '';
  lastName = '';
  address1 = '';
  address2 = '';
  city = '';
  state = '';
  zip = 0;
  email = '';
  phone1 = '';
  phone2 = '';
  dateOfBirth = 0;
  dateOfJoining = 0;
  status = 0;
  checkStatus = '';
}