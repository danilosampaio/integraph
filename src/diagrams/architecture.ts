import { ArchitectureDiagramDescription, Integraph, IntegraphYamlBlock, IntegrationDescription, Service } from '../types/types';
import { removeSpecialChars, sanitizeComponentName } from '../utils';

/**
 * @integraph
 * service: Architecture Diagram
 * group: Diagrams
 * icon: ix:diagram-module
 * integrations:
 *   - service: mermaid
 *     edgeDirection: BT
 *     icon: vscode-icons:file-type-mermaid
 */
export class ArchitectureDiagram {
    drawn(data: IntegraphYamlBlock[]) {
        const diagramDescription = {
            groups: [],
            services: [],
            connections: []
        } as ArchitectureDiagramDescription;

        data.forEach((component => {
            const yaml = component.yaml;
            const serviceName = yaml.service || yaml.application || yaml.database || '';
            this.addService(diagramDescription, yaml, serviceName);
            yaml?.integrations?.forEach((integration: IntegrationDescription) => this.addIntegration(diagramDescription, integration, serviceName));
        }))

        return this.generateDiagram(diagramDescription);
    }

    generateDiagram(diagramDescription: ArchitectureDiagramDescription) {
        const diagram = `\narchitecture-beta
    ${diagramDescription.groups.join('\n    ')}\n
    ${diagramDescription.services.map(s => `service ${s.name}${s.icon}[${s.label}]${s.group}`).join('\n    ')}\n
    ${diagramDescription.connections.join('\n    ')}`;

        return diagram;
    }

    addIntegration(diagramDescription: ArchitectureDiagramDescription, integration: IntegrationDescription, serviceName: string) {
        const originEdgeDirection = integration.edgeDirection ? integration.edgeDirection.at(0) : 'R';
        const targetEdgeDirection = integration.edgeDirection ? integration.edgeDirection.at(1) : 'L';
        const integrationName = integration.application || integration.service || integration.database || '';
        const integrationIcon = integration.icon ? `(${integration.icon})` : '';

        let integrationDescription = `service ${sanitizeComponentName(integrationName)}${integrationIcon}[${removeSpecialChars(integrationName)}]`;
        const service: Service = {
            name: sanitizeComponentName(integrationName),
            icon: integrationIcon,
            label: removeSpecialChars(integrationName),
            group: ''
        }
        if (integration?.group) {
            service.group = ` in ${sanitizeComponentName(integration.group)}`;
            const integrationGroupName = sanitizeComponentName(integration.group);
            integrationDescription += ` in ${integrationGroupName}`;

            if (!diagramDescription.groups.find(g => g.startsWith(`group ${integrationGroupName}`))){
                const integrationGroup = `group ${integrationGroupName}[${removeSpecialChars(integration.group)}]`;
                diagramDescription.groups.push(integrationGroup);
            }
        }

        this.addOrMergeService(diagramDescription, service, integration);

        const groupEdge = integration.groupEdge ? '{group}' : '';
        const edgeText = integration.description
            ? `[${sanitizeComponentName(serviceName)}__${sanitizeComponentName(integrationName)}__${removeSpecialChars(integration.description)}]`
            : `[${sanitizeComponentName(serviceName)}__${sanitizeComponentName(integrationName)}]`;
        const edge = integration.arrowedEdge ? `-${edgeText}->` : `-${edgeText}-`;
        
        const edgeStatement = `${sanitizeComponentName(serviceName)}:${originEdgeDirection} ${edge} ${targetEdgeDirection}:${sanitizeComponentName(integrationName)}${groupEdge}`;
        
        if (!diagramDescription.connections.find(e => e === edgeStatement)) {
            diagramDescription.connections.push(edgeStatement);
        }
    }

    addService(diagramDescription: ArchitectureDiagramDescription, component: Integraph, serviceName: string) {
        const serviceIcon = component.icon ? `(${component.icon})` : '';
        let serviceDescription = `service ${sanitizeComponentName(serviceName)}${serviceIcon}[${removeSpecialChars(serviceName)}]`;
        const service: Service = {
            name: sanitizeComponentName(serviceName),
            icon: serviceIcon,
            label: removeSpecialChars(serviceName),
            group: ''
        }
        
        if (component?.group) {
            service.group = ` in ${sanitizeComponentName(component.group)}`;
            const groupIcon = '';
            const groupName = sanitizeComponentName(component.group);
            const group = `group ${groupName}${groupIcon}[${removeSpecialChars(component.group)}]`;
            if (!diagramDescription.groups.find(g => g.startsWith(`group ${groupName}`))){
                diagramDescription.groups.push(group);
            }
            serviceDescription += ` in ${sanitizeComponentName(component.group)}`;
        }
        
        this.addOrMergeService(diagramDescription, service, component);
    }

    addOrMergeService(diagramDescription: ArchitectureDiagramDescription, service: Service, component: Integraph) {
        if (!service.name) return;
        const existentServiceIndex = diagramDescription.services.findIndex(s => s.name === service.name);
        if (existentServiceIndex == -1){
            diagramDescription.services.push({
                ...service,
                icon: component.database ? '(database)' : '(server)'
            });
        } else {
            diagramDescription.services[existentServiceIndex] = this.mergeServiceAttributes(service, diagramDescription.services[existentServiceIndex], component);
        }
    }

    mergeServiceAttributes(service1: Service, service2: Service, component: Integraph) {
        const defaultIcon = component.database ? '(database)' : '(server)';
        return {
            name: service1.name,
            icon: service1.icon || service2.icon || defaultIcon,
            label: service1.label || service2.label,
            group: service1.group || service2.group
        };
    }
}