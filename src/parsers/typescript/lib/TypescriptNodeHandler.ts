import { SyntaxNode } from "tree-sitter";
import { NodeHandler } from "../../IntegraphParser";

export default class TypescriptNodeHandler implements NodeHandler {
    getIntegraphText(node: SyntaxNode): string {
        if (node.type === 'comment') {
            const commentText = node.text;
            if (commentText.includes('@integraph')) {
                return commentText;
            }
        }
        return '';
    }   
}