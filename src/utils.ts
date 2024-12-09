import fs from 'node:fs/promises';
import simpleGit from 'simple-git';
import { ArchitectureDiagram } from "./diagrams/architecture";
import IntegraphRunner from "./IntegraphRunner";
import TypescriptIntegraphParser from "./parsers/typescript/TypescriptIntegraphParser";
import { IntegraphYamlBlock } from "./types/types";

export const scanIntegrations = async (options: { directory: string; verbose?: boolean; exclude?: string; }) => {
    const typescriptRunner = new IntegraphRunner(new TypescriptIntegraphParser());
    const pattern = `${options.directory}/**/*.{js,ts}`;
    const integrations: IntegraphYamlBlock[] = [];
    for await (const entry of typescriptRunner.scanFiles(pattern, options.exclude, options.verbose)) {
        const mappedIntegrations = entry.integrations.map(i => {
          return {
            ...i,
            path: entry.path,
			      repo: entry.repo,
            sourceCode: entry.sourceCode
          }
        })
        integrations.push(...mappedIntegrations);
    }
    return integrations;
}

export const generateArchDiagram = async (integrations: IntegraphYamlBlock[]) => {
    const architectureDiagram = new ArchitectureDiagram();
    return architectureDiagram.drawn(integrations); 
}

export const generateHtml = async (diagram: string, integrations: IntegraphYamlBlock[]) => {
    const template = await fs.readFile(`${__dirname.replace('dist','src')}/assets/template.html`, { encoding: 'utf-8' });
    const mainJs = await fs.readFile(`${__dirname.replace('dist','src')}/assets/main.js`, { encoding: 'utf-8' });
    const mainCSS = await fs.readFile(`${__dirname.replace('dist','src')}/assets/main.css`, { encoding: 'utf-8' });
    const outputDir = `${process.cwd()}/.integraph`;
    const filePath = `${outputDir}/arch.html`;
    try {
      await fs.stat(outputDir);
    } catch (e) {
      await fs.mkdir(outputDir);
    }
    const fileContent = template.replace('{{diagram}}', diagram);
    await fs.writeFile(filePath, fileContent, { encoding: 'utf-8', flag: 'w+' });
    await fs.writeFile(`${outputDir}/main.js`, mainJs, { encoding: 'utf-8', flag: 'w+' });
    await fs.writeFile(`${outputDir}/main.css`, mainCSS, { encoding: 'utf-8', flag: 'w+' });
    await fs.writeFile(`${outputDir}/integrations.js`, `function getIntegrations () { return ${JSON.stringify(integrations)} }`, { encoding: 'utf-8', flag: 'w+' });
}

export const getGitRepository = async (path: string) => {
	try {
    const git = simpleGit();
    git.cwd(path);
    const isRepo = await git.checkIsRepo();
    const hasRemotes = await git.getRemotes();
    if (isRepo && hasRemotes) {
      const url = await git.listRemote(['--get-url']);
      const branch = await git.branchLocal();
      const repo = url.replace('\n','').replace('.git', `/blob/${branch.current}`);
      return repo;
    }
  } catch (e) {}
}

export const sanitizeComponentName = (name: string) => {
  return name.replace(/[^A-Z0-9]/ig, '').toLowerCase();
}

export const removeSpecialChars = (name: string) => {
  return name.replace(/[!@#$%^&*]/g, '').replace('-','_').replace('/',' ');
}