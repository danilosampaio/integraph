import Python from 'tree-sitter-python';
import IntegraphParser from '../IntegraphParser';
import PythonSanitizer from './lib/PythonSanitizer';
import PythonNodeHandler from './lib/PythonNodeHandler';

export default class PythonIntegraphParser extends IntegraphParser {
    constructor() {
        super(Python, new PythonSanitizer(), new PythonNodeHandler())
    }  
}
