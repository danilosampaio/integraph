import { SyntaxNode } from "tree-sitter";
import { NodeHandler } from "../../IntegraphParser";

export default class JavaNodeHandler implements NodeHandler {
    getIntegraphText(node: SyntaxNode): string {
        if (node.type === 'block_comment') {
            const commentText = node.text;
            if (commentText.includes('@integraph')) {
                return commentText;
            }
        }
        return '';
    }   
}