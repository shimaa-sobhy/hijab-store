export const PRODUCT_IMAGES_BUCKET = 'product-images';

export const ORDER_CONFIG = {
  displayLabels: {
    new: 'New',
    pending: 'Processing',
    confirmed: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  },
  badgeMap: {
    new: 'ds-badge--secondary',
    pending: 'ds-badge--info',
    confirmed: 'ds-badge--info',
    shipped: 'ds-badge--primary',
    delivered: 'ds-badge--success',
    cancelled: 'ds-badge--danger',
  },
  workflowSteps: [
    { key: 'new', label: 'New', statuses: ['new'] },
    { key: 'processing', label: 'Processing', statuses: ['pending', 'confirmed'] },
    { key: 'shipped', label: 'Shipped', statuses: ['shipped'] },
    { key: 'delivered', label: 'Delivered', statuses: ['delivered'] },
  ],
  stepIndex: { new: 0, pending: 1, confirmed: 1, shipped: 2, delivered: 3 },
  transitions: {
    new: { confirmed: 'Process Order', cancelled: 'Cancel Order' },
    pending: { confirmed: 'Process Order', cancelled: 'Cancel Order' },
    confirmed: { shipped: 'Mark as Shipped', cancelled: 'Cancel Order' },
    shipped: { delivered: 'Mark as Delivered', cancelled: 'Cancel Order' },
    delivered: {},
    cancelled: {},
  },
};