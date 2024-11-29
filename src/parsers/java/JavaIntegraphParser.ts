import Java from 'tree-sitter-java';
import IntegraphParser from '../IntegraphParser';
import JavaSanitizer from './lib/JavaSanitizer';
import JavaNodeHandler from './lib/JavaNodeHandler';

export default class JavaIntegraphParser extends IntegraphParser {
    constructor() {
        super(Java, new JavaSanitizer(), new JavaNodeHandler())
    }  
}
