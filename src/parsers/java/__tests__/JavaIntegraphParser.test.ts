import fs from 'node:fs/promises';
import path from 'path';
import {describe, expect, test} from '@jest/globals';
import JavaIntegraphParser from "../JavaIntegraphParser";

const loadFixture = (fileName: string) => {
    return fs.readFile(path.join(__dirname, `fixtures/${fileName}`), { encoding: 'utf8' })
}

describe('Java parser', () => {
    let parser = new JavaIntegraphParser();

    test('example1', async () => {
        const sourceCode = await loadFixture('example1.java');
        const result = parser.parse(sourceCode);
        expect(result.length).toBe(2);
        expect(result[0]).toEqual({
            application: 'E-Commerce',
            service: 'Payment Gateway',
            endpoint: '/api/payment/charge',
            description: 'Esta função faz a integração com o serviço de pagamento.'
        })
        expect(result[1]).toEqual({
            application: 'CRM',
            service: 'Email Marketing',
            version: 2.1,
            description: 'Classe responsável por integrar campanhas de email com o serviço de marketing.'
        })
    });
});
