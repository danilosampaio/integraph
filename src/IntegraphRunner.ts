import * as fg from 'fast-glob';
import fs from 'node:fs/promises';
import path from 'path';
import IntegraphParser from './parsers/IntegraphParser';
import { getGitRepository } from './utils';
import TypescriptIntegraphParser from './parsers/typescript/TypescriptIntegraphParser';
import JavaIntegraphParser from './parsers/java/JavaIntegraphParser';
import PythonIntegraphParser from './parsers/python/PythonIntegraphParser';
import RustIntegraphParser from './parsers/rust/RustIntegraphParser';

export default class IntegraphRunner {
    runners: { parser: IntegraphParser, pattern: RegExp }[];

    constructor() {
        const typescriptParser = new TypescriptIntegraphParser();
        const typescriptPattern = new RegExp('^.*\.(js|ts)$');
        const javaParser = new JavaIntegraphParser();
        const javaPattern = new RegExp('^.*\.(java)$');
        const pythonParser = new PythonIntegraphParser();
        const pythonPattern = new RegExp('^.*\.(py)$');
        const rustParser = new RustIntegraphParser();
        const rustPattern = new RegExp('^.*\.(rs)$');
        this.runners = [
            {
                parser: typescriptParser,
                pattern: typescriptPattern
            },
            {
                parser: javaParser,
                pattern: javaPattern
            },
            {
                parser: pythonParser,
                pattern: pythonPattern
            },
            {
                parser: rustParser,
                pattern: rustPattern
            }
        ];
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
            const integrations = this.getRunnerByPattern(filePath.toString()).parse(sourceCode, verbose);
            if (integrations.length > 0) {
                const repo = await getGitRepository(path.dirname(filePath.toString()));
                yield { repo, path: fileName, integrations, sourceCode };
            }
        }
    }

    getRunnerByPattern = (fileName: string) => {
        const runConfig = this.runners.find(r => r.pattern.test(fileName));
        if (!runConfig) {
            throw new Error(`No parser found for this file type ${fileName}`);
        }

        return runConfig.parser;
    }
}
