import fs from 'node:fs/promises';
import path from 'path';
import {describe, expect, test} from '@jest/globals';
import TypescriptIntegraphParser from "../TypescriptIntegraphParser";

const loadFixture = (fileName: string) => {
    return fs.readFile(path.join(__dirname, `fixtures/${fileName}`), { encoding: 'utf8' })
}

describe('Typescript parser', () => {
    let parser = new TypescriptIntegraphParser();

    test('example1', async () => {
        const sourceCode = await loadFixture('example1.ts');
        const result = parser.parse(sourceCode);
        expect(result.length).toBe(2);
        expect(result).toEqual([
            {
                service: 'Payment Gateway',
                endpoint: '/api/payment/charge',
                description: 'This function integrates with the payment service.'
            },
            {
                service: 'Email Marketing',
                endpoint: '/api/em',
                version: 2.1,
                description: 'This service integrates email campaigns with the marketing service.'
            }
        ])
    });

    test('example3', async () => {
        const sourceCode = await loadFixture('example3.ts');
        const result = parser.parse(sourceCode);
        expect(result.length).toBe(1);
        expect(result).toEqual([
            {
                application: 'E-Commerce', 
                feature: 'Add to Cart',
                integrations: [{
                    service: 'Customer Service',
                    feature: 'Get customer info',
                    data: 'Customer, Metadata, Promotions'
                }]
            }
        ])
    });
});
