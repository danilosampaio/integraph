import { SyntaxNode } from "tree-sitter";
import { NodeHandler } from "../../IntegraphParser";

export default class RustNodeHandler implements NodeHandler {
    commentLinesText: string[] = [];

    getIntegraphText(node: SyntaxNode): string {
        if (node.type === 'line_comment') {
            if (node.text.includes('@integraph')) {
                this.commentLinesText = [];

                let next = node.nextSibling;
                while (next?.nextSibling?.type === 'line_comment') {
                    this.commentLinesText.push(next.text);
                    next = next.nextSibling;
                }
                if (next?.text) {
                    this.commentLinesText.push(next.text);
                }
                const commentText = this.commentLinesText.join('\n');
                this.commentLinesText = [];
                return commentText;
            }
        }
        return '';
    }   
}