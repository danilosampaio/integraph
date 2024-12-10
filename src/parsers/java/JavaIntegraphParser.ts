import Java from 'tree-sitter-java';
import IntegraphParser from '../IntegraphParser';
import JavaSanitizer from './lib/JavaSanitizer';
import JavaNodeHandler from './lib/JavaNodeHandler';

/**
 * @integraph
 * service: Java Parser
 * group: Parsers
 * icon: logos:java
 * integrations:
 *   - service: tree-sitter
 *     edgeDirection: LB
 *     icon: logos:treehouse-icon
 */
export default class JavaIntegraphParser extends IntegraphParser {
    constructor() {
        super(Java, new JavaSanitizer(), new JavaNodeHandler())
    }  
}
