#!/usr/bin/env node

import { program } from "commander";
import { generateArchDiagram, generateHtml, scanIntegrations } from '../utils';

/**
 * @integraph
 * service: integraph CLI
 * icon: logos:terminal
 * integrations:
 *   - service: Architecture Diagram
 *     edgeDirection: RL
 *   - service: Integraph Runner
 *     edgeDirection: TB
 *     groupEdge: true
 */
program
  .version("1.0.0")
  .description("Integraph CLI")
  .option("-d, --directory <string>", "Root directly to scan files.")
  .option("-e, --exclude <string>", "Directory to exclude from scanning.")
  .option("-v, --verbose", "Verbose mode.")
  .action(async (options) => {
    const integrations = await scanIntegrations(options);
    const diagram = await generateArchDiagram(integrations);
    await generateHtml(diagram, integrations);
  });

program.parse(process.argv);