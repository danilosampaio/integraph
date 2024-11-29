export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    status: string;
}

export interface IProduct {
    productID: string;
    customerID: string;
}

export interface ICustomerService {
    getCustomerInfo(customerID: string): IUser;
}

export default class ECommerceService {
    customerService: ICustomerService;

    constructor(customerService: ICustomerService) {
        this.customerService = customerService;
    }
    
    validateCustomer(customerID: string) {
        const customer = this.customerService.getCustomerInfo(customerID);
        if (customer.status !== 'ACTIVE') {
            throw new Error('Customer invalid!');
        } 
    }

    /**
     * @integraph
     * application: Marketplace
     * feature: Add to Cart
     * group: E-Commerce
     * icon: internet
     * integrations:
     *   - service: Customer Service
     *     feature: Get customer info
     *     data: Customer, Metadata, Promotions
     *     edgeDirection: LR
     *     icon: server
     *   - service: Payment gateway
     *     feature: Process payment
     *     data: Customer, Payment
     *     edgeDirection: TB
     *     icon: logos:paypal
     */
    addToCart(product: IProduct) {
        this.validateCustomer(product.customerID);
    }
}
