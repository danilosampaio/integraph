public class PaymentGateway {
    /**
     * @integraph
     * service: Payment gateway
     * group: External APIs
     * integrations:
     *   - service: Bank API
     *     edgeDirection: RL
     */
    public boolean postTransaction() {
        return true;
    }
}