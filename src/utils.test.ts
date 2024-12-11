import {describe, expect, test} from '@jest/globals';
import { Options, scanIntegrations } from './utils';
import { IntegraphYamlBlock } from './types/types';
import { ArchitectureDiagram } from './diagrams/architecture';

describe('utils', () => {
    let integrations: IntegraphYamlBlock[];
    beforeAll(async () => {
        const options: Options = { directory: 'src/diagrams/__tests__/fixtures' };
        integrations = await scanIntegrations(options);
    });
    test('Scan Integrations including .ts and .java files', async () => {
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

    test('generate mermaid diagram from integrations', async () => {
        let architectureDiagram = new ArchitectureDiagram();
        const diagram = architectureDiagram.drawn(integrations);
        expect(diagram).toBe(`
architecture-beta
    group externalapis[External APIs]

    service paymentgateway(server)[Payment gateway] in externalapis
    service bankapi(server)[Bank API]
    service ecommerce(server)[e_commerce]

    paymentgateway:R -[paymentgateway__bankapi]- L:bankapi
    ecommerce:R -[ecommerce__paymentgateway]- L:paymentgateway`);
    });
});
