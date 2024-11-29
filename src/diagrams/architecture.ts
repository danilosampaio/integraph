import { ArchitectureDiagramDescription, Integraph, IntegrationDescription } from '../types/types';

export class ArchitectureDiagram {
    drawn(data: Integraph[]) {
        const diagramDescription = {
            groups: [],
            services: [],
            connections: []
        } as ArchitectureDiagramDescription;

        data.forEach((component => {
            const serviceName = component.service || component.application || component.database || '';
            this.addService(diagramDescription, component, serviceName);
            component?.integrations?.forEach(integration => this.addIntegration(diagramDescription, integration, serviceName));
        }))

        return this.generateDiagram(diagramDescription);
    }

    generateDiagram(diagramDescription: ArchitectureDiagramDescription) {
        const diagram = `\narchitecture-beta
        ${diagramDescription.groups.join('\n    ')}
        ${diagramDescription.services.join('\n    ')}
        ${diagramDescription.connections.join('\n    ')}`;

        return diagram;
    }

    sanitizeComponentName(name: string) {
        return name.replace(/[^A-Z0-9]/ig, '').toLowerCase();
    }

    removeSpecialChars(name: string) {
        return name.replace(/[!@#$%^&*]/g, '').replace('-','_').replace('/',' ');
    }

    addIntegration(diagramDescription: ArchitectureDiagramDescription, integration: IntegrationDescription, serviceName: string) {
        const originEdgeDirection = integration.edgeDirection ? integration.edgeDirection.at(0) : 'R';
        const targetEdgeDirection = integration.edgeDirection ? integration.edgeDirection.at(1) : 'L';
        const integrationName = integration.application || integration.service || integration.database || '';
        const integrationIcon = integration.icon ? `(${integration.icon})` : '';

        let integrationDescription = `service ${this.sanitizeComponentName(integrationName)}${integrationIcon}[${this.removeSpecialChars(integrationName)}]`;
        if (integration?.group) {
            const integrationGroupName = this.sanitizeComponentName(integration.group);
            integrationDescription += ` in ${integrationGroupName}`;

            if (!diagramDescription.groups.find(g => g.startsWith(`group ${integrationGroupName}`))){
                const integrationGroup = `group ${integrationGroupName}[${this.removeSpecialChars(integration.group)}]`;
                diagramDescription.groups.push(integrationGroup);
            }
        }

        if (!diagramDescription.services.find(s => s.startsWith(`service ${this.sanitizeComponentName(integrationName)}`))){
            diagramDescription.services.push(integrationDescription);
        }

        const groupEdge = integration.groupEdge ? '{group}' : '';
        const edge = integration.arrowedEdge ? '-->' : '--';
        diagramDescription.connections.push(
            `${this.sanitizeComponentName(serviceName)}:${originEdgeDirection} ${edge} ${targetEdgeDirection}:${this.sanitizeComponentName(integrationName)}${groupEdge}`
        );
    }

    addService(diagramDescription: ArchitectureDiagramDescription, component: Integraph, serviceName: string) {
        const serviceIcon = component.icon ? `(${component.icon})` : '';
        let serviceDescription = `service ${this.sanitizeComponentName(serviceName)}${serviceIcon}[${this.removeSpecialChars(serviceName)}]`;
        
        if (component?.group) {
            const groupIcon = '';
            const groupName = this.sanitizeComponentName(component.group);
            const group = `group ${groupName}${groupIcon}[${this.removeSpecialChars(component.group)}]`;
            if (!diagramDescription.groups.find(g => g.startsWith(`group ${groupName}`))){
                diagramDescription.groups.push(group);
            }
            serviceDescription += ` in ${this.sanitizeComponentName(component.group)}`;
        }
        
        if (!diagramDescription.services.find(s => s.startsWith(`service ${this.sanitizeComponentName(serviceName)}`))){
            diagramDescription.services.push(serviceDescription);
        }
    }
}