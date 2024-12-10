import Rust from 'tree-sitter-rust';
import IntegraphParser from '../IntegraphParser';
import RustSanitizer from './lib/RustSanitizer';
import RustNodeHandler from './lib/RustNodeHandler';

/**
 * @integraph
 * service: Rust Parser
 * group: Parsers
 * icon: logos:rust
 * integrations:
 *   - service: tree-sitter
 *     edgeDirection: LB
 *     icon: logos:treehouse-icon
 */
export default class RustIntegraphParser extends IntegraphParser {
    constructor() {
        super(Rust, new RustSanitizer(), new RustNodeHandler())
    }  
}
