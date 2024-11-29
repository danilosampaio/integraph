import * as fg from 'fast-glob';
import fs from 'node:fs/promises';
import IntegraphParser from './parsers/IntegraphParser';

export default class IntegraphRunner {
    parser: IntegraphParser

    constructor(parser: IntegraphParser) {
        this.parser = parser;
    }

    loadFixture(fileName: string){
        return fs.readFile(fileName, { encoding: 'utf8' })
    }
    
    async * scanFiles(pattern: string, verbose: boolean = false){
        const stream = await fg.globStream(pattern, { ignore: ['**/node_modules/**'] });
        for await (const path of stream) {
            const sourceCode = await this.loadFixture(path.toString());
            const integrations = this.parser.parse(sourceCode, verbose);
            yield { path, integrations };
        }
    }
}
