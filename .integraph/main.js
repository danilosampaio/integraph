function setupEdges(minimalSetup, EditorView) {
    const edges = document.getElementsByClassName('edge');
    if (edges.length > 0) {
        for (let index = 0; index < edges.length; index++) {
            const element = edges[index];
            const { id, idAndText } = updateEdgeText(element);
            if (idAndText) {
                addEdgeOnClickListener(element.parentNode, id, minimalSetup, EditorView);
            }
        }
    }
}

/**
 * Removes the id from the edge text (e.g from this "service1__service3__Customer Service" into this "Customer Service")
 * and retuns a object with all attributes separately  
 */
function updateEdgeText(element) {
    let idAndText = '';
    let id = '';
    let text = '';
    const parent = element.parentNode;
    if (parent.childElementCount > 0) {
        parent.childNodes.forEach(n => {
            if (n.hasChildNodes()) {
                idAndText = n.firstChild.textContent;
                if (idAndText) {
                    const parts = idAndText.split('__');
                    id = `${parts[0]}.${parts[1]}`;
                    if (parts.length > 2) {
                        text = parts[2];
                        const tspan = n.querySelector('.text-outer-tspan');
                        while(n.querySelector('.text-outer-tspan')) {
                            n.querySelector('.text-outer-tspan').remove();
                        }
                        tspan.textContent = text;
                        n.querySelector('text').appendChild(tspan);
                    } else {
                        n.textContent = '';
                    }
                }
            }
        })
    }

    return {
        id,
        idAndText
    };
}

/**
 * Open the CodeMirror editor with the file content that implements the integration (edge) 
 */
function addEdgeOnClickListener (element, id, minimalSetup, EditorView) {
    element.addEventListener('click', (e) => {
        const integrations = getIntegrations();
        const serviceName = (s) => sanitizeComponentName(s.yaml.service || s.yaml.application || s.yaml.database);
        const integrationName = (i) => sanitizeComponentName(i.service || i.application || i.database);
        const idParts = id.split('.');
        const service = integrations.find(s => serviceName(s) === idParts[0] &&
            s?.yaml?.integrations?.find(i => integrationName(i) === idParts[1]));

        if (service) {
            const targetElement = document.querySelector('.editor');
            openCodeEditor(targetElement, service.sourceCode, minimalSetup, EditorView);
        }
    });
}

function openDiagramSourceCode (minimalSetup, EditorView) {
    const targetElement = document.querySelector('.editor');
    openCodeEditor(targetElement, getDiagram(), minimalSetup, EditorView);
}

function openIntegrations (minimalSetup, EditorView) {
    const targetElement = document.querySelector('.editor');
    openCodeEditor(targetElement, JSON.stringify(getIntegrations(), null,'\t'), minimalSetup, EditorView);
}

function openCodeEditor (targetElement, sourceCode, minimalSetup, EditorView) {
    targetElement.innerHTML = '';
    new EditorView({
        doc: sourceCode,
        extensions: [
            minimalSetup,
        ],
        parent: targetElement,
    });
    const editorDialog = document.getElementById('editorDialog');
    editorDialog.showModal();
}

function sanitizeComponentName (name) {
    return name.replace(/[^A-Z0-9]/ig, '').toLowerCase();
}

function initializeMermaid (mermaid) {
    mermaid.registerIconPacks([
        {
            name: 'logos',
            loader: () =>
            fetch('https://unpkg.com/@iconify-json/logos@1/icons.json').then((res) => res.json()),
        },
        {
            name: 'ix',
            loader: () =>
            fetch('https://unpkg.com/@iconify-json/ix@1.2.0/icons.json').then((res) => res.json()),
        },
        {
            name: 'vscode-icons',
            loader: () =>
            fetch('https://unpkg.com/@iconify-json/vscode-icons@1.2.3/icons.json').then((res) => res.json()),
        }
    ]);
    mermaid.initialize({
        startOnLoad: true,
        securityLevel: 'loose',
        htmlLabels: true,
        layout: 'elk',
        elk: {
            mergeEdges: true,
            nodePlacementStrategy: 'BRANDES_KOEPF',
            cycleBreakingStrategy: 'GREEDY_MODEL_ORDER'
        }
    });
}