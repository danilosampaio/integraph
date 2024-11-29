import { SyntaxNode } from "tree-sitter";
import { NodeHandler } from "../../IntegraphParser";

export default class PythonNodeHandler implements NodeHandler {
    getIntegraphText(node: SyntaxNode): string {
        if (node.type === 'expression_statement' && (node.text.startsWith('"""') || node.text.startsWith("'''"))) {
            const commentText = node.text;
            if (commentText.includes('@integraph')) {
                return commentText;
            }
        }
        return '';
    }   
}