import fs from 'node:fs/promises';
import path from 'path';
import {describe, expect, test} from '@jest/globals';
import PythonIntegraphParser from "../PythonIntegraphParser";

const loadFixture = (fileName: string) => {
    return fs.readFile(path.join(__dirname, `fixtures/${fileName}`), { encoding: 'utf8' })
}

describe('Python parser', () => {
    let parser = new PythonIntegraphParser();

    test('example1', async () => {
        const sourceCode = await loadFixture('example1.py');
        const result = parser.parse(sourceCode);
        expect(result.length).toBe(2);
        expect(result[0]).toEqual({
            application: 'E-Commerce',
            service: 'Payment Gateway',
            endpoint: '/api/payment/charge',
            description: 'Esta função faz a integração com o serviço de pagamento.'
        })
        expect(result[1]).toEqual({
            service: 'Email Marketing',
            endpoint: '/api/em',
            version: 2.1,
            description: 'This service integrates email campaigns with the marketing service.'
        })
    });
});
