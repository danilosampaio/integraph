import * as fg from 'fast-glob';
import fs from 'node:fs/promises';
import path from 'path';
import IntegraphParser from './parsers/IntegraphParser';
import { getGitRepository } from './utils';

export default class IntegraphRunner {
    parser: IntegraphParser

    constructor(parser: IntegraphParser) {
        this.parser = parser;
    }

    loadSourceFile(fileName: string){
        return fs.readFile(fileName, { encoding: 'utf8' })
    }
    
    /**
     * @integraph
     * service: Integraph Runner
     * icon: vscode-icons:file-type-search-result
     * group: Scan files
     * integrations:
     *   - service: Rust Parser
     *     edgeDirection: LR
     *     groupEdge: true
     *     group: Parsers
     *     icon: logos:rust
     *   - service: Yaml parser
     *     edgeDirection: RL
     *     icon: vscode-icons:file-type-yaml
     */
    async * scanFiles(pattern: string, exclude?: string, verbose: boolean = false){
        const ignore = ['**/node_modules/**', 'dist'];
        if (exclude) {
            ignore.push(exclude);
        }
        const stream = await fg.globStream(pattern, { ignore });
        for await (const filePath of stream) {
            const fileName = filePath.toString().split('/').slice(1).join('/');
            const sourceCode = await this.loadSourceFile(filePath.toString());
            const integrations = this.parser.parse(sourceCode, verbose);
            if (integrations.length > 0) {
                const repo = await getGitRepository(path.dirname(filePath.toString()));
                yield { repo, path: fileName, integrations, sourceCode };
            }
        }
    }
}
