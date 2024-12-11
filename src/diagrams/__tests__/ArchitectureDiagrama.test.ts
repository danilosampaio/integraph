import fs from 'node:fs/promises';
import path from 'path';
import {describe, expect, test} from '@jest/globals';
import TypescriptIntegraphParser from '../../parsers/typescript/TypescriptIntegraphParser';
import JavaIntegraphParser from '../../parsers/java/JavaIntegraphParser';
import { ArchitectureDiagram } from '../architecture';

const loadFixture = (fileName: string) => {
    return fs.readFile(`src/diagrams/__tests__/fixtures/${fileName}`, { encoding: 'utf8' })
}

describe('ArchitectureDiagram', () => {
    let typescriptParser = new TypescriptIntegraphParser();
    let javaParser = new JavaIntegraphParser();
    let architectureDiagram = new ArchitectureDiagram();

    test('Typescript - example_01', async () => {
        const sourceCode = await loadFixture('example_01.ts');
        const result = typescriptParser.parse(sourceCode);
        const diagram = architectureDiagram.drawn(result);
        expect(diagram).toBe(`
architecture-beta
    group externalapis[External APIs]

    service ecommerce(server)[e_commerce]
    service paymentgateway(server)[Payment gateway] in externalapis

    ecommerce:R -[ecommerce__paymentgateway]- L:paymentgateway`);
    });

    test('Java - example_01', async () => {
        const sourceCode = await loadFixture('example_01.java');
        const result = javaParser.parse(sourceCode);
        const diagram = architectureDiagram.drawn(result);
        expect(diagram).toBe(`
architecture-beta
    group externalapis[External APIs]

    service paymentgateway(server)[Payment gateway] in externalapis
    service bankapi(server)[Bank API]

    paymentgateway:R -[paymentgateway__bankapi]- L:bankapi`);
    });
});
