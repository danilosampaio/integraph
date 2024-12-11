import Parser, { SyntaxNode } from 'tree-sitter';
import * as yaml from 'js-yaml';
import { IntegraphYamlBlock, IntegraphBlock } from '../types/types';

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

    parseChildren(children: SyntaxNode[]): IntegraphBlock[]{
        const integraphBlocks: IntegraphBlock[] = [];
        for (let i = 0; i < children.length; i++) {
            const currentNode = children[i];
            const commentText = this.nodeHandler.getIntegraphText(currentNode);
            if (commentText) {
                integraphBlocks.push({
                    startPosition: currentNode.startPosition,
                    endPosition: currentNode.endPosition,
                    text: commentText
                });
            } else {
                if (currentNode.childCount > 0) {
                    integraphBlocks.push(...this.parseChildren(currentNode.children));
                }
            }
        }
        return integraphBlocks;
    }

    private findIntegraphBlocks(tree: Parser.Tree): IntegraphBlock[] {
        const rootNode = tree.rootNode;
        const children = rootNode?.children;
        const integraphBlocks: IntegraphBlock[] = [];

        for (let i = 0; i < children?.length; i++) {
            const currentNode = children[i];
            const commentText = this.nodeHandler.getIntegraphText(currentNode);
            if (commentText) {
                integraphBlocks.push({
                    startPosition: currentNode.startPosition,
                    endPosition: currentNode.endPosition,
                    text: commentText
                });
            }
            if (currentNode.childCount > 0) {
                integraphBlocks.push(...this.parseChildren(currentNode.children));
            }
        }

        return integraphBlocks;
    }

    private processYAMLFromComment(block: IntegraphBlock): IntegraphYamlBlock {
        const yamlContent = this.sanitizer.sanitize(block.text);
        const parsedYaml = yaml.load(yamlContent);
        console.log({ parsedYaml })
        return {
            startPosition: block.startPosition,
            endPosition: block.endPosition,
            yaml: parsedYaml
        };
    }

    public parse (sourceCode: string, verbose: boolean = false): IntegraphYamlBlock[] {
        try {
            const tree = this.parser.parse(sourceCode);
            console.log({ tree });
            const integraphBlocks = this.findIntegraphBlocks(tree);
            console.log({ integraphBlocks })
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
