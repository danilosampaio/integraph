import fs from 'node:fs/promises';
import path from 'path';
import {describe, expect, test} from '@jest/globals';
import TypescriptIntegraphParser from '../../parsers/typescript/TypescriptIntegraphParser';
import { ArchitectureDiagram } from '../architecture';

const loadFixture = (fileName: string) => {
    return fs.readFile(path.join(__dirname, `fixtures/${fileName}`), { encoding: 'utf8' })
}

describe('ArchitectureDiagram', () => {
    let parser = new TypescriptIntegraphParser();
    let architectureDiagram = new ArchitectureDiagram();

    test('example1', async () => {
        const sourceCode = await loadFixture('example1.ts');
        const result = parser.parse(sourceCode);
        const diagram = architectureDiagram.drawn(result);
        expect(diagram).toBe(`
architecture-beta
        group ecommerce[E_Commerce]
        service recommendations(logos:aws-cloudsearch)[Recommendations] in ecommerce
    service catalog(database)[Catalog]
        recommendations:L -- R:catalog`);
    });

    test('example3', async () => {
        const sourceCode = await loadFixture('example3.ts');
        const result = parser.parse(sourceCode);
        const diagram = architectureDiagram.drawn(result);
        expect(diagram).toBe(`
architecture-beta
        group ecommerce[E_Commerce]
        service marketplace(internet)[Marketplace] in ecommerce
    service customerservice(server)[Customer Service]
    service paymentgateway(logos:paypal)[Payment gateway]
        marketplace:R -- L:customerservice
    marketplace:B -- T:paymentgateway`);
    });
});
