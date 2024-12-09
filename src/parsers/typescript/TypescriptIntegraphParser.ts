import TypeScript from 'tree-sitter-typescript';
import IntegraphParser from '../IntegraphParser';
import TypescriptSanitizer from './lib/TypescriptSanitizer';
import TypescriptNodeHandler from './lib/TypescriptNodeHandler';

/**
 * @integraph
 * service: Typescript Parser
 * group: Parsers
 * integrations:
 *   - service: tree-sitter
 *     edgeDirection: LB
 *     icon: logos:treehouse-icon
 */
export default class TypescriptIntegraphParser extends IntegraphParser {
    constructor() {
        super(TypeScript.typescript, new TypescriptSanitizer(), new TypescriptNodeHandler())
    }  
}
