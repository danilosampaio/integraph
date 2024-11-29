import {describe, expect, test} from '@jest/globals';
import IntegraphRunner from '../../IntegraphRunner';
import RustIntegraphParser from '../../parsers/rust/RustIntegraphParser';

describe('Integraph Runner', () => {
    const rustRunner = new IntegraphRunner(new RustIntegraphParser());

    test('rust fixtures', async () => {
        const pattern = 'src/**/fixtures/*.rs';
        for await (const entry of rustRunner.scanFiles(pattern)) {
            expect(entry.path).toEqual('src/parsers/rust/__tests__/fixtures/example1.rs');
            expect(entry.integrations).toEqual([
                {
                  application: 'E-Commerce',
                  service: 'Payment Gateway',
                  endpoint: '/api/payment/charge',
                  description: 'Esta função faz a integração com o serviço de pagamento.'
                },
                {
                  application: 'CRM',
                  service: 'Email Marketing',
                  version: 2.1,
                  description: 'Estrutura responsável por integrar campanhas de email com o serviço de marketing.'
                }
            ]);
        }
    });
});
