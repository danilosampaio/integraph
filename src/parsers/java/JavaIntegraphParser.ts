import Java from 'tree-sitter-java';
import IntegraphParser from '../IntegraphParser';
import JavaSanitizer from './lib/JavaSanitizer';
import JavaNodeHandler from './lib/JavaNodeHandler';

/**
 * @integraph
 * service: Java Parser
 * group: Parsers
 * integrations:
 *   - service: tree-sitter
 *     edgeDirection: RB
 *     icon: logos:treehouse-icon
 */
export default class JavaIntegraphParser extends IntegraphParser {
    constructor() {
        super(Java, new JavaSanitizer(), new JavaNodeHandler())
    }  
}
