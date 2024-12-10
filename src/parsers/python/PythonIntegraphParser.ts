import Python from 'tree-sitter-python';
import IntegraphParser from '../IntegraphParser';
import PythonSanitizer from './lib/PythonSanitizer';
import PythonNodeHandler from './lib/PythonNodeHandler';

/**
 * @integraph
 * service: Python Parser
 * group: Parsers
 * icon: logos:python
 * integrations:
 *   - service: tree-sitter
 *     edgeDirection: LB
 *     icon: logos:treehouse-icon
 */
export default class PythonIntegraphParser extends IntegraphParser {
    constructor() {
        super(Python, new PythonSanitizer(), new PythonNodeHandler())
    }  
}
