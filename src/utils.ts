import fs from 'node:fs/promises';
import { ArchitectureDiagram } from "./diagrams/architecture";
import IntegraphRunner from "./IntegraphRunner";
import TypescriptIntegraphParser from "./parsers/typescript/TypescriptIntegraphParser";
import { Integraph } from "./types/types";

export const scanIntegrations = async (directory: string, verbose: boolean = false) => {
    const typescriptRunner = new IntegraphRunner(new TypescriptIntegraphParser());
    const pattern = `${directory}/**/*.{js,ts}`;
    const integrations = [];
    for await (const entry of typescriptRunner.scanFiles(pattern, verbose)) {
        integrations.push(...entry.integrations);
    }
    return integrations;
}

export const generateArchDiagram = async (integrations: Integraph[]) => {
    const architectureDiagram = new ArchitectureDiagram();
    return architectureDiagram.drawn(integrations); 
}

export const generateHtml = async (diagram: string) => {
    const template = await fs.readFile(`${__dirname.replace('dist','src')}/assets/template.html`, { encoding: 'utf-8' });
    const outputDir = `${process.cwd()}/.integraph`;
    const filePath = `${outputDir}/arch.html`;
    try {
      await fs.stat(outputDir);
    } catch (e) {
      await fs.mkdir(outputDir);
    }
    const fileContent = template.replace('{{diagram}}', diagram);
    await fs.writeFile(filePath, fileContent, { encoding: 'utf-8', flag: 'w+' });
}