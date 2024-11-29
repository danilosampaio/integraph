export interface ICustomer {
    name: string;
    tier: string;
}

export default class RecommendationService {
    /**
     * @integraph
     * application: Recommendations
     * group: E-Commerce
     * icon: logos:aws-cloudsearch
     * integrations:
     *   - database: Catalog
     *     data: Product, Rate
     *     edgeDirection: RL
     *     icon: database
     */
    top10(customer: ICustomer) {
        // Implementation ...
    }
}
