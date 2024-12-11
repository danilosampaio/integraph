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
    test('Scan Integrations including .ts, .java, and .py files', async () => {
        expect(integrations).toStrictEqual([
            expect.objectContaining({
               "startPosition":{
                  "row":1,
                  "column":4
               },
               "endPosition":{
                  "row":10,
                  "column":7
               },
               "yaml":{
                  "service":"Payment gateway",
                  "group":"External APIs",
                  "integrations":[
                     {
                        "service":"Bank API",
                        "edgeDirection":"RL"
                     },
                     {
                        "service":"Fraud Detection",
                        "group":"AI Agents"
                     }
                  ]
               },
               "path":"diagrams/__tests__/fixtures/example_01.java",
               "sourceCode":"public class PaymentGateway {\n    /**\n     * @integraph\n     * service: Payment gateway\n     * group: External APIs\n     * integrations:\n     *   - service: Bank API\n     *     edgeDirection: RL\n     *   - service: Fraud Detection\n     *     group: AI Agents\n     */\n    public boolean postTransaction() {\n        // ...\n    }\n}"
            }),
            expect.objectContaining({
               "startPosition":{
                  "row":0,
                  "column":0
               },
               "endPosition":{
                  "row":4,
                  "column":3
               },
               "yaml":{
                  "service":"Fraud Detection",
                  "group":"AI Agents"
               },
               "path":"diagrams/__tests__/fixtures/example_01.py",
               "sourceCode":"\"\"\"\n@integraph\nservice: Fraud Detection\ngroup: AI Agents\n\"\"\"\ndef detectFraud():\n    print(\"all good!\")\n"
            }),
            expect.objectContaining({
               "startPosition":{
                  "row":1,
                  "column":4
               },
               "endPosition":{
                  "row":8,
                  "column":7
               },
               "yaml":{
                  "service":"e-commerce",
                  "integrations":[
                     {
                        "service":"Payment gateway",
                        "edgeDirection":"RL",
                        "group":"External APIs"
                     }
                  ]
               },
               "path":"diagrams/__tests__/fixtures/example_01.ts",
               "sourceCode":"class ECommerce {\n    /**\n     * @integraph\n     * service: e-commerce\n     * integrations:\n     *   - service: Payment gateway\n     *     edgeDirection: RL\n     *     group: External APIs\n     */\n    processsPayment() {\n        // ...\n    }\n}"
            })
         ]);
    });

    test('generate mermaid diagram from integrations', async () => {
        let architectureDiagram = new ArchitectureDiagram();
        const diagram = architectureDiagram.drawn(integrations);
        expect(diagram).toBe(`
architecture-beta
    group externalapis[External APIs]
    group aiagents[AI Agents]

    service paymentgateway(server)[Payment gateway] in externalapis
    service bankapi(server)[Bank API]
    service frauddetection(server)[Fraud Detection] in aiagents
    service ecommerce(server)[e_commerce]

    paymentgateway:R -[paymentgateway__bankapi]- L:bankapi
    paymentgateway:R -[paymentgateway__frauddetection]- L:frauddetection
    ecommerce:R -[ecommerce__paymentgateway]- L:paymentgateway`);
    });
});
