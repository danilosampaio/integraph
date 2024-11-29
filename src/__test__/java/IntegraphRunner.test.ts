import {describe, expect, test} from '@jest/globals';
import IntegraphRunner from '../../IntegraphRunner';
import JavaIntegraphParser from '../../parsers/java/JavaIntegraphParser';

describe('Integraph Runner', () => {
    const javaRunner = new IntegraphRunner(new JavaIntegraphParser());

    test('java fixtures', async () => {
        const pattern = 'src/**/fixtures/*.java';
        for await (const entry of javaRunner.scanFiles(pattern)) {
            expect(entry.path).toEqual('src/parsers/java/__tests__/fixtures/example1.java');
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
                  description: 'Classe responsável por integrar campanhas de email com o serviço de marketing.'
                }
            ]);
        }
    });
});
