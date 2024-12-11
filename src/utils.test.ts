import {describe, expect, test} from '@jest/globals';
import { Options, scanIntegrations } from './utils';

describe('utils', () => {
    test('Scan Integrations including .ts and .java files', async () => {
        const options: Options = { directory: 'src/diagrams/__tests__/fixtures' };
        const integrations = await scanIntegrations(options);
        expect(integrations).toStrictEqual([
            expect.objectContaining({
                startPosition: {
                    column: 4,
                    row: 1,
                },
                endPosition: {
                    column: 7,
                    row: 8,
                },
                yaml: {
                    group: 'External APIs',
                    integrations: [
                        {
                            edgeDirection: 'RL',
                            service: 'Bank API',
                        },
                    ],
                    service: 'Payment gateway',
                },
                path: 'diagrams/__tests__/fixtures/example_01.java',
                sourceCode: 'public class PaymentGateway {\n' +
                '    /**\n' +
                '     * @integraph\n' +
                '     * service: Payment gateway\n' +
                '     * group: External APIs\n' +
                '     * integrations:\n' +
                '     *   - service: Bank API\n' +
                '     *     edgeDirection: RL\n' +
                '     */\n' +
                '    public boolean postTransaction() {\n' +
                '        // ...\n' +
                '    }\n' +
                '}'
            }),
            expect.objectContaining({
                startPosition: {
                    column: 4,
                    row: 1,
                },
                endPosition: {
                    column: 7,
                    row: 8,
                },
                yaml: {
                    integrations: [
                        {
                            edgeDirection: 'RL',
                            group: 'External APIs',
                            service: 'Payment gateway',
                        },
                    ],
                    service: 'e-commerce',
                },
                path: 'diagrams/__tests__/fixtures/example_01.ts',
                sourceCode: 'class ECommerce {\n' +
                '    /**\n' +
                '     * @integraph\n' +
                '     * service: e-commerce\n' +
                '     * integrations:\n' +
                '     *   - service: Payment gateway\n' +
                '     *     edgeDirection: RL\n' +
                '     *     group: External APIs\n' +
                '     */\n' +
                '    processsPayment() {\n' +
                '        // ...\n' +
                '    }\n' +
                '}'
            })
          ]);
    });
});
