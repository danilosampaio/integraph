import {describe, expect, test} from '@jest/globals';
import IntegraphRunner from '../../IntegraphRunner';
import PythonIntegraphParser from '../../parsers/python/PythonIntegraphParser';

describe('Integraph Runner', () => {
    const pythonRunner = new IntegraphRunner(new PythonIntegraphParser());

    test('python fixtures', async () => {
        const pattern = 'src/**/fixtures/*.py';
        for await (const entry of pythonRunner.scanFiles(pattern)) {
            expect(entry.path).toEqual('src/parsers/python/__tests__/fixtures/example1.py');
            expect(entry.integrations).toEqual([
                {
                  application: 'E-Commerce',
                  service: 'Payment Gateway',
                  endpoint: '/api/payment/charge',
                  description: 'Esta função faz a integração com o serviço de pagamento.'
                },
                {
                  service: 'Email Marketing',
                  endpoint: '/api/em',
                  version: 2.1,
                  description: 'This service integrates email campaigns with the marketing service.'
                }
            ]);
        }
    });
});
