import Rust from 'tree-sitter-rust';
import IntegraphParser from '../IntegraphParser';
import RustSanitizer from './lib/RustSanitizer';
import RustNodeHandler from './lib/RustNodeHandler';

export default class RustIntegraphParser extends IntegraphParser {
    constructor() {
        super(Rust, new RustSanitizer(), new RustNodeHandler())
    }  
}
