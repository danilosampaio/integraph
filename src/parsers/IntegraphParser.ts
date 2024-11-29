import Parser, { SyntaxNode } from 'tree-sitter';
import * as yaml from 'js-yaml';
import { Integraph } from '../types/types';

export interface Sanitizer {
    sanitize(comment: string): string;
}

export interface NodeHandler {
    getIntegraphText(node: Parser.SyntaxNode): string;
}

export default class IntegraphParser {
    language: any;
    parser: Parser;
    sanitizer: Sanitizer;
    nodeHandler: NodeHandler;

    constructor(language: any, sanitizer: Sanitizer, nodeHandler: NodeHandler) {
        this.language = language;
        this.parser = new Parser();
        this.parser.setLanguage(language);
        this.sanitizer = sanitizer;
        this.nodeHandler = nodeHandler;
    }

    parseChildren(children: SyntaxNode[]){
        const integraphBlocks: string[] = [];
        for (let i = 0; i < children.length; i++) {
            const currentNode = children[i];
            const commentText = this.nodeHandler.getIntegraphText(currentNode);
            if (commentText) {
                integraphBlocks.push(commentText);
            } else {
                if (currentNode.childCount > 0) {
                    integraphBlocks.push(...this.parseChildren(currentNode.children));
                }
            }
        }
        return integraphBlocks;
    }

    private findIntegraphBlocks(tree: Parser.Tree) {
        const rootNode = tree.rootNode;
        const children = rootNode.children;
        const integraphBlocks: string[] = [];

        for (let i = 0; i < children.length; i++) {
            const currentNode = children[i];
            const commentText = this.nodeHandler.getIntegraphText(currentNode);
            if (commentText) {
                integraphBlocks.push(commentText);
            }
            if (currentNode.childCount > 0) {
                integraphBlocks.push(...this.parseChildren(currentNode.children));
            }
        }

        return integraphBlocks;
    }

    private processYAMLFromComment(comment: string): any {
        const yamlContent = this.sanitizer.sanitize(comment);
        const data = yaml.load(yamlContent);
        return data;
    }

    public parse (sourceCode: string, verbose: boolean = false): Integraph[] {
        try {
            const tree = this.parser.parse(sourceCode);
            const integraphBlocks = this.findIntegraphBlocks(tree);
            const result = integraphBlocks.map((comment) => this.processYAMLFromComment(comment));
            return result;
        } catch (e) {
            if (verbose) {
                console.log(e);
            }
        }
        return [];
    }
}
