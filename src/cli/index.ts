#!/usr/bin/env node

import { program } from "commander";
import { generateArchDiagram, generateHtml, scanIntegrations } from '../utils';

program
  .version("1.0.0")
  .description("Integraph CLI")
  .option("-d, --directory <string>", "Root directly to scan files.")
  .option("-v, --verbose", "Verbose mode.")
  .action(async (options) => {
    const integrations = await scanIntegrations(options.directory, options.verbose);
    const diagram = await generateArchDiagram(integrations);
    await generateHtml(diagram);
  });

program.parse(process.argv);