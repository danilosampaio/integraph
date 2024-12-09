import {describe, expect, test} from '@jest/globals';
import IntegraphRunner from '../../IntegraphRunner';
import TypescriptIntegraphParser from '../../parsers/typescript/TypescriptIntegraphParser';
import { ArchitectureDiagram } from '../../diagrams/architecture';
import { IntegraphYamlBlock } from '../../types/types';

describe('Integraph Runner', () => {
    const typescriptRunner = new IntegraphRunner(new TypescriptIntegraphParser());

    test('typescript fixtures', async () => {
        const pattern = 'src/diagrams/**/fixtures/*.{js,ts}';
        const integrations: IntegraphYamlBlock[] = [];
        for await (const entry of typescriptRunner.scanFiles(pattern)) {
            integrations.push(...entry.integrations);
        }
        const architectureDiagram = new ArchitectureDiagram();
        const diagram = architectureDiagram.drawn(integrations);
        
        expect(diagram).toEqual(`
architecture-beta
        group ecommerce[ECommerce]
        service recommendations(logos:aws-cloudsearch)[Recommendations] in ecommerce
        service catalog(database)[Catalog]
    service marketplace(internet)[Marketplace] in ecommerce
        service customerservice(server)[Customer Service]
        service paymentgateway(logos:paypal)[Payment gateway]
        recommendations:L -- R:catalog
    marketplace:R -- L:customerservice
    marketplace:B -- T:paymentgateway`)
    });
});
