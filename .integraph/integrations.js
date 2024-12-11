function getIntegrations () { return [{"startPosition":{"row":17,"column":4},"endPosition":{"row":31,"column":7},"yaml":{"service":"Integraph Runner","icon":"vscode-icons:file-type-search-result","group":"Scan files","integrations":[{"service":"Rust Parser","edgeDirection":"LR","groupEdge":true,"group":"Parsers","icon":"logos:rust"},{"service":"Yaml parser","edgeDirection":"RL","icon":"vscode-icons:file-type-yaml"}]},"path":"IntegraphRunner.ts","repo":"https://github.com/danilosampaio/integraph/blob/main","sourceCode":"import * as fg from 'fast-glob';\nimport fs from 'node:fs/promises';\nimport path from 'path';\nimport IntegraphParser from './parsers/IntegraphParser';\nimport { getGitRepository } from './utils';\n\nexport default class IntegraphRunner {\n    parser: IntegraphParser\n\n    constructor(parser: IntegraphParser) {\n        this.parser = parser;\n    }\n\n    loadSourceFile(fileName: string){\n        return fs.readFile(fileName, { encoding: 'utf8' })\n    }\n    \n    /**\n     * @integraph\n     * service: Integraph Runner\n     * icon: vscode-icons:file-type-search-result\n     * group: Scan files\n     * integrations:\n     *   - service: Rust Parser\n     *     edgeDirection: LR\n     *     groupEdge: true\n     *     group: Parsers\n     *     icon: logos:rust\n     *   - service: Yaml parser\n     *     edgeDirection: RL\n     *     icon: vscode-icons:file-type-yaml\n     */\n    async * scanFiles(pattern: string, exclude?: string, verbose: boolean = false){\n        const ignore = ['**/node_modules/**', 'dist'];\n        if (exclude) {\n            ignore.push(exclude);\n        }\n        const stream = await fg.globStream(pattern, { ignore });\n        for await (const filePath of stream) {\n            const fileName = filePath.toString().split('/').slice(1).join('/');\n            const sourceCode = await this.loadSourceFile(filePath.toString());\n            const integrations = this.parser.parse(sourceCode, verbose);\n            if (integrations.length > 0) {\n                const repo = await getGitRepository(path.dirname(filePath.toString()));\n                yield { repo, path: fileName, integrations, sourceCode };\n            }\n        }\n    }\n}\n"},{"startPosition":{"row":5,"column":0},"endPosition":{"row":19,"column":3},"yaml":{"service":"integraph CLI","icon":"logos:terminal","integrations":[{"service":"Architecture Diagram","edgeDirection":"RL","group":"Diagrams","icon":"ix:diagram-module"},{"service":"Integraph Runner","group":"Scan files","edgeDirection":"TB","groupEdge":true,"icon":"vscode-icons:file-type-search-result"}]},"path":"cli/index.ts","repo":"https://github.com/danilosampaio/integraph/blob/main","sourceCode":"#!/usr/bin/env node\n\nimport { program } from \"commander\";\nimport { generateArchDiagram, generateHtml, scanIntegrations } from '../utils';\n\n/**\n * @integraph\n * service: integraph CLI\n * icon: logos:terminal\n * integrations:\n *   - service: Architecture Diagram\n *     edgeDirection: RL\n *     group: Diagrams\n *     icon: ix:diagram-module\n *   - service: Integraph Runner\n *     group: Scan files\n *     edgeDirection: TB\n *     groupEdge: true\n *     icon: vscode-icons:file-type-search-result\n */\nprogram\n  .version(\"1.0.0\")\n  .description(\"Integraph CLI\")\n  .option(\"-d, --directory <string>\", \"Root directly to scan files.\")\n  .option(\"-e, --exclude <string>\", \"Directory to exclude from scanning.\")\n  .option(\"-v, --verbose\", \"Verbose mode.\")\n  .action(async (options) => {\n    const integrations = await scanIntegrations(options);\n    const diagram = await generateArchDiagram(integrations);\n    await generateHtml(diagram, integrations);\n  });\n\nprogram.parse(process.argv);"},{"startPosition":{"row":3,"column":0},"endPosition":{"row":12,"column":3},"yaml":{"service":"Architecture Diagram","group":"Diagrams","icon":"ix:diagram-module","integrations":[{"service":"mermaid","edgeDirection":"BT","icon":"vscode-icons:file-type-mermaid"}]},"path":"diagrams/architecture.ts","repo":"https://github.com/danilosampaio/integraph/blob/main","sourceCode":"import { ArchitectureDiagramDescription, Integraph, IntegraphYamlBlock, IntegrationDescription } from '../types/types';\nimport { removeSpecialChars, sanitizeComponentName } from '../utils';\n\n/**\n * @integraph\n * service: Architecture Diagram\n * group: Diagrams\n * icon: ix:diagram-module\n * integrations:\n *   - service: mermaid\n *     edgeDirection: BT\n *     icon: vscode-icons:file-type-mermaid\n */\nexport class ArchitectureDiagram {\n    drawn(data: IntegraphYamlBlock[]) {\n        const diagramDescription = {\n            groups: [],\n            services: [],\n            connections: []\n        } as ArchitectureDiagramDescription;\n\n        data.forEach((component => {\n            const yaml = component.yaml;\n            const serviceName = yaml.service || yaml.application || yaml.database || '';\n            this.addService(diagramDescription, yaml, serviceName);\n            yaml?.integrations?.forEach((integration: IntegrationDescription) => this.addIntegration(diagramDescription, integration, serviceName));\n        }))\n\n        return this.generateDiagram(diagramDescription);\n    }\n\n    generateDiagram(diagramDescription: ArchitectureDiagramDescription) {\n        const diagram = `\\narchitecture-beta\n    ${diagramDescription.groups.join('\\n    ')}\\n\n    ${diagramDescription.services.join('\\n    ')}\\n\n    ${diagramDescription.connections.join('\\n    ')}`;\n\n        return diagram;\n    }\n\n    addIntegration(diagramDescription: ArchitectureDiagramDescription, integration: IntegrationDescription, serviceName: string) {\n        const originEdgeDirection = integration.edgeDirection ? integration.edgeDirection.at(0) : 'R';\n        const targetEdgeDirection = integration.edgeDirection ? integration.edgeDirection.at(1) : 'L';\n        const integrationName = integration.application || integration.service || integration.database || '';\n        const integrationIcon = integration.icon ? `(${integration.icon})` : '(server)';\n\n        let integrationDescription = `service ${sanitizeComponentName(integrationName)}${integrationIcon}[${removeSpecialChars(integrationName)}]`;\n        if (integration?.group) {\n            const integrationGroupName = sanitizeComponentName(integration.group);\n            integrationDescription += ` in ${integrationGroupName}`;\n\n            if (!diagramDescription.groups.find(g => g.startsWith(`group ${integrationGroupName}`))){\n                const integrationGroup = `group ${integrationGroupName}[${removeSpecialChars(integration.group)}]`;\n                diagramDescription.groups.push(integrationGroup);\n            }\n        }\n\n        if (!diagramDescription.services.find(s => s.startsWith(`service ${sanitizeComponentName(integrationName)}`))){\n            diagramDescription.services.push(integrationDescription);\n        }\n\n        const groupEdge = integration.groupEdge ? '{group}' : '';\n        const edgeText = integration.description\n            ? `[${sanitizeComponentName(serviceName)}__${sanitizeComponentName(integrationName)}__${removeSpecialChars(integration.description)}]`\n            : `[${sanitizeComponentName(serviceName)}__${sanitizeComponentName(integrationName)}]`;\n        const edge = integration.arrowedEdge ? `-${edgeText}->` : `-${edgeText}-`;\n        \n        const edgeStatement = `${sanitizeComponentName(serviceName)}:${originEdgeDirection} ${edge} ${targetEdgeDirection}:${sanitizeComponentName(integrationName)}${groupEdge}`;\n        \n        if (!diagramDescription.connections.find(e => e === edgeStatement)) {\n            diagramDescription.connections.push(edgeStatement);\n        }\n    }\n\n    addService(diagramDescription: ArchitectureDiagramDescription, component: Integraph, serviceName: string) {\n        const serviceIcon = component.icon ? `(${component.icon})` : '(server)';\n        let serviceDescription = `service ${sanitizeComponentName(serviceName)}${serviceIcon}[${removeSpecialChars(serviceName)}]`;\n        \n        if (component?.group) {\n            const groupIcon = '';\n            const groupName = sanitizeComponentName(component.group);\n            const group = `group ${groupName}${groupIcon}[${removeSpecialChars(component.group)}]`;\n            if (!diagramDescription.groups.find(g => g.startsWith(`group ${groupName}`))){\n                diagramDescription.groups.push(group);\n            }\n            serviceDescription += ` in ${sanitizeComponentName(component.group)}`;\n        }\n        \n        if (!diagramDescription.services.find(s => s.startsWith(`service ${sanitizeComponentName(serviceName)}`))){\n            diagramDescription.services.push(serviceDescription);\n        }\n    }\n}"},{"startPosition":{"row":5,"column":0},"endPosition":{"row":14,"column":3},"yaml":{"service":"Java Parser","group":"Parsers","icon":"logos:java","integrations":[{"service":"tree-sitter","edgeDirection":"LB","icon":"logos:treehouse-icon"}]},"path":"parsers/java/JavaIntegraphParser.ts","repo":"https://github.com/danilosampaio/integraph/blob/main","sourceCode":"import Java from 'tree-sitter-java';\nimport IntegraphParser from '../IntegraphParser';\nimport JavaSanitizer from './lib/JavaSanitizer';\nimport JavaNodeHandler from './lib/JavaNodeHandler';\n\n/**\n * @integraph\n * service: Java Parser\n * group: Parsers\n * icon: logos:java\n * integrations:\n *   - service: tree-sitter\n *     edgeDirection: LB\n *     icon: logos:treehouse-icon\n */\nexport default class JavaIntegraphParser extends IntegraphParser {\n    constructor() {\n        super(Java, new JavaSanitizer(), new JavaNodeHandler())\n    }  \n}\n"},{"startPosition":{"row":5,"column":0},"endPosition":{"row":14,"column":3},"yaml":{"service":"Python Parser","group":"Parsers","icon":"logos:python","integrations":[{"service":"tree-sitter","edgeDirection":"LB","icon":"logos:treehouse-icon"}]},"path":"parsers/python/PythonIntegraphParser.ts","repo":"https://github.com/danilosampaio/integraph/blob/main","sourceCode":"import Python from 'tree-sitter-python';\nimport IntegraphParser from '../IntegraphParser';\nimport PythonSanitizer from './lib/PythonSanitizer';\nimport PythonNodeHandler from './lib/PythonNodeHandler';\n\n/**\n * @integraph\n * service: Python Parser\n * group: Parsers\n * icon: logos:python\n * integrations:\n *   - service: tree-sitter\n *     edgeDirection: LB\n *     icon: logos:treehouse-icon\n */\nexport default class PythonIntegraphParser extends IntegraphParser {\n    constructor() {\n        super(Python, new PythonSanitizer(), new PythonNodeHandler())\n    }  \n}\n"},{"startPosition":{"row":5,"column":0},"endPosition":{"row":14,"column":3},"yaml":{"service":"Rust Parser","group":"Parsers","icon":"logos:rust","integrations":[{"service":"tree-sitter","edgeDirection":"LB","icon":"logos:treehouse-icon"}]},"path":"parsers/rust/RustIntegraphParser.ts","repo":"https://github.com/danilosampaio/integraph/blob/main","sourceCode":"import Rust from 'tree-sitter-rust';\nimport IntegraphParser from '../IntegraphParser';\nimport RustSanitizer from './lib/RustSanitizer';\nimport RustNodeHandler from './lib/RustNodeHandler';\n\n/**\n * @integraph\n * service: Rust Parser\n * group: Parsers\n * icon: logos:rust\n * integrations:\n *   - service: tree-sitter\n *     edgeDirection: LB\n *     icon: logos:treehouse-icon\n */\nexport default class RustIntegraphParser extends IntegraphParser {\n    constructor() {\n        super(Rust, new RustSanitizer(), new RustNodeHandler())\n    }  \n}\n"},{"startPosition":{"row":5,"column":0},"endPosition":{"row":14,"column":3},"yaml":{"service":"Typescript Parser","group":"Parsers","icon":"logos:typescript-icon","integrations":[{"service":"tree-sitter","edgeDirection":"LR","icon":"logos:treehouse-icon"}]},"path":"parsers/typescript/TypescriptIntegraphParser.ts","repo":"https://github.com/danilosampaio/integraph/blob/main","sourceCode":"import TypeScript from 'tree-sitter-typescript';\nimport IntegraphParser from '../IntegraphParser';\nimport TypescriptSanitizer from './lib/TypescriptSanitizer';\nimport TypescriptNodeHandler from './lib/TypescriptNodeHandler';\n\n/**\n * @integraph\n * service: Typescript Parser\n * group: Parsers\n * icon: logos:typescript-icon\n * integrations:\n *   - service: tree-sitter\n *     edgeDirection: LR\n *     icon: logos:treehouse-icon\n */\nexport default class TypescriptIntegraphParser extends IntegraphParser {\n    constructor() {\n        super(TypeScript.typescript, new TypescriptSanitizer(), new TypescriptNodeHandler())\n    }  \n}\n"},{"startPosition":{"row":11,"column":47},"endPosition":{"row":11,"column":71},"yaml":"// Remove @integraph key","path":"parsers/java/lib/JavaSanitizer.ts","repo":"https://github.com/danilosampaio/integraph/blob/main","sourceCode":"import { Sanitizer } from \"../../IntegraphParser\";\n\nexport default class JavaSanitizer implements Sanitizer {\n    sanitize(comment: string): string {\n        const regex = /\\/\\*\\*([\\s\\S]*?)\\*\\//g;\n        const matches = comment.match(regex);\n\n        if (matches) {\n            const yamlContent = matches[0]\n                .replace(/\\/\\*\\*|\\*\\//g, '')   // Remove /** e */\n                .replace(/^\\s*\\*\\s?/gm, '')    // Remove asteriscs at the begining of each line\n                .replace(/\\@integraph/gm, '')  // Remove @integraph key\n                .trim();                       // Remove leading and trailing spaces\n\n            return yamlContent;\n        } else {\n            return comment;\n        }\n    }\n} "},{"startPosition":{"row":9,"column":49},"endPosition":{"row":9,"column":90},"yaml":"// Remove as aspas triplas e o @integraph","path":"parsers/python/lib/PythonSanitizer.ts","repo":"https://github.com/danilosampaio/integraph/blob/main","sourceCode":"import { Sanitizer } from \"../../IntegraphParser\";\n\nexport default class PythonSanitizer implements Sanitizer {\n    sanitize(comment: string): string {\n        const regex = /\"\"\"([\\s\\S]*?)\"\"\"/g;\n        const matches = comment.match(regex);\n\n        if (matches) {\n            const yamlContent = matches[0]\n                .replace(/\"\"\"|@integraph/g, '')  // Remove as aspas triplas e o @integraph\n                .trim();                         // Remove espaços em branco no início e no fim\n            console.log({ yamlContent })\n            return yamlContent;\n        }\n\n        return comment;\n    }\n} "},{"startPosition":{"row":10,"column":62},"endPosition":{"row":10,"column":96},"yaml":"// Remove a linha com o @integraph","path":"parsers/rust/lib/RustSanitizer.ts","repo":"https://github.com/danilosampaio/integraph/blob/main","sourceCode":"import { Sanitizer } from \"../../IntegraphParser\";\n\nexport default class RustSanitizer implements Sanitizer {\n    sanitize(comment: string): string {\n        const regex = /\\/\\/\\/\\s?(.*)/g;\n        const matches = [...comment.matchAll(regex)];\n\n        if (matches) {\n            const yamlContent = matches\n                .map(match => match[1])                       // Extrai o conteúdo de cada linha\n                .filter(line => !line.includes('@integraph')) // Remove a linha com o @integraph\n                .join('\\n');                                  // Junta as linhas com quebras\n\n            return yamlContent;\n        }\n\n        return comment;\n    }\n} "},{"startPosition":{"row":11,"column":47},"endPosition":{"row":11,"column":71},"yaml":"// Remove @integraph key","path":"parsers/typescript/lib/TypescriptSanitizer.ts","repo":"https://github.com/danilosampaio/integraph/blob/main","sourceCode":"import { Sanitizer } from \"../../IntegraphParser\";\n\nexport default class TypescriptSanitizer implements Sanitizer {\n    sanitize(comment: string): string {\n        const regex = /\\/\\*\\*([\\s\\S]*?)\\*\\//g;\n        const matches = comment.match(regex);\n\n        if (matches) {\n            const yamlContent = matches[0]\n                .replace(/\\/\\*\\*|\\*\\//g, '')   // Remove /** e */\n                .replace(/^\\s*\\*\\s?/gm, '')    // Remove asteriscs at the begining of each line\n                .replace(/\\@integraph/gm, '')  // Remove @integraph key\n                .trim();                       // Remove leading and trailing spaces\n\n            return yamlContent;\n        } else {\n            return comment;\n        }\n    }\n} "}] }