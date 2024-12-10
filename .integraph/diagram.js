function getDiagram () { return `
architecture-beta
    group scanfiles[Scan files]
    group parsers[Parsers]
    group diagrams[Diagrams]

    service integraphrunner(vscode-icons:file-type-search-result)[Integraph Runner] in scanfiles
    service rustparser(logos:rust)[Rust Parser] in parsers
    service yamlparser(vscode-icons:file-type-yaml)[Yaml parser]
    service integraphcli(logos:terminal)[integraph CLI]
    service architecturediagram(ix:diagram-module)[Architecture Diagram] in diagrams
    service mermaid(vscode-icons:file-type-mermaid)[mermaid]
    service javaparser(logos:java)[Java Parser] in parsers
    service treesitter(logos:treehouse-icon)[tree_sitter]
    service pythonparser(logos:python)[Python Parser] in parsers
    service typescriptparser(logos:typescript-icon)[Typescript Parser] in parsers

    integraphrunner:L -[integraphrunner__rustparser]- R:rustparser{group}
    integraphrunner:R -[integraphrunner__yamlparser]- L:yamlparser
    integraphcli:R -[integraphcli__architecturediagram]- L:architecturediagram
    integraphcli:T -[integraphcli__integraphrunner]- B:integraphrunner{group}
    architecturediagram:B -[architecturediagram__mermaid]- T:mermaid
    javaparser:L -[javaparser__treesitter]- B:treesitter
    pythonparser:L -[pythonparser__treesitter]- B:treesitter
    rustparser:L -[rustparser__treesitter]- B:treesitter
    typescriptparser:L -[typescriptparser__treesitter]- R:treesitter` }